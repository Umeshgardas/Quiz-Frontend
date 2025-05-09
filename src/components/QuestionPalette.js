import React from "react";
import "./QuestionPalette.css"; // Make sure the CSS is included

const QuestionPalette = ({
  questions,
  currentQuestionIndex,
  selectedOptions,
  markedForReview,
  handleQuestionClick,
}) => {
  const getStatus = (index) => {
    const selected = selectedOptions[index];
    const marked = markedForReview.includes(index);

    if (index === currentQuestionIndex) return "selected";
    if (marked) return "review";
    if (selected) return "answered";
    return "not-attempted";
  };

  const renderStatusBox = (status) => {
    return <div className={`status-box ${status}`} />;
  };

  return (
    <div className="question-palette">
      <h3>Question Palette</h3>
      <div className="questions-container">
        {questions.map((_, index) => {
          const status = getStatus(index);
          return (
            <button
              key={index}
              className={`question-button ${status}`}
              onClick={() => handleQuestionClick(index)}
            >
              {renderStatusBox(status)}
              <span>{index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;
