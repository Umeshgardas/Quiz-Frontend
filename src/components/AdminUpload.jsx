import React, { useState } from "react";
import axios from "axios";
import "./AdminUpload.css";

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

const AdminUpload = () => {
  const [data, setData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    category: "",
    subCategory: "",
    subjectCategory: "",
    topicCategory: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (i, value) => {
    const options = [...data.options];
    options[i] = value;
    setData({ ...data, options });
  };

  const isValidForm = () => {
    const {
      question,
      options,
      correctAnswer,
      explanation,
      category,
      subCategory,
      subjectCategory,
      topicCategory,
    } = data;
    return (
      question &&
      options.every((opt) => opt.trim() !== "") &&
      correctAnswer &&
      explanation &&
      category &&
      subCategory &&
      subjectCategory &&
      topicCategory
    );
  };

  const handleUpload = async () => {
    if (!isValidForm()) {
      alert("Please fill in all fields before uploading.");
      return;
    }

    try {
      setIsUploading(true);

      const payload = {
        ...data,
        category: data.category.trim(),
        subCategory: data.subCategory.trim(),
        subjectCategory: data.subjectCategory.trim(),
        topicCategory: data.topicCategory.trim(),
      };

      await axios.post(
        "https://quiz-backend-mn2m.onrender.com/api/quiz/upload",
        payload
      );

      alert("Question uploaded!");

      setData({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        category: "",
        subCategory: "",
        subjectCategory: "",
        topicCategory: "",
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-upload-container">
      <h2>Admin Upload</h2>

      <input
        placeholder="Enter Question"
        value={data.question}
        onChange={(e) => setData({ ...data, question: e.target.value })}
      />

      {data.options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => handleChange(i, e.target.value)}
        />
      ))}

      <input
        placeholder="Correct Answer"
        value={data.correctAnswer}
        onChange={(e) => setData({ ...data, correctAnswer: e.target.value })}
      />

      <input
        placeholder="Explanation"
        value={data.explanation}
        onChange={(e) => setData({ ...data, explanation: e.target.value })}
      />

      {/* Dropdowns */}
      <select
        value={data.category}
        onChange={(e) =>
          setData({
            ...data,
            category: e.target.value,
            subCategory: "",
            subjectCategory: "",
            topicCategory: "",
          })
        }
      >
        <option value="">Select Category</option>
        {Object.keys(subCategoriesMap).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={data.subCategory}
        onChange={(e) =>
          setData({
            ...data,
            subCategory: e.target.value,
            subjectCategory: "",
            topicCategory: "",
          })
        }
        disabled={!data.category}
      >
        <option value="">Select Subcategory</option>
        {subCategoriesMap[data.category]?.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <select
        value={data.subjectCategory}
        onChange={(e) =>
          setData({
            ...data,
            subjectCategory: e.target.value,
            topicCategory: "",
          })
        }
        disabled={!data.subCategory}
      >
        <option value="">Select Subject Category</option>
        {subjectCategoriesMap[data.subCategory]?.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <select
        value={data.topicCategory}
        onChange={(e) =>
          setData({
            ...data,
            topicCategory: e.target.value,
          })
        }
        disabled={!data.subjectCategory}
      >
        <option value="">Select Topic Category</option>
        {topicCategoriesMap[data.subjectCategory]?.map((top) => (
          <option key={top} value={top}>
            {top}
          </option>
        ))}
      </select>

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Question"}
      </button>
    </div>
  );
};

export default AdminUpload;
