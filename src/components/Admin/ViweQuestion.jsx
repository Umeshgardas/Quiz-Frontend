import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import EditModal from "../EditModel"; // import modal
import "./AdminUpload.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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
const ViweQuestion = () => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalType, setModalType] = useState(""); // 'view' or 'edit'

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("https://quiz-backend-mn2m.onrender.com/api/quiz/all");
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`https://quiz-backend-mn2m.onrender.com/api/quiz/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleView = (question) => {
    setSelectedQuestion(question);
    setModalType("view");
  };

  const handleEdit = (question) => {
    setSelectedQuestion({ ...question });
    setModalType("edit");
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setModalType("");
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "options") {
      const newOptions = [...selectedQuestion.options];
      newOptions[index] = value;
      setSelectedQuestion({ ...selectedQuestion, options: newOptions });
    } else {
      setSelectedQuestion({ ...selectedQuestion, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://quiz-backend-mn2m.onrender.com/api/quiz/${selectedQuestion._id}`,
        selectedQuestion
      );
      const updated = questions.map((q) =>
        q._id === selectedQuestion._id ? res.data : q
      );
      setQuestions(updated);
      handleCloseModal();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className={`admin-question-list ${theme} `}>
      <h3>Uploaded Questions</h3>
      <div className="table-container">
        <table className={`${theme}`}>
          <thead>
            <tr>
              <th>Question</th>
              <th>Options</th>
              <th>Answer</th>
              <th>Category</th>
              <th>Sub</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id}>
                <td>{q.question}</td>
                <td>
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </td>
                <td>{q.correctAnswer}</td>
                <td>{q.category}</td>
                <td>{q.subCategory}</td>
                <td>{q.subjectCategory}</td>
                <td>{q.topicCategory}</td>
                <td className={`table-btns ${theme}`}>
                  <button
                    title="View"
                    onClick={() => handleView(q)}
                    className="icon-btn"
                  >
                    <FaEye />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => handleEdit(q)}
                    className="icon-btn"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => deleteQuestion(q._id)}
                    className="icon-btn delete-icon"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditModal isOpen={!!selectedQuestion} onClose={handleCloseModal}>
        {modalType === "view" && selectedQuestion && (
          <>
            <h3>View Question</h3>
            <p>
              <strong>Question:</strong> {selectedQuestion.question}
            </p>
            <p>
              <strong>Options:</strong>
            </p>
            <ul>
              {selectedQuestion.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
            <p>
              <strong>Answer:</strong> {selectedQuestion.correctAnswer}
            </p>
            <p>
              <strong>Category:</strong> {selectedQuestion.category}
            </p>
            <p>
              <strong>Sub Category:</strong> {selectedQuestion.subCategory}
            </p>
            <p>
              <strong>Subject:</strong> {selectedQuestion.subjectCategory}
            </p>
            <p>
              <strong>Topic:</strong> {selectedQuestion.topicCategory}
            </p>
          </>
        )}

        {modalType === "edit" && selectedQuestion && (
          <>
            <h3>Edit Question</h3>
            <input
              type="text"
              name="question"
              value={selectedQuestion.question}
              onChange={handleInputChange}
              placeholder="Question"
            />
            <p>
              <strong>Options:</strong>
            </p>
            {selectedQuestion.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                name="options"
                value={opt}
                onChange={(e) => handleInputChange(e, index)}
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <input
              type="text"
              name="correctAnswer"
              value={selectedQuestion.correctAnswer}
              onChange={handleInputChange}
              placeholder="Correct Answer"
            />

            <select
              name="category"
              value={selectedQuestion.category || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {Object.keys(subCategoriesMap).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sub Category Dropdown */}
            <select
              name="subCategory"
              value={selectedQuestion.subCategory || ""}
              onChange={handleInputChange}
              disabled={!selectedQuestion.category}
            >
              <option value="">Select Sub Category</option>
              {(subCategoriesMap[selectedQuestion.category] || []).map(
                (sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                )
              )}
            </select>

            {/* Subject Category Dropdown */}
            <select
              name="subjectCategory"
              value={selectedQuestion.subjectCategory || ""}
              onChange={handleInputChange}
              disabled={!selectedQuestion.subCategory}
            >
              <option value="">Select Subject</option>
              {(subjectCategoriesMap[selectedQuestion.subCategory] || []).map(
                (subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                )
              )}
            </select>

            {/* Topic Category Dropdown */}
            <select
              name="topicCategory"
              value={selectedQuestion.topicCategory || ""}
              onChange={handleInputChange}
              disabled={!selectedQuestion.subjectCategory}
            >
              <option value="">Select Topic</option>
              {(topicCategoriesMap[selectedQuestion.subjectCategory] || []).map(
                (topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                )
              )}
            </select>
            <button onClick={handleSave}>Save Changes</button>
          </>
        )}
      </EditModal>
    </div>
  );
};

export default ViweQuestion;
