// frontend/components/QuestionList.js
import React from 'react';

const QuestionList = ({ questions, answers, flagged }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q, index) => {
        let bgColor = 'bg-gray-200';
        if (answers[index]) bgColor = 'bg-green-300'; // Attempted
        if (flagged.includes(index)) bgColor = 'bg-yellow-300'; // Marked for Review
        return (
          <button
            key={index}
            className={`w-10 h-10 ${bgColor} rounded`}
            onClick={() => {/* Jump to question logic */}}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionList;
