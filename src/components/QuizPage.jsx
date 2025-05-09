import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizPage.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const subCategoriesMap = {
  Arts: ["History", "Sociology"],
  Commerce: ["NISM", "HISM"],
  Science: ["Physics", "Biology"],
  English: ["Grammar", "Literature"],
};

const subjectCategoriesMap = {
  NISM: ["MF", "PMS"],
  HISM: ["Banking", "Insurance"],
  History: ["Ancient", "Modern"],
  Sociology: ["Family", "Society"],
  Physics: ["Mechanics", "Optics"],
  Biology: ["Genetics", "Ecology"],
  Grammar: ["Tenses", "Prepositions"],
  Literature: ["Poetry", "Prose"],
};

const topicCategoriesMap = {
  MF: ["Mutual Funds Overview", "NAV Calculation"],
  PMS: ["Portfolio Types", "Strategy"],
  Banking: ["Retail", "Corporate"],
  Insurance: ["Life", "Health"],
  Poetry: ["Sonnets", "Haiku"],
  Prose: ["Essays", "Stories"],
  // Add more if needed
};

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("");
  const [topicCategory, setTopicCategory] = useState("");

  const [subCategory, setSubCategory] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [quizTaken, setQuizTaken] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : "Guest";
  const { theme } = useTheme();
  const [markedForReviewIndexes, setMarkedForReviewIndexes] = useState([]);

  const checkQuizStatus = async () => {
    try {
      const res = await axios.get(
        `https://quiz-backend-mn2m.onrender.com/api/quiz/status/${userEmail}/${category}/${subCategory}`
      );
      setQuizTaken(res.data.quizTaken);
    } catch (err) {
      console.error("Error checking quiz status:", err);
    }
  };

  const fetchQuestions = async () => {
    if (!userEmail) {
      alert("User not logged in.");
      return;
    }

    if (!category || !subCategory) {
      alert("Please select both category and subcategory.");
      return;
    }

    if (quizTaken) {
      alert("You have already taken this quiz!");
      return;
    }
    let baseURL = "https://quiz-backend-mn2m.onrender.com/api/quiz";
    let url = "";

    if (category && subCategory && subjectCategory && topicCategory) {
      url = `${baseURL}/${category}/${subCategory}/${subjectCategory}/${topicCategory}`;
    } else if (category && subCategory && subjectCategory) {
      url = `${baseURL}/${category}/${subCategory}/${subjectCategory}`;
    } else if (category && subCategory) {
      url = `${baseURL}/${category}/${subCategory}`;
    } else {
      alert("Insufficient category information.");
      return;
    }
    try {
      const res = await axios.get(url);
      setQuestions(res.data);
      setTimer(res.data.length * 600);
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

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
        score: calculatedScore,
        total: questions.length,
        answers: selectedAnswers,
      };

      await axios.post(
        "https://quiz-backend-mn2m.onrender.com/api/quiz/submit",
        payload
      );
      setQuizTaken(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert(err.response?.data?.message || "Error submitting quiz");
    }
  };

  return (
    <>
      <Navbar onLogout={handleLogout} username={username} />
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
            <p className="quiz-inner-container-qnumber">
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
        <div className="quiz-container">
          <h2>Quiz Completed</h2>
          <p>
            Your Score: {score} / {questions.length}
          </p>
        </div>
      )}
    </>
  );
};

export default QuizPage;
