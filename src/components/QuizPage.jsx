import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizPage.css';
import Navbar from './Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const subCategoriesMap = {
    Math: ['Algebra', 'Geometry', 'Trigonometry'],
    Science: ['Physics', 'Chemistry', 'Biology'],
    English: ['Grammar', 'Literature', 'Vocabulary'],
};

const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [score, setScore] = useState(0);
    const [quizTaken, setQuizTaken] = useState(false); // State to track if quiz is taken
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail'); // Fetch email from localStorage
    const username = userEmail ? userEmail.split('@')[0] : 'Guest';
    const { theme } = useTheme();
    console.log(theme, "theme");

    // Function to check if the quiz is already taken
    const checkQuizStatus = async () => {
        try {
            const res = await axios.get(`https://quiz-backend-mn2m.onrender.com/api/quiz/status/${userEmail}/${category}/${subCategory}`);
            setQuizTaken(res.data.quizTaken); // Set the quizTaken status based on the response
        } catch (err) {
            console.error('Error checking quiz status:', err);
        }
    };

    // Fetch quiz questions if quiz is not already taken
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
            alert('You have already taken this quiz!');
            return;
        }

        try {
            const res = await axios.get(`https://quiz-backend-mn2m.onrender.com/api/quiz/${category}/${subCategory}`);
            setQuestions(res.data);
            setTimer(res.data.length * 600); // Timer is set based on the number of questions
            setQuizStarted(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load quiz questions');
        }
    };

    useEffect(() => {
        if (category && subCategory) {
            checkQuizStatus(); // Check if the quiz is taken for the selected category and subcategory
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
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail'); // Clear email from localStorage on logout
        navigate('/login');
    };

    // Handle answer selection
    const handleAnswerSelect = (option) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
    };

    // Handle quiz navigation (Next, Previous)
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    // Submit quiz and calculate score
    const handleSubmitQuiz = async () => {
        let calculatedScore = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) calculatedScore += 1;
        });
        setScore(calculatedScore);
        setQuizEnded(true);

        // Add validation before making the request
        if (!userEmail || !category || !subCategory) {
            console.error('Submission failed: Missing userEmail, category, or subCategory');
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

            console.log("Submitting quiz with payload:", payload); // Debug log

            await axios.post('https://quiz-backend-mn2m.onrender.com/api/quiz/submit', payload);
            setQuizTaken(true);
        } catch (err) {
            console.error('Error submitting quiz:', err);
            alert(err.response?.data?.message || 'Error submitting quiz');
        }
    };

    return (
        <>

            <Navbar onLogout={handleLogout} username={username} />
            {!quizStarted && (
                <div className="quiz-setup">
                    <h2>Take a Quiz</h2>
                    <div className="selector-group">
                        <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }}>
                            <option value="">Select Category</option>
                            {Object.keys(subCategoriesMap).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {category && (
                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                                <option value="">Select Subcategory</option>
                                {subCategoriesMap[category].map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
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
                <div className={`quiz-container ${theme}`}>
                    <div className={`quiz-inner-container ${theme}`}>
                        <div className={`timer ${theme}`}>
                            Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                        </div>
                        <div className={`quiz-question  ${theme}`}>
                            <h4 className={`${theme}`}>
                                Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}
                            </h4>
                            <ul>
                                {questions[currentQuestionIndex].options.map((opt, i) => (
                                    <>
                                        {opt &&
                                            <li key={i}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestionIndex}`}
                                                        value={opt}
                                                        checked={selectedAnswers[currentQuestionIndex] === opt}
                                                        onChange={() => handleAnswerSelect(opt)}
                                                    /> &nbsp;&nbsp;
                                                    {opt}
                                                </label>
                                            </li>
                                        }
                                    </>
                                ))}
                            </ul>
                        </div>
                        <div className="navigation-buttons">
                            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className={`${theme}`}>
                                Previous
                            </button>
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button onClick={handleNext} className={`${theme}`}>Next</button>
                            ) : (
                                <button onClick={handleSubmitQuiz} className={`${theme}`}>Submit Quiz</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {quizEnded && (
                <div className={`quiz-container`}>
                    <h2>Quiz Completed</h2>
                    <p>Your Score: {score} / {questions.length}</p>
                </div>
            )}

        </>
    );
};

export default QuizPage;
