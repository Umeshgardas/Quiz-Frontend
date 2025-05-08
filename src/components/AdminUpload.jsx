import React, { useState } from 'react';
import axios from 'axios';
import './AdminUpload.css';
const categoryData = {
    Math: ['Algebra', 'Geometry', 'Trigonometry'],
    Science: ['Physics', 'Chemistry', 'Biology'],
    English: ['Grammar', 'Literature', 'Vocabulary']
};

const AdminUpload = () => {
    const [data, setData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        category: '',
        subCategory: ''
    });

    const handleChange = (i, value) => {
        const options = [...data.options];
        options[i] = value;
        setData({ ...data, options });
    };

    const handleUpload = async () => {
        try {
            await axios.post('https://quiz-backend-mn2m.onrender.com/api/quiz/upload', data);
            alert('Question uploaded!');
        } catch (err) {
            alert('Upload failed');
        }
    };

    return (
        <div className="admin-upload-container">


            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h2>Admin Upload</h2>
                <input
                    placeholder="Question"
                    value={data.question}
                    onChange={e => setData({ ...data, question: e.target.value })}
                    style={{ display: 'block', margin: '10px 0', width: '100%' }}
                />
                {data.options.map((opt, i) => (
                    <input
                        key={i}
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={e => handleChange(i, e.target.value)}
                        style={{ display: 'block', margin: '10px 0', width: '100%' }}
                    />
                ))}
                <input
                    placeholder="Correct Answer"
                    value={data.correctAnswer}
                    onChange={e => setData({ ...data, correctAnswer: e.target.value })}
                    style={{ display: 'block', margin: '10px 0', width: '100%' }}
                />

                <select
                    value={data.category}
                    onChange={e => {
                        const selected = e.target.value;
                        setData({ ...data, category: selected, subCategory: '' });
                    }}
                    style={{ display: 'block', margin: '10px 0', width: '100%' }}
                >
                    <option value="">Select Category</option>
                    {Object.keys(categoryData).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={data.subCategory}
                    onChange={e => setData({ ...data, subCategory: e.target.value })}
                    style={{ display: 'block', margin: '10px 0', width: '100%' }}
                    disabled={!data.category}
                >
                    <option value="">Select Subcategory</option>
                    {data.category &&
                        categoryData[data.category].map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))
                    }
                </select>

                <button onClick={handleUpload} style={{ marginTop: '20px' }}>
                    Upload
                </button>
            </div>
        </div>
    );
};

export default AdminUpload;
