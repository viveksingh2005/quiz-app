import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
// Pages
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";

// Utility: decode HTML entities from OpenTDB
const decode = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

// Normalize OpenTDB question to our UI model
const normalizeQuestions = (items) =>
  items.map((q, idx) => {
    const incorrect = q.incorrect_answers.map(decode);
    const correct = decode(q.correct_answer);
    const options = [...incorrect, correct].sort(() => Math.random() - 0.5);
    return {
      id: `${idx}-${Date.now()}`,
      question: decode(q.question),
      options,
      correctAnswer: correct,
    };
  });

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [answers, setAnswers] = useState([]); // {selected: string|null, timedOut: boolean}[]
  const navigate = useNavigate();

  // Load questions from API with local JSON fallback
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      setErrorMsg("");
      try {
        // Try API first
        const res = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986"
        );
        const data = await res.json();
        if (!data || data.response_code !== 0 || !Array.isArray(data.results)) {
          throw new Error("API returned empty/invalid data");
        }
        if (!cancelled) {
          const normalized = normalizeQuestions(data.results);
          setQuestions(normalized);
          setAnswers(
            normalized.map(() => ({ selected: null, timedOut: false }))
          );
          setStatus("ready");
          navigate("/quiz");
        }
      } catch (e) {
        // Fallback to local JSON
        try {
          const local = await fetch("/questions.json");
          const items = await local.json();
          if (!Array.isArray(items) || items.length === 0) {
            throw new Error("Local questions.json missing/invalid");
          }
          if (!cancelled) {
            setQuestions(items);
            setAnswers(items.map(() => ({ selected: null, timedOut: false })));
            setStatus("ready");
            navigate("/quiz");
          }
        } catch (e2) {
          if (!cancelled) {
            setStatus("error");
            setErrorMsg(
              "Failed to load questions from API and local file. Please check your connection or questions.json."
            );
          }
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
    // Send back to first question inside /quiz page logic via query or default
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
