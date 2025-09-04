import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Results({ questions, answers, score, resetAll }) {
  const navigate = useNavigate();
  const total = questions.length;

  // High score tracking
  const best = useMemo(() => {
    return Number(localStorage.getItem("highScore") || 0);
  }, []);

  useEffect(() => {
    const prevBest = Number(localStorage.getItem("highScore") || 0);
    if (score > prevBest) {
      localStorage.setItem("highScore", String(score));
    }
  }, [score]);

  return (
    <main className="card">
      <h1 className="center">🎉 Quiz Completed!</h1>

      <p className="center lead">
        You scored <strong>{score}</strong> out of {total}
      </p>
      <p className="center">
        Best score on this device:{" "}
        <strong>{Math.max(score, best)}</strong> / {total}
      </p>

      <div className="answers">
        {questions.map((q, i) => {
          const sel = answers[i]?.selected;
          const correct = q.correctAnswer;
          const isCorrect = sel === correct;

          return (
            <div
              key={q.id || i}
              className={`answerRow ${isCorrect ? "ok" : "bad"}`}
            >
              <div className="q">
                <span className="qnum">{i + 1}.</span> {q.question}
              </div>
              <div className="a">
                {isCorrect ? (
                  <p>
                    ✅ Your answer: <strong>{sel}</strong>
                  </p>
                ) : (
                  <>
                    <p>
                      ❌ Your answer:{" "}
                      <strong>{sel ?? "— (skipped / timed out)"}</strong>
                    </p>
                    <p>
                      ✅ Correct answer: <strong>{correct}</strong>
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="actions center">
        <button className="btn" onClick={resetAll}>
          🔄 Restart Quiz
        </button>
      </div>
    </main>
  );
}
