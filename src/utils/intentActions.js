// src/utils/intentActions.js
//
// Point 2: "for every word extracted we create an action for them."
// This is a separate, lightweight layer on top of the emotional matching —
// it looks for actionable phrases ("let's hang out", "I want to chat") and
// maps them straight to a concrete UI action instead of just matching
// feelings. To add a new action: add an entry here, then handle its
// `action` value in ChatOnboarding.jsx's handleSend.

export const INTENT_ACTIONS = {
    hangout: {
      keywords: ["hang out", "hangout", "meet up", "meetup", "grab coffee", "grab a coffee", "get together"],
      action: "location",
      label: "Wants to hang out",
    },
    chat: {
      keywords: ["chat", "talk to someone", "vent", "just talk", "need to talk", "wanna talk"],
      action: "chat",
      label: "Wants to talk",
    },
  };
  
  export function detectIntent(rawText) {
    const text = (rawText || "").toLowerCase();
    for (const [key, cfg] of Object.entries(INTENT_ACTIONS)) {
      if (cfg.keywords.some((kw) => text.includes(kw))) {
        return { intent: key, ...cfg };
      }
    }
    return null;
  }
  