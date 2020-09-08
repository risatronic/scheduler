import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setHistory([newMode, ...history.slice(1)]);
    } else {
      setHistory([newMode, ...history]);
    }

    setMode(newMode);
  }

  function back() {
    if (history.length > 1) {
      setHistory([...history.slice(1)]);
      setMode(history[0]);
    }
  }

  return { mode, transition, back };
}