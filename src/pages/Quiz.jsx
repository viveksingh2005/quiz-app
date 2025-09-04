import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../shared/QuestionCard";

const SECS_PER_QUESTION = 30;

export default function Quiz({ questions, answers, setAnswers }) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [seconds, setSeconds] = useState(SECS_PER_QUESTION);
  const timerRef = useRef(null); // hold active timer

  const total = questions.length;
  const current = questions[idx];

  // Progress bar
  const progress = useMemo(
    () => Math.round(((idx + 1) / total) * 100),
    [idx, total]
  );

  // Reset timer when question changes
  useEffect(() => {
    // clear any old timer
    if (timerRef.current) clearInterval(timerRef.current);

    // reset countdown
    setSeconds(SECS_PER_QUESTION);

    // start new timer
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);

          // lock current question
          setAnswers((prev) => {
            const copy = [...prev];
            const entry = copy[idx] ?? { selected: null, timedOut: false };
            if (!entry.timedOut) {
              copy[idx] = { ...entry, timedOut: true };
            }
            return copy;
          });

          return 0; // stop at 0
        }
        return s - 1;
      });
      return;
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, setAnswers]);

  // Get safe values
  const selected = answers[idx]?.selected ?? null;
  const timedOut = answers[idx]?.timedOut ?? false;

  // Handle option select
  const setSelection = (option) => {
    setAnswers((prev) => {
      const copy = [...prev];
      const entry = copy[idx] ?? { selected: null, timedOut: false };
      if (entry.timedOut) return prev; // don’t allow if locked
      copy[idx] = { ...entry, selected: option, timedOut: false };
      return copy;
    });
  };

  // Button conditions
  const canGoNext = selected !== null || timedOut;
  const isLast = idx === total - 1;

  const next = () => {
    if (!canGoNext) return;
    if (isLast) navigate("/results");
    else setIdx((i) => i + 1);
  };

  const prev = () => setIdx((i) => Math.max(0, i - 1));

  const skip = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      const entry = copy[idx] ?? { selected: null, timedOut: false };
      copy[idx] = { ...entry, timedOut: true };
      return copy;
    });
    if (isLast) navigate("/results");
    else setIdx((i) => i + 1);
  };

  return (
    <main className="card">
      <div className="topbar">
        <div className="progress">
          <div className="progress__bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="meta">
          <span>
            Question {idx + 1} / {total}
          </span>
          <span aria-live="polite" className={seconds <= 5 ? "danger" : ""}>
            ⏱ {seconds}s
          </span>
        </div>
      </div>

      <QuestionCard
        key={current.id}
        question={current.question}
        options={current.options}
        selected={selected}
        onSelect={setSelection}
        disabled={timedOut}
      />

      {timedOut && (
        <p className="hint" role="status">
          Time’s up — your answer is locked.
        </p>
      )}

      <div className="actions">
        <button className="btn secondary" onClick={prev} disabled={idx === 0}>
          Previous
        </button>

        <div className="spacer" />

        <button className="btn ghost" onClick={skip}>
          Skip
        </button>

        <button
          className="btn"
          onClick={next}
          disabled={!canGoNext}
          aria-disabled={!canGoNext}
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </main>
  );
}
