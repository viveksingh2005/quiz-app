import React, { useRef, useEffect } from "react";

export default function QuestionCard({
  question,
  options,
  selected,
  onSelect,
  disabled = false,
}) {
  const firstOptionRef = useRef(null);

  // Accessibility: focus first option when question changes
  useEffect(() => {
    firstOptionRef.current?.focus();
  }, [question]);

  return (
    <section className="qcard">
      <h2 className="question" aria-live="polite">
        {question}
      </h2>

      <div className="options" role="radiogroup" aria-label="Answer options">
        {options.map((opt, i) => {
          const id = `opt-${i}`;
          const isChecked = selected === opt;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`option ${isChecked ? "selected" : ""} ${
                disabled ? "disabled" : ""
              }`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(opt);
                }
              }}
            >
              <input
                ref={i === 0 ? firstOptionRef : undefined}
                id={id}
                type="radio"
                name="answer"
                checked={isChecked}
                onChange={() => onSelect(opt)}
                disabled={disabled}
              />
              <span className="text">{opt}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
