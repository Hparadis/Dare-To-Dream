# src/backend/matching/keywords.py
import re

STOPWORDS = {
    "a", "an", "and", "the", "is", "are", "was", "were", "be", "been", "being", "i",
    "im", "you", "your", "yours", "he", "she", "it", "they", "them", "we", "us", "our",
    "me", "my", "mine", "to", "of", "in", "on", "at", "for", "with", "about", "as",
    "by", "that", "this", "these", "those", "so", "but", "or", "if", "because", "when",
    "then", "than", "too", "very", "just", "really", "have", "has", "had", "do", "does",
    "did", "not", "no", "yes", "can", "could", "should", "would", "will", "shall", "may",
    "might", "must", "am", "its", "feel", "feeling", "feels", "felt", "think", "thought",
    "get", "got", "getting", "like", "also", "now", "some", "any", "all", "up", "down",
    "out", "over", "under", "again", "more", "most", "much",
}

_WORD_RE = re.compile(r"[a-z0-9']+")


def extract_keywords(raw_text: str) -> list:
    """Mirrors src/utils/matchAlgorithm.js extractKeywords(). This is the
    version that actually decides matches — always computed server-side
    from the raw text, never trusting a client-supplied keyword list."""
    text = (raw_text or "").lower()
    words = _WORD_RE.findall(text)

    seen = set()
    keywords = []
    for word in words:
        if len(word) < 3 or word in STOPWORDS or word in seen:
            continue
        seen.add(word)
        keywords.append(word)
    return keywords
