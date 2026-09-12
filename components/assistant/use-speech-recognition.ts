"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { type Locale, LOCALE_TO_STT_LANG } from "@/i18n/locales";

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
        confidence?: number;
      };
    };
  };
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

/**
 * Pure helper to append spoken speech intelligently to existing text.
 * Preserves existing text and guarantees clean single-space separation without duplicates.
 */
export function mergeDraft(baseText: string, speechText: string): string {
  const trimmedSpeech = speechText.trimStart();
  if (!trimmedSpeech) return baseText;
  if (!baseText) return trimmedSpeech;

  const separator = /[\s\n]$/.test(baseText) ? "" : " ";
  return `${baseText}${separator}${trimmedSpeech}`;
}

export function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionOptions {
  locale: Locale;
  onTranscript: (fullDraft: string) => void;
  onStateChange?: (isListening: boolean) => void;
}

export function useSpeechRecognition({
  locale,
  onTranscript,
  onStateChange,
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = useSyncExternalStore(
    () => () => {},
    () => Boolean(getSpeechRecognition()),
    () => false,
  );

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseDraftRef = useRef("");
  const manualStopRef = useRef(false);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    onStateChange?.(false);
  }, [onStateChange]);

  const startListening = useCallback(
    (currentDraft: string) => {
      setError(null);

      const SpeechRec = getSpeechRecognition();
      if (!SpeechRec) {
        setError("Voice input isn't supported in this browser.");
        return;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      baseDraftRef.current = currentDraft;
      manualStopRef.current = false;

      const lang = LOCALE_TO_STT_LANG[locale] || "en-IN";

      try {
        const recognition = new SpeechRec();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsListening(true);
          onStateChange?.(true);
        };

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let sessionTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item && item[0]) {
              sessionTranscript += item[0].transcript;
            }
          }
          const updated = mergeDraft(baseDraftRef.current, sessionTranscript);
          onTranscript(updated);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
          setIsListening(false);
          onStateChange?.(false);

          if (manualStopRef.current || event.error === "aborted") {
            return;
          }

          switch (event.error) {
            case "not-allowed":
            case "service-not-allowed":
              setError("Microphone access was denied.");
              break;
            case "no-speech":
              setError("I couldn't hear anything. Try again.");
              break;
            case "audio-capture":
              setError("Microphone access was denied.");
              break;
            case "language-not-supported":
              setError("Voice input isn't supported for this language in your browser.");
              break;
            case "network": {
              const isBrave =
                typeof navigator !== "undefined" &&
                Boolean((navigator as unknown as { brave?: unknown }).brave);
              if (isBrave) {
                setError(
                  "Brave blocks speech services by default. Enable 'Google services for speech recognition' in brave://settings/privacy or try Chrome/Safari."
                );
              } else {
                setError("Voice recognition service is unavailable. Check your connection.");
              }
              break;
            }
            default:
              setError("Could not recognize speech. Try again.");
              break;
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          onStateChange?.(false);
          recognitionRef.current = null;
        };

        recognition.start();
      } catch {
        setIsListening(false);
        onStateChange?.(false);
        setError("Voice input isn't supported for this language in your browser.");
      }
    },
    [locale, onStateChange, onTranscript],
  );

  const toggleListening = useCallback(
    (currentDraft: string) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(currentDraft);
      }
    },
    [isListening, startListening, stopListening],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Stop listening if locale changes during active recording
  useEffect(() => {
    if (recognitionRef.current) {
      manualStopRef.current = true;
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  }, [locale]);

  // Clean up recognition instance on component unmount
  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearError,
  };
}
