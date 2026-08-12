# src/backend/safety/crisis_detection.py
"""
A first, deliberately simple pass at catching crisis language before it
ever reaches the matching algorithm. Not a replacement for real crisis
intervention — a first line that makes sure someone in danger gets
stopped and shown help immediately, instead of getting routed into
"finding a match" like everyone else.
"""
import re
from datetime import datetime
from src.config.firebase import db

# Deliberately broad for v1 — a false positive here just shows someone a
# resource they didn't need. A false negative means someone in real
# danger gets matched into small talk instead. Broad is the safer error.
CRISIS_PATTERNS = [
    r"\bkill myself\b",
    r"\bkilling myself\b",
    r"\bkill me\b",
    r"\bwant to die\b",
    r"\bwanna die\b",
    r"\bend my life\b",
    r"\bending my life\b",
    r"\bsuicid\w*\b",
    r"\bself.?harm\w*\b",
    r"\bhurt myself\b",
    r"\bhurting myself\b",
    r"\bcut myself\b",
    r"\bcutting myself\b",
    r"\bno reason to live\b",
    r"\bbetter off dead\b",
    r"\bcan'?t go on\b",
    r"\bdon'?t want to be here anymore\b",
    r"\bnot going to wake up\b",
]

# TODO: verify and add local/regional crisis lines (e.g. Rwanda-specific)
# before this goes in front of real users.
CRISIS_RESOURCES = {
    "message": "It sounds like you might be going through something really heavy right now. You deserve real support — not just a conversation.",
    "hotlines": [
        {"name": "988 Suicide & Crisis Lifeline (US)", "contact": "Call or text 988"},
        {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
        {"name": "Find a helpline worldwide", "contact": "findahelpline.com"},
    ],
}

_COMPILED = [re.compile(p, re.IGNORECASE) for p in CRISIS_PATTERNS]


def detect_crisis_language(text: str) -> bool:
    if not text:
        return False
    return any(pattern.search(text) for pattern in _COMPILED)


def log_crisis_flag(user_id: str, text: str) -> None:
    """
    A minimal record for now, written with the Admin SDK so no client
    Firestore rule is needed. Enough for a human to review later — there's
    no automatic staff notification yet. That's a real next feature to
    build, not something to claim exists before it does.
    """
    db.collection("CrisisFlags").add({
        "userId": user_id,
        "text": text,
        "timestamp": datetime.utcnow().isoformat(),
    })