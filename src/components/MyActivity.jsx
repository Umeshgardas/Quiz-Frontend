import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyActivity.css";

const MyActivity = ({ userEmail }) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quiz history once email is available
  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/quiz/history/${userEmail}`
        );
        setActivity(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchQuizHistory();
  }, [userEmail]);

  console.log(activity, "activityactivity");

  return (
    <div className="activity-container">
      <h2>My Quiz Activity</h2>
      {loading ? (
        <p>Loading...</p>
      ) : activity.length === 0 ? (
        <p>No quiz activity found.</p>
      ) : (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>SubJect Category</th>
              <th>Topic Category</th>
              <th>Score</th>
              <th>Total</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.subCategory}</td>
                <td>{item.subjectCategory}</td>
                <td>{item.topicCategory}</td>
                <td>{item.score}</td>
                <td>{item.total}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>
                  {item.score / item.total >= 0.4 ? (
                    <p className="correct">Passed</p>
                  ) : (
                    <p className="wrong">Failed</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyActivity;
