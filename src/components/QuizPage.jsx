import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizPage.css";
// import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import LoginModal from "./LoginModal";
const subCategoriesMap = {
  Commerce: ["NISM", "Others"],
};

const subjectCategoriesMap = {
  NISM: ["MF", "PMS"],
  Others: ["MBA_CET", "Insurance"],
};

const topicCategoriesMap = {
  MF: [
    "Mock 1",
    "Mock 2",
    "Mock 3",
    "Mock 4",
    "Mock 5",
    "Mock 6",
    "Mock 7",
    "Mock 8",
    "Mock 9",
    "Mock 10",
  ],
  PMS: [
    "Mock 1",
    "Mock 2",
    "Mock 3",
    "Mock 4",
    "Mock 5",
    "Mock 6",
    "Mock 7",
    "Mock 8",
    "Mock 9",
    "Mock 10",
  ],
  MBA_CET: [
    "Mock 1",
    "Mock 2",
    "Mock 3",
    "Mock 4",
    "Mock 5",
    "Mock 6",
    "Mock 7",
    "Mock 8",
    "Mock 9",
    "Mock 10",
  ],
  Insurance: [
    "Mock 1",
    "Mock 2",
    "Mock 3",
    "Mock 4",
    "Mock 5",
    "Mock 6",
    "Mock 7",
    "Mock 8",
    "Mock 9",
    "Mock 10",
  ],
};

const QuizPage = ({ userEmail }) => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("");
  const [topicCategory, setTopicCategory] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [quizTaken, setQuizTaken] = useState(false);
  // const username = userEmail ? userEmail.split("@")[0] : "Guest";
  const { theme } = useTheme();
  const [markedForReviewIndexes, setMarkedForReviewIndexes] = useState([]);
  console.log(quizTaken, "quizHistory");

  const checkQuizStatus = async () => {
    try {
      const res = await axios.get(
        `https://quiz-backend-mn2m.onrender.com/api/quiz/status/${userEmail}/${category}/${subCategory}`
      );
      setQuizTaken(res.data.quizTaken);
      console.log(res.data.quizTaken, "quiess");
    } catch (err) {
      console.error("Error checking quiz status:", err);
    }
  };

  const fetchQuestions = async () => {
    if (!userEmail) {
      setShowLoginModal(true);
      return;
    }

    if (!category || !subCategory) {
      alert("Please select both category and subcategory.");
      return;
    }

    // if (quizTaken) {
    //   alert("You have already taken this quiz!");
    //   return;
    // }
    let baseURL = "https://quiz-backend-mn2m.onrender.com/api/quiz";
    let url = "";

    if (category && subCategory && subjectCategory && topicCategory) {
      url = `${baseURL}/${category}/${subCategory}/${subjectCategory}/${topicCategory}`;
    } else if (category && subCategory && subjectCategory) {
      url = `${baseURL}/${category}/${subCategory}/${subjectCategory}`;
    } else if (category && subCategory) {
      url = `${baseURL}/${category}/${subCategory}`;
      console.log(url);
    } else {
      alert("Insufficient category information.");
      return;
    }
    try {
      const res = await axios.get(url);
      setQuestions(res.data);
      setTimer(res.data.length * 80);
      setQuizStarted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load quiz questions");
    }
  };

  useEffect(() => {
    if (category && subCategory) {
      checkQuizStatus();
    }
  }, [category, subCategory]);

  useEffect(() => {
    let interval;
    if (quizStarted && !quizEnded) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (userEmail && category && subCategory) {
              handleSubmitQuiz();
            } else {
              console.warn("Skipping auto-submission due to missing fields");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizEnded]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleMarkForReviewToggle = (index) => {
    setMarkedForReviewIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index); // Unmark
      } else {
        return [...prev, index]; // Mark
      }
    });
  };

  const handleSubmitQuiz = async () => {
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setQuizEnded(true);

    if (!userEmail || !category || !subCategory) {
      console.error(
        "Submission failed: Missing userEmail, category, or subCategory"
      );
      return;
    }

    try {
      const payload = {
        user: userEmail,
        category: category.trim(),
        subCategory: subCategory.trim(),
        subjectCategory: subjectCategory.trim(),
        topicCategory: topicCategory.trim(),
        score: calculatedScore,
        total: questions.length,
        answers: selectedAnswers,
      };

      await axios.post("https://quiz-backend-mn2m.onrender.com/api/quiz/submit", payload);
      setQuizTaken(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert(err.response?.data?.message || "Error submitting quiz");
    }
  };

  return (
    <>
      {!quizStarted && (
        <div className="quiz-setup">
          <h2>Take a Quiz</h2>
          <div className="selector-group">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
                setSubjectCategory("");
                setTopicCategory("");
              }}
            >
              <option value="">Select Category</option>
              {Object.keys(subCategoriesMap).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {category && (
              <select
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setSubjectCategory("");
                  setTopicCategory("");
                }}
              >
                <option value="">Select Subcategory</option>
                {subCategoriesMap[category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            {subCategory && subjectCategoriesMap[subCategory] && (
              <select
                value={subjectCategory}
                onChange={(e) => {
                  setSubjectCategory(e.target.value);
                  setTopicCategory("");
                }}
              >
                <option value="">Select Subject Category (optional)</option>
                {subjectCategoriesMap[subCategory]?.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            )}

            {subjectCategory && topicCategoriesMap[subjectCategory] && (
              <select
                value={topicCategory}
                onChange={(e) => setTopicCategory(e.target.value)}
              >
                <option value="">Select Topic Category (optional)</option>
                {topicCategoriesMap[subjectCategory]?.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            )}

            <button className="show-quiz-btn" onClick={fetchQuestions}>
              Start Quiz
            </button>
          </div>
        </div>
      )}

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

      {quizEnded && (
        <div className={`result-list ${theme}`}>
          <h2>
            Your Score: {score} / {questions.length}
          </h2>
          {score / questions.length >= 0.4 ? (
            <p>🎉 Congratulations! You passed the quiz!</p>
          ) : (
            <p>😢 Better luck next time!</p>
          )}
          <h3>Quiz Results</h3>
          {questions.map((q, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            const isNotAttempted = userAnswer === undefined;
            // console.log(userAnswer, isCorrect,"checkingans");

            return (
              <div className={`question-item ${theme}`} key={idx}>
                <p className={`${theme}`}>
                  <strong>Q{idx + 1}:</strong> {q.question}
                </p>
                <p>
                  <strong>Correct Answer: </strong>
                  <span className="correct">{q.correctAnswer}</span>{" "}
                </p>
                {isNotAttempted ? (
                  <p className="not-attempted">Your Answer: Not Attempted</p>
                ) : isCorrect ? (
                  <p>
                    <strong>Your Answer:</strong>
                    <span className="correct"> {userAnswer}</span>
                  </p>
                ) : (
                  <p>
                    <strong>Your Answer: </strong>
                    <span className="wrong">{userAnswer}</span>{" "}
                  </p>
                )}
                <p>
                  <strong>Explanation: </strong>
                  <span>{q.explanation}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default QuizPage;
