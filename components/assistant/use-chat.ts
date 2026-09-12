"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {AssistantAnswer, ChatMessage, ChatStreamEvent, EvidenceSource} from "@/lib/bis/types";

/** How many prior turns travel back to the model as `history`. */
const HISTORY_LIMIT = 6;
export const STORAGE_KEY = "bis_saathi_chat_history";

const NETWORK_ERROR = "Could not reach the assistant. Check your connection and try again.";
const EMPTY_ERROR = "The assistant did not return an answer. Please try asking again.";

export interface UseChatResult {
    messages: ChatMessage[];
    /** Current progress label streamed from the server, or null when idle. */
    status: string | null;
    /** Partial summary text while the answer is still generating. */
    streamingText: string;
    /** Evidence that arrived before the final answer (kept in sync with the answer once it lands). */
    pendingSources: EvidenceSource[];
    isLoading: boolean;
    error: string | null;
    ask: (question: string, locale?: string) => Promise<void>;
    stop: () => void;
    reset: () => void;
}

interface StreamState {
    text: string;
    sources: EvidenceSource[];
    answer: AssistantAnswer | null;
    error: string | null;
}

function isStreamEvent(value: unknown): value is ChatStreamEvent {
    return typeof value === "object" && value !== null && typeof (value as {type?: unknown}).type === "string";
}

function isAbort(reason: unknown): boolean {
    return typeof reason === "object" && reason !== null && (reason as {name?: unknown}).name === "AbortError";
}

function loadStoredMessages(): ChatMessage[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        /* ignore localStorage parse issues */
    }
    return [];
}

export function useChat(): UseChatResult {
    const [messages, setMessages] = useState<ChatMessage[]>(loadStoredMessages);
    const [status, setStatus] = useState<string | null>(null);
    const [streamingText, setStreamingText] = useState("");
    const [pendingSources, setPendingSources] = useState<EvidenceSource[]>(() => {
        const initial = loadStoredMessages();
        const lastAssistant = [...initial].reverse().find((m) => m.role === "assistant" && m.answer?.sources);
        return lastAssistant?.answer?.sources ?? [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const loadingRef = useRef(false);
    const messagesRef = useRef<ChatMessage[]>(messages);

    // Sync to localStorage
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                if (messages.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch {
            /* ignore storage errors */
        }
    }, [messages]);

    const pushMessage = useCallback((message: ChatMessage) => {
        messagesRef.current = [...messagesRef.current, message];
        setMessages(messagesRef.current);
    }, []);

    const stop = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
    }, []);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        loadingRef.current = false;
        messagesRef.current = [];
        setMessages([]);
        setStatus(null);
        setStreamingText("");
        setPendingSources([]);
        setIsLoading(false);
        setError(null);
        try {
            if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    }, []);

    const ask = useCallback(async (question: string, locale?: string) => {
        const trimmed = question.trim();
        if (!trimmed || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        setError(null);
        setStatus(null);
        setStreamingText("");
        setPendingSources([]);

        const history = messagesRef.current.slice(-HISTORY_LIMIT);
        pushMessage({role: "user", content: trimmed});

        const controller = new AbortController();
        abortRef.current = controller;

        // Stream-local accumulators. React state mirrors these; this object owns the truth.
        const stream: StreamState = {text: "", sources: [], answer: null, error: null};

        const handleEvent = (event: ChatStreamEvent) => {
            switch (event.type) {
                case "status":
                    if (typeof event.label === "string" && event.label) setStatus(event.label);
                    return;
                case "sources":
                    stream.sources = Array.isArray(event.sources) ? event.sources : [];
                    setPendingSources(stream.sources);
                    return;
                case "delta":
                    if (typeof event.text !== "string" || !event.text) return;
                    stream.text += event.text;
                    setStreamingText(stream.text);
                    return;
                case "answer": {
                    const answer = event.answer;
                    if (!answer || typeof answer !== "object") return;
                    stream.answer = answer;
                    stream.text = "";
                    setStreamingText("");
                    setStatus(null);
                    if (Array.isArray(answer.sources) && answer.sources.length > 0) {
                        stream.sources = answer.sources;
                        setPendingSources(answer.sources);
                    }
                    pushMessage({role: "assistant", content: answer.summary ?? "", answer});
                    return;
                }
                case "error":
                    stream.error = event.message || EMPTY_ERROR;
                    return;
                default:
                    return;
            }
        };

        const handleLine = (raw: string) => {
            const line = raw.trim();
            if (!line) return;
            let parsed: unknown;
            try {
                parsed = JSON.parse(line);
            } catch {
                // A malformed line must never kill the stream.
                return;
            }
            if (isStreamEvent(parsed)) {
                handleEvent(parsed);
                return;
            }
            // Validation failures come back as plain JSON (`{ "error": "..." }`), not as an event.
            const message = (parsed as {error?: unknown} | null)?.error;
            if (typeof message === "string" && message) stream.error = message;
        };

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question: trimmed, history, locale}),
                signal: controller.signal,
            });

            const body = response.body;
            if (!body) throw new Error(`No response body (status ${response.status})`);

            const reader = body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            for (;;) {
                const {done, value} = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {stream: true});
                // Only complete lines are parsed; a partial trailing line stays in the buffer.
                let newline = buffer.indexOf("\n");
                while (newline !== -1) {
                    handleLine(buffer.slice(0, newline));
                    buffer = buffer.slice(newline + 1);
                    newline = buffer.indexOf("\n");
                }
            }

            // Flush any multi-byte remainder, then the final unterminated line.
            buffer += decoder.decode();
            handleLine(buffer);

            if (stream.error) {
                setError(stream.error);
            } else if (!stream.answer) {
                if (stream.text.trim()) {
                    // The model produced prose but never a structured answer: keep the prose.
                    pushMessage({role: "assistant", content: stream.text});
                    setStreamingText("");
                } else {
                    setError(response.ok ? EMPTY_ERROR : NETWORK_ERROR);
                }
            }
        } catch (cause) {
            if (controller.signal.aborted || isAbort(cause)) {
                // A user-initiated stop is not an error. Keep whatever was generated.
                if (stream.text.trim()) pushMessage({role: "assistant", content: stream.text});
                setStreamingText("");
            } else {
                setError(NETWORK_ERROR);
            }
        } finally {
            if (abortRef.current === controller) abortRef.current = null;
            loadingRef.current = false;
            setIsLoading(false);
            setStatus(null);
        }
    }, [pushMessage]);

    return {messages, status, streamingText, pendingSources, isLoading, error, ask, stop, reset};
}
