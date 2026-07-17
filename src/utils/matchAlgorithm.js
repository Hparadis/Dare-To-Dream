// src/utils/matchAlgorithm.js
//
// Stage 1 of the algorithm, straight from the doc:
// "we create a group of words (lonely, bullied, eat...) then we match the
// user who share the most words." No AI, no categories — literal keyword
// overlap, kept deliberately simple to test whether the idea works.
//
// The actual match decision happens server-side (src/backend/matching) so
// it can compare against everyone else. This file is used for a live
// "words we're picking up" preview in the chat UI as the person types.

const STOPWORDS = new Set([
    "a", "an", "and", "the", "is", "are", "was", "were", "be", "been", "being", "i",
    "im", "you", "your", "yours", "he", "she", "it", "they", "them", "we", "us", "our",
    "me", "my", "mine", "to", "of", "in", "on", "at", "for", "with", "about", "as",
    "by", "that", "this", "these", "those", "so", "but", "or", "if", "because", "when",
    "then", "than", "too", "very", "just", "really", "have", "has", "had", "do", "does",
    "did", "not", "no", "yes", "can", "could", "should", "would", "will", "shall", "may",
    "might", "must", "am", "its", "feel", "feeling", "feels", "felt", "think", "thought",
    "get", "got", "getting", "like", "also", "now", "some", "any", "all", "up", "down",
    "out", "over", "under", "again", "more", "most", "much",
  ]);
  
  /**
   * Turns free text into a deduped list of significant lowercase words.
   *
   * "I feel so lonely, it started when I was bullied as a kid" ->
   *   ["lonely", "started", "bullied", "kid"]
   */
  export function extractKeywords(rawText) {
    const words = (rawText || "")
      .toLowerCase()
      .replace(/[^a-z0-9'\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  
    const seen = new Set();
    const keywords = [];
    for (const word of words) {
      if (word.length < 3) continue;
      if (STOPWORDS.has(word)) continue;
      if (seen.has(word)) continue;
      seen.add(word);
      keywords.push(word);
    }
    return keywords;
  }
  