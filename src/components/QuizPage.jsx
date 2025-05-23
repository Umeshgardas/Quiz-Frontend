import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizPage.css";
import LoginModal from "./LoginModal";
import QuizResult from "./Quiz/QuizResult";
import Question from "./Quiz/Question";
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
  const [markedForReviewIndexes, setMarkedForReviewIndexes] = useState([]);
  console.log(quizTaken, "quizHistory");
  useEffect(() => {
    console.log("UserEmail:", userEmail);
  }, [userEmail]);
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

      <Question
        quizStarted={quizStarted}
        quizEnded={quizEnded}
        questions={questions}
        selectedAnswers={selectedAnswers}
        currentQuestionIndex={currentQuestionIndex}
        markedForReviewIndexes={markedForReviewIndexes}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        timer={timer}
        handleAnswerSelect={handleAnswerSelect}
        handleMarkForReviewToggle={handleMarkForReviewToggle}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleSubmitQuiz={handleSubmitQuiz}
      />

      <QuizResult
        quizEnded={quizEnded}
        score={score}
        questions={questions}
        selectedAnswers={selectedAnswers}
      />
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default QuizPage;
