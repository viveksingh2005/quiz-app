import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
// Pages
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [answers, setAnswers] = useState([]); // {selected: string|null, timedOut: boolean}[]
  const navigate = useNavigate();

  // Load questions from local JSON only
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      setErrorMsg("");
      try {
        // Always load local JSON
        const res = await fetch(`${process.env.PUBLIC_URL}/questions.json`);
        const items = await res.json();

        if (!Array.isArray(items) || items.length === 0) {
          throw new Error("Local questions.json missing/invalid");
        }

        if (!cancelled) {
          setQuestions(items);
          setAnswers(items.map(() => ({ selected: null, timedOut: false })));
          setStatus("ready");
          navigate("/quiz");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(
            "Failed to load local questions.json. Please check your file."
          );
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const score = useMemo(() => {
    if (!questions.length) return 0;
    let s = 0;
    answers.forEach((a, i) => {
      if (a?.selected && a.selected === questions[i]?.correctAnswer) s++;
    });
    return s;
  }, [answers, questions]);

  const resetAll = () => {
    setAnswers(questions.map(() => ({ selected: null, timedOut: false })));
    navigate("/quiz");
  };

  if (status === "loading") {
    return (
      <div className="wrap">
        <header className="brand">Quiz App</header>
        <div className="card center">
          <p>Loading questions…</p>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="wrap">
        <header className="brand">Quiz App</header>
        <div className="card error">
          <h2>Couldn’t load questions</h2>
          <p>{errorMsg}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="brand">Quiz App</header>

      <Routes>
        <Route
          path="/quiz"
          element={
            <Quiz
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              questions={questions}
              answers={answers}
              score={score}
              resetAll={resetAll}
            />
          }
        />
        <Route path="/" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </div>
  );
}
