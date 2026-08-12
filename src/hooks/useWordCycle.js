// src/hooks/useWordCycle.js
//
// Types a word, holds, deletes, moves to the next — for `loops` full
// passes through the list, then calls onDone. Shared by the hero title
// (TypewriterWelcome) and the generic interstitial (LoadingScreen) so the
// typing rhythm feels identical everywhere it shows up.
import { useEffect, useState } from "react";

export function useWordCycle({
  words,
  typeSpeed = 70,
  deleteSpeed = 35,
  holdMs = 650,
  loops = 1,
  onDone,
  onLoopComplete,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing -> holding -> deleting

  const currentWord = words[wordIndex] ?? "";
  const isLastWord = wordIndex === words.length - 1;
  const isLastLoop = loopCount === loops - 1;

  useEffect(() => {
    if (phase === "typing") {
      if (displayed.length < currentWord.length) {
        const t = setTimeout(
          () => setDisplayed(currentWord.slice(0, displayed.length + 1)),
          typeSpeed
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), holdMs);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      if (isLastWord && isLastLoop) {
        const t = setTimeout(() => onDone?.(), holdMs);
        return () => clearTimeout(t);
      }
      setPhase("deleting");
      return;
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          deleteSpeed
        );
        return () => clearTimeout(t);
      }
      if (isLastWord) {
        setWordIndex(0);
        setLoopCount((c) => c + 1);
        onLoopComplete?.();
      } else {
        setWordIndex((i) => i + 1);
      }
      setPhase("typing");
    }
  }, [phase, displayed, currentWord, isLastWord, isLastLoop, typeSpeed, deleteSpeed, holdMs, onDone, onLoopComplete]);

  return { displayed, wordIndex, phase };
}
