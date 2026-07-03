const PROBLEM_KEYWORDS = {
    depression: [
      "sad", "lonely", "alone", "isolated", "empty", "hopeless", "down",
      "depressed", "depression", "worthless", "crying", "numb",
      "no motivation", "no energy", "no point", "tired of everything",
    ],
    addiction: [
      "addicted", "addiction", "drinking", "alcohol", "drugs", "gambling",
      "can't stop", "relapse", "sober", "using again", "smoking", "porn",
      "binge", "withdrawal",
    ],
  };
  
  const CAUSE_KEYWORDS = {
    family: ["family", "parents", "mom", "dad", "mother", "father", "siblings", "brother", "sister"],
    relationship: ["relationship", "partner", "boyfriend", "girlfriend", "husband", "wife", "breakup", "broke up", "divorce", "my ex"],
    society: ["friends", "social", "lonely", "isolated", "no friends", "judged", "bullied", "work", "job", "school"],
    "self-inflicted": ["myself", "my fault", "i did this", "own doing", "my own choices"],
  };
  
  function scoreKeywords(text, dict) {
    const lower = text.toLowerCase();
    const scores = Object.entries(dict).map(([key, words]) => [
      key,
      words.reduce((count, w) => count + (lower.includes(w) ? 1 : 0), 0),
    ]);
    scores.sort((a, b) => b[1] - a[1]);
    const [bestKey, bestScore] = scores[0];
    return { key: bestScore > 0 ? bestKey : null, score: bestScore };
  }
  
  export function extractIntent(text) {
    const problem = scoreKeywords(text, PROBLEM_KEYWORDS);
    const cause = scoreKeywords(text, CAUSE_KEYWORDS);
    return {
      problem: problem.key,
      problemConfident: problem.score > 0,
      cause: cause.key,
      causeConfident: cause.score > 0,
    };
  }