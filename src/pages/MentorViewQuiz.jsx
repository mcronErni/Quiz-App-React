import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function MentorViewQuiz() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://localhost:7034/api/BootcamperQuiz/${id}`);
        setQuizzes(data);
        console.log(data)
      } catch (err) {
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (quizzes.length === 0) return <p className="text-center text-gray-500">No quizzes found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-4">Mentor's Quizzes</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Quiz Title</th>
              <th className="p-2 border">Bootcamper Name</th>
              <th className="p-2 border">Score / Total Score</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{quiz.quizTitle}</td>
                <td className="p-2 border">{quiz.bootcamperName}</td>
                <td className="p-2 border">{quiz.score} / {quiz.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
