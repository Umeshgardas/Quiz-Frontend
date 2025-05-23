import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Question = ({
  quizStarted,
  quizEnded,
  questions,
  selectedAnswers,
  currentQuestionIndex,
  timer,
  setCurrentQuestionIndex,
  markedForReviewIndexes,
  handleAnswerSelect,
  handleMarkForReviewToggle,
  handlePrevious,
  handleNext,
  handleSubmitQuiz
}) => {
  const { theme } = useTheme();

  return (
    <div>
      {quizStarted && !quizEnded && questions.length > 0 && (
        <div className={`quiz-container ${theme}`} style={{ display: "flex" }}>
          <div className={`question-navigator ${theme}`}>
            <h4>Questions</h4>
            <div className="grid-container">
              <label className="custom-checkbox">
                <input type="checkbox" disabled />
                <span className="checkmark selected"></span>Selected
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" disabled />
                <span className="checkmark answered"></span>Answered
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" disabled />
                <span className="checkmark markreview"></span>Mark for review
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" disabled />
                <span className="checkmark notattempted"></span>Not attempted
              </label>
            </div>
            <div className="question-numbers">
              {questions.map((_, index) => {
                const isAttempted = Object.prototype.hasOwnProperty.call(
                  selectedAnswers,
                  index
                );
                const isSelected = currentQuestionIndex === index;
                const isMarkedForReview =
                  markedForReviewIndexes.includes(index);

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`question-numbers-button ${theme}
                              ${isMarkedForReview ? "mark-review" : ""}
                              ${isSelected ? "selected" : ""}
                              ${
                                !isAttempted && !isMarkedForReview
                                  ? "not-attempted"
                                  : ""
                              }
                              ${
                                isAttempted && !isMarkedForReview
                                  ? "attempted"
                                  : ""
                              }
                              `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`quiz-inner-container ${theme}`}
            style={{ width: "80%" }}
          >
            <p className={`quiz-inner-container-qnumber ${theme}`}>
              {currentQuestionIndex + 1} &nbsp;/&nbsp;{questions.length}
            </p>
            <div className={`timer ${theme}`}>
              Time Remaining: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </div>
            <div className={`quiz-question ${theme}`}>
              <h4 className={`${theme}`}>
                {questions[currentQuestionIndex].question}
              </h4>
              <ul>
                {questions[currentQuestionIndex].options.map((opt, i) =>
                  opt ? (
                    <li key={i}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={opt}
                          checked={
                            selectedAnswers[currentQuestionIndex] === opt
                          }
                          onChange={() => handleAnswerSelect(opt)}
                        />{" "}
                        &nbsp;{opt}
                      </label>
                    </li>
                  ) : null
                )}
              </ul>
              <label>
                <input
                  type="checkbox"
                  checked={markedForReviewIndexes.includes(
                    currentQuestionIndex
                  )}
                  onChange={() =>
                    handleMarkForReviewToggle(currentQuestionIndex)
                  }
                />
                Mark for Review
              </label>

              <div className="question-status">
                {Object.prototype.hasOwnProperty.call(
                  selectedAnswers,
                  currentQuestionIndex
                ) ? (
                  <span className="attempted-label">Attempted</span>
                ) : (
                  <span className="unattempted-label">Not Attempted</span>
                )}
              </div>
            </div>
            <div className="navigation-buttons">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`${theme}`}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button onClick={handleNext} className={`${theme}`}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmitQuiz} className={`${theme}`}>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
