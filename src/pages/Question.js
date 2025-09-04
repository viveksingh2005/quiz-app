import React from "react";

function Question({ data, onAnswer }) {
  return (
    <div>
      <p className="text-lg font-medium mb-4">{data.question}</p>
      <div className="grid gap-2">
        {data.options.map((option, i) => (
          <button
            key={i}
            className="w-full p-2 border rounded-lg hover:bg-gray-100"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
