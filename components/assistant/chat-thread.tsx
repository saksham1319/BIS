"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {FormEvent, KeyboardEvent} from "react";
import {ArrowUp, CaretDown, Microphone, SealCheck, WarningCircle, X} from "@phosphor-icons/react";
import {useLocale} from "next-intl";
import type {Locale} from "@/i18n/locales";
import type {ChatMessage} from "@/lib/bis/types";
import {AnswerCard} from "./answer-card";
import {RetrievalState} from "./retrieval-state";
import {useSpeechRecognition} from "./use-speech-recognition";

export const EXAMPLE_QUESTIONS = [
    "I manufacture stainless steel water bottles. Which Indian Standard applies and do I need BIS certification?",
    "Is BIS registration mandatory for a power bank sold in India?",
    "Which BIS-recognised labs can test a two-wheeler helmet under IS 4151?",
    "How do I check if my gold jewellery hallmark is genuine?",
] as const;

const BOTTOM_THRESHOLD = 120;
const MAX_COMPOSER_HEIGHT = 168;

export interface ChatThreadProps {
    messages: ChatMessage[];
    status: string | null;
    streamingText: string;
    isLoading: boolean;
    error: string | null;
    onAsk: (question: string) => void;
    onStop: () => void;
    onCitation: (sourceId: string) => void;
    onOpenView: (view: string, payload?: { standardId?: string; query?: string }) => void;
    /** Text pushed into the composer from the outside. Syncs whenever the value changes. */
    prefill?: string;
    /** Also fired when the user taps "Add detail" on a clarifying question. */
    onClarify?: (question: string) => void;
}

function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Nearest ancestor that actually scrolls. The app shell owns the scroll container, not this component. */
function findScrollParent(node: HTMLElement | null): HTMLElement | null {
    let current = node?.parentElement ?? null;
    while (current) {
        const overflowY = window.getComputedStyle(current).overflowY;
        if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return current;
        current = current.parentElement;
    }
    return null;
}

export function ChatThread({
    messages,
    status,
    streamingText,
    isLoading,
    error,
    onAsk,
    onStop,
    onCitation,
    onOpenView,
    prefill,
    onClarify,
}: ChatThreadProps) {
    const locale = (useLocale() || "en") as Locale;

    const [draft, setDraft] = useState(prefill ?? "");
    const [lastPrefill, setLastPrefill] = useState(prefill);
    const [atBottom, setAtBottom] = useState(true);
    const [dismissedError, setDismissedError] = useState<string | null>(null);
    const [speechErrorDismissed, setSpeechErrorDismissed] = useState<string | null>(null);
    const [completed, setCompleted] = useState<string[]>([]);
    // Bumped whenever the composer should take focus; the effect below reacts to it.
    const [focusToken, setFocusToken] = useState(0);

    const {
        isSupported,
        isListening,
        error: speechError,
        toggleListening,
        stopListening,
        clearError: clearSpeechError,
    } = useSpeechRecognition({
        locale,
        onTranscript: (updatedDraft) => {
            setDraft(updatedDraft);
        },
    });

    const rootRef = useRef<HTMLDivElement | null>(null);
    const scrollerRef = useRef<HTMLElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lastStatusRef = useRef<string | null>(null);
    const wasLoadingRef = useRef(false);
    const messageCountRef = useRef(0);
    const prevListeningRef = useRef(false);

    useEffect(() => {
        if (prevListeningRef.current && !isListening) {
            textareaRef.current?.focus();
        }
        prevListeningRef.current = isListening;
    }, [isListening]);

    const visibleError = error && error !== dismissedError ? error : null;
    const activeSpeechError = speechError && speechError !== speechErrorDismissed ? speechError : null;
    const displayedError = visibleError || activeSpeechError;
    const isEmpty = messages.length === 0 && !isLoading;

    /* ---------------------------------------------------------------- scrolling */

    const scrollToBottom = useCallback((smooth: boolean) => {
        const target: Element | null = scrollerRef.current ?? document.scrollingElement ?? document.documentElement;
        if (!target) return;
        target.scrollTo({top: target.scrollHeight, behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto"});
    }, []);

    useEffect(() => {
        const scroller = findScrollParent(rootRef.current);
        scrollerRef.current = scroller;
        const listener: EventTarget = scroller ?? window;

        const read = () => {
            const target: Element | null = scrollerRef.current ?? document.scrollingElement ?? document.documentElement;
            if (!target) return;
            const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
            setAtBottom(distance <= BOTTOM_THRESHOLD);
        };

        read();
        listener.addEventListener("scroll", read, {passive: true});
        window.addEventListener("resize", read);
        return () => {
            listener.removeEventListener("scroll", read);
            window.removeEventListener("resize", read);
        };
    }, []);

    useEffect(() => {
        const grew = messages.length > messageCountRef.current;
        messageCountRef.current = messages.length;
        if (!atBottom) return;
        scrollToBottom(grew);
    }, [messages.length, streamingText, status, isLoading, atBottom, scrollToBottom]);

    /* -------------------------------------------------------- retrieval progress */

    useEffect(() => {
        if (isLoading && !wasLoadingRef.current) {
            setCompleted([]);
            lastStatusRef.current = null;
        }
        wasLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        if (!status) return;
        const previous = lastStatusRef.current;
        if (previous === status) return;
        lastStatusRef.current = status;
        if (previous) setCompleted((steps) => (steps.includes(previous) ? steps : [...steps, previous]));
    }, [status]);

    /* ------------------------------------------------------------------ composer */

    const resize = useCallback(() => {
        const node = textareaRef.current;
        if (!node) return;
        node.style.height = "auto";
        node.style.height = `${Math.min(node.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
        node.style.overflowY = node.scrollHeight > MAX_COMPOSER_HEIGHT ? "auto" : "hidden";
    }, []);

    useEffect(() => {
        resize();
    }, [draft, resize]);

    // Adjusting state while rendering: cheaper and more predictable than a prefill effect.
    if (prefill !== undefined && prefill !== lastPrefill) {
        setLastPrefill(prefill);
        setDraft(prefill);
        setFocusToken((token) => token + 1);
    }

    useEffect(() => {
        if (focusToken === 0) return;
        const node = textareaRef.current;
        if (!node) return;
        node.focus();
        const end = node.value.length;
        node.setSelectionRange(end, end);
    }, [focusToken]);

    const submitQuestion = useCallback(
        (question: string) => {
            const trimmed = question.trim();
            if (!trimmed || isLoading) return;
            if (isListening) {
                stopListening();
            }
            onAsk(trimmed);
            setDraft("");
        },
        [isLoading, isListening, onAsk, stopListening],
    );

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        submitQuestion(draft);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== "Enter" || event.shiftKey) return;
        // Leave IME composition alone.
        if (event.nativeEvent.isComposing) return;
        event.preventDefault();
        submitQuestion(draft);
    }

    const handleClarify = useCallback(
        (response: string) => {
            if (response && response.trim().length > 0) {
                void submitQuestion(response);
            } else {
                setFocusToken((token) => token + 1);
                textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            onClarify?.(response);
        },
        [onClarify, submitQuestion],
    );

    /* -------------------------------------------------------------------- render */

    return (
        <div className="conversation-scroll" ref={rootRef}>
            <div className="conversation">
                <div className="conversation-heading">
                    <div>
                        <h1>Compliance assistant</h1>
                        <p>Ask a product or BIS service question. Important claims include inspectable sources.</p>
                    </div>
                    <span className="context-chip"><SealCheck size={15} weight="fill"/> Source-backed answers</span>
                </div>

                {isEmpty ? (
                    <section className="assistant-welcome" aria-label="Example questions">
                        <strong>Start with one of these</strong>
                        <p>Each answer names the Indian Standard, the certification route, and the clause it came from.</p>
                        <div className="example-questions">
                            {EXAMPLE_QUESTIONS.map((question) => (
                                <button type="button" key={question} onClick={() => onAsk(question)}>
                                    <span>{question}</span>
                                    <CaretDown className="example-arrow" size={14} weight="bold"/>
                                </button>
                            ))}
                        </div>
                    </section>
                ) : null}

                {messages.map((message, index) =>
                    message.role === "user" ? (
                        <div className="user-message" key={`u${index}`}>
                            <span className="message-author">You</span>
                            <p>{message.content}</p>
                        </div>
                    ) : (
                        <AnswerCard
                            key={`a${index}`}
                            answer={message.answer ?? null}
                            streamingText={message.answer ? "" : message.content}
                            streaming={false}
                            onCitation={onCitation}
                            onOpenView={onOpenView}
                            onClarify={handleClarify}
                        />
                    ),
                )}

                {isLoading && !streamingText ? <RetrievalState status={status} completed={completed}/> : null}

                {isLoading && streamingText ? (
                    <AnswerCard
                        answer={null}
                        streamingText={streamingText}
                        streaming
                        onCitation={onCitation}
                        onOpenView={onOpenView}
                        onClarify={handleClarify}
                    />
                ) : null}
            </div>

            <div className="sticky-composer-wrap">
                {!atBottom && messages.length > 0 ? (
                    <button type="button" className="jump-latest" onClick={() => scrollToBottom(true)}>
                        <CaretDown size={13} weight="bold"/> Jump to latest
                    </button>
                ) : null}

                {displayedError ? (
                    <div className="assistant-error" role="alert">
                        <WarningCircle size={18} weight="fill"/>
                        <p>{displayedError}</p>
                        <button
                            type="button"
                            className="icon-button"
                            aria-label="Dismiss error"
                            title="Dismiss error"
                            onClick={() => {
                                if (visibleError && error) setDismissedError(error);
                                if (activeSpeechError && speechError) {
                                    setSpeechErrorDismissed(speechError);
                                    clearSpeechError();
                                }
                            }}
                        >
                            <X size={15}/>
                        </button>
                    </div>
                ) : null}

                <form className="app-composer" onSubmit={handleSubmit}>
                    <label htmlFor="assistant-composer" className="sr-only">Ask a BIS compliance question</label>
                    <textarea
                        id="assistant-composer"
                        ref={textareaRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={messages.length ? "Ask a follow-up or describe another product..." : "Describe your product or ask a BIS question..."}
                        rows={2}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    />
                    <div className="composer-footer">
                        <div className="composer-tools">
                            <span className="language-badge">{locale.toUpperCase()}</span>
                            {isListening ? (
                                <span className="composer-listening-status" aria-live="polite">
                                    <span className="mic-listening-dot" aria-hidden="true"/>
                                    Listening…
                                </span>
                            ) : (
                                <span className="composer-hint">Enter to send · Shift + Enter for a new line</span>
                            )}
                        </div>
                        <div className="composer-actions">
                            <button
                                type="button"
                                className={`mic-button ${isListening ? "is-listening" : ""}`}
                                onClick={() => {
                                    setSpeechErrorDismissed(null);
                                    clearSpeechError();
                                    toggleListening(draft);
                                }}
                                disabled={isLoading || !isSupported}
                                aria-label={
                                    !isSupported
                                        ? "Voice input isn't supported in this browser"
                                        : isListening
                                          ? "Stop listening"
                                          : "Start voice input"
                                }
                                aria-pressed={isListening}
                                title={
                                    !isSupported
                                        ? "Voice input isn't supported in this browser."
                                        : isListening
                                          ? "Listening… Click to stop"
                                          : "Voice input (speak to type)"
                                }
                            >
                                <Microphone size={18} weight={isListening ? "fill" : "bold"} aria-hidden="true"/>
                                {isListening ? <span className="mic-label">Listening…</span> : null}
                            </button>
                            {isLoading ? (
                                <button
                                    type="button"
                                    className="send-button is-stop"
                                    onClick={onStop}
                                    aria-label="Stop generating"
                                    title="Stop generating"
                                >
                                    <X size={17} weight="bold"/>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="send-button"
                                    aria-label="Send question"
                                    disabled={!draft.trim() || isListening}
                                >
                                    <ArrowUp size={19} weight="bold"/>
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <p className="ai-note" aria-live="polite">
                    {isLoading && status ? status : "Verify final compliance decisions with the cited official documents."}
                </p>
            </div>
        </div>
    );
}

export default ChatThread;
