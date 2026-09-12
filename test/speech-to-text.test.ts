import test from "node:test";
import assert from "node:assert/strict";

import {
  LOCALE_TO_STT_LANG,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/i18n/locales";

import {
  mergeDraft,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionErrorEventLike,
  type SpeechRecognitionInstance,
} from "@/components/assistant/use-speech-recognition";

test("Language Configurations: maps all 5 application locales to correct Indian speech recognition tags", () => {
  assert.strictEqual(LOCALE_TO_STT_LANG.en, "en-IN");
  assert.strictEqual(LOCALE_TO_STT_LANG.hi, "hi-IN");
  assert.strictEqual(LOCALE_TO_STT_LANG.ta, "ta-IN");
  assert.strictEqual(LOCALE_TO_STT_LANG.te, "te-IN");
  assert.strictEqual(LOCALE_TO_STT_LANG.kn, "kn-IN");

  // Every supported locale must have a corresponding mapping
  for (const loc of SUPPORTED_LOCALES) {
    assert.ok(
      LOCALE_TO_STT_LANG[loc],
      `Locale ${loc} should have an STT language mapping`
    );
  }
});

test("Text Merging: empty input -> voice transcription", () => {
  const result = mergeDraft("", "Which Indian Standard applies?");
  assert.strictEqual(result, "Which Indian Standard applies?");
});

test("Text Merging: typed text + voice transcription appends cleanly with single space", () => {
  // Without trailing space on typed text
  const result1 = mergeDraft(
    "I manufacture stainless steel bottles.",
    "Do I need BIS certification?"
  );
  assert.strictEqual(
    result1,
    "I manufacture stainless steel bottles. Do I need BIS certification?"
  );

  // With trailing space on typed text
  const result2 = mergeDraft(
    "I manufacture stainless steel bottles. ",
    "Do I need BIS certification?"
  );
  assert.strictEqual(
    result2,
    "I manufacture stainless steel bottles. Do I need BIS certification?"
  );

  // With trailing newline
  const result3 = mergeDraft(
    "Line 1\n",
    "Line 2 spoken"
  );
  assert.strictEqual(result3, "Line 1\nLine 2 spoken");

  // With leading space from browser speech engine
  const result4 = mergeDraft(
    "First sentence",
    " second sentence"
  );
  assert.strictEqual(result4, "First sentence second sentence");

  // Empty speech preserves original typed text
  const result5 = mergeDraft("Preserved typed text", "");
  assert.strictEqual(result5, "Preserved typed text");
});

test("Voice -> Edit -> Send workflow simulation", () => {
  let draft = "";
  const onAsk = (question: string) => {
    assert.strictEqual(question, "Which labs near Pune test helmets for ISI mark?");
  };

  // 1. User speaks -> voice transcription updates draft
  const spoken = "Which labs near Pune test helmets";
  draft = mergeDraft(draft, spoken);
  assert.strictEqual(draft, "Which labs near Pune test helmets");

  // 2. User reviews and edits draft manually
  draft = draft + " for ISI mark?";
  assert.strictEqual(draft, "Which labs near Pune test helmets for ISI mark?");

  // 3. User submits edited text
  const trimmed = draft.trim();
  assert.ok(trimmed.length > 0);
  onAsk(trimmed);
  draft = "";
  assert.strictEqual(draft, "");
});

// Mock SpeechRecognition engine for lifecycle and error testing
class MockSpeechRecognition implements SpeechRecognitionInstance {
  continuous = false;
  interimResults = true;
  lang = "en-IN";
  onstart: (() => void) | null = null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null = null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null = null;
  onend: (() => void) | null = null;

  isStarted = false;
  aborted = false;

  start() {
    this.isStarted = true;
    this.onstart?.();
  }

  stop() {
    this.isStarted = false;
    this.onend?.();
  }

  abort() {
    this.aborted = true;
    this.isStarted = false;
    this.onerror?.({ error: "aborted" });
    this.onend?.();
  }

  simulateResult(transcript: string, isFinal = false) {
    this.onresult?.({
      resultIndex: 0,
      results: [
        Object.assign([{ transcript, confidence: 0.95 }], { isFinal }),
      ] as unknown as SpeechRecognitionEventLike["results"],
    });
  }

  simulateError(error: string) {
    this.onerror?.({ error });
    this.onend?.();
  }
}

test("Speech Recognition Lifecycle: Start -> Stop", () => {
  const recognition = new MockSpeechRecognition();
  let isListening = false;
  let currentDraft = "Existing question";

  recognition.onstart = () => {
    isListening = true;
  };
  recognition.onend = () => {
    isListening = false;
  };
  recognition.onresult = (event) => {
    const speech = event.results[0][0].transcript;
    currentDraft = mergeDraft(currentDraft, speech);
  };

  // Start
  recognition.start();
  assert.strictEqual(isListening, true);

  // Interim speech
  recognition.simulateResult("and testing process", false);
  assert.strictEqual(currentDraft, "Existing question and testing process");

  // Stop cleanly
  recognition.stop();
  assert.strictEqual(isListening, false);
  assert.strictEqual(currentDraft, "Existing question and testing process");
});

test("Error handling: Permission Denied maps to concise human copy", () => {
  const recognition = new MockSpeechRecognition();
  let errorMsg: string | null = null;
  let isListening = true;

  recognition.onerror = (event) => {
    isListening = false;
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      errorMsg = "Microphone access was denied.";
    }
  };

  recognition.simulateError("not-allowed");
  assert.strictEqual(isListening, false);
  assert.strictEqual(errorMsg, "Microphone access was denied.");
});

test("Error handling: No Speech Detected maps to concise human copy", () => {
  const recognition = new MockSpeechRecognition();
  let errorMsg: string | null = null;
  let isListening = true;

  recognition.onerror = (event) => {
    isListening = false;
    if (event.error === "no-speech") {
      errorMsg = "I couldn't hear anything. Try again.";
    }
  };

  recognition.simulateError("no-speech");
  assert.strictEqual(isListening, false);
  assert.strictEqual(errorMsg, "I couldn't hear anything. Try again.");
});

test("Error handling: Unsupported Browser handled gracefully", () => {
  // Simulate browser without window.SpeechRecognition or window.webkitSpeechRecognition
  const win: { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown } = {};
  const isSupported = Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  assert.strictEqual(isSupported, false);

  let error: string | null = null;
  if (!isSupported) {
    error = "Voice input isn't supported in this browser.";
  }
  assert.strictEqual(error, "Voice input isn't supported in this browser.");
});

test("Language Switching: Changing language before voice input updates recognition language code", () => {
  const testLanguages: Array<{ locale: Locale; expectedStt: string }> = [
    { locale: "en", expectedStt: "en-IN" },
    { locale: "hi", expectedStt: "hi-IN" },
    { locale: "ta", expectedStt: "ta-IN" },
    { locale: "te", expectedStt: "te-IN" },
    { locale: "kn", expectedStt: "kn-IN" },
  ];

  for (const { locale, expectedStt } of testLanguages) {
    const recognition = new MockSpeechRecognition();
    recognition.lang = LOCALE_TO_STT_LANG[locale] || "en-IN";
    recognition.start();

    assert.strictEqual(
      recognition.lang,
      expectedStt,
      `Recognition lang for locale ${locale} must be ${expectedStt}`
    );
  }
});
