// QuizForm.js
import React, { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import CreateQuizCard from '../components/CreateQuizCard';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateQuiz = () => {
  const [showModal, setShowModal] = useState(false);
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    totalScore: 0,
    mentorId : 0, //CHANGE THIS AFTER AUTHENTICATION
    questions: [],
  });

  useEffect(() => {
    // Get mentorId from cookies
    const mentorIdFromCookie = Cookies.get('mentorId');

    // If mentorId is found in cookies, update quizData state
    if (mentorIdFromCookie) {
      setQuizData(prevState => ({
        ...prevState,
        mentorId: mentorIdFromCookie, // Set the mentorId from the cookie
      }));
    }
  }, []);

  const [questionCount, setQuestionCount] = useState(0);

  const handleQuizTitleChange = (e) => {
    setQuizData({ ...quizData, quizTitle: e.target.value });
  };

  const handleQuestionCountChange = (e) => {
    const count = parseInt(e.target.value);
    
    // Preserve the existing scores and question data
    const existingQuestions = [...quizData.questions];
  
    // If the number of questions is less, slice the existing array
    const newQuestions = existingQuestions.slice(0, count);
  
    // If the number of questions is more, add empty questions with scores
    while (newQuestions.length < count) {
      newQuestions.push({
        mQuestion: '',
        answer: '',
        choices: [''],
        score: 0,  // Default score for new questions
      });
    }
  
    setQuizData({
      ...quizData,
      questions: newQuestions,
      totalScore: count
    });
  
    setQuestionCount(count);
  }

  const handleAnswerChange = (index, answer) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].answer = answer;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // const handleScoreChange = (index, score) => {
  //   const updatedQuestions = [...quizData.questions];
  //   updatedQuestions[index].score = parseInt(score);
  //   const totalScore = updatedQuestions.reduce((acc, q) => acc + q.score, 0);
  //   setQuizData({ ...quizData, questions: updatedQuestions, totalScore });
  // };

  const handleChoiceChange = (index, value, choiceIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].choices[choiceIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, question) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].mQuestion = question;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    const isDefaultQuizData =
      quizData.quizTitle === '' ||
      quizData.totalScore === 0 ||
      quizData.questions.length === 0 ||
      quizData.questions.some(
        (question) =>
          question.mQuestion === '' &&
          question.answer === '' &&
          question.choices.length === 1 &&
          question.choices[0] === ''
      );
  
    if (isDefaultQuizData) {
      alert('Please fill out all fields and add questions before submitting.');
      return;
    }
  
    try {
      const { data: response } = await axios.post('https://localhost:7034/api/quiz', quizData);
      console.log(response);
      setShowModal(true)
    } catch (error) {
      console.error('Error posting data:', error.message);
    }
  };

  useEffect(() => {
    if(showModal){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  },[showModal])

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Create Quiz</h2>
      <InputField label="Quiz Title" type="text" value={quizData.quizTitle} onChange={handleQuizTitleChange} />
      <InputField
        label="Number of Questions"
        type="number"
        value={questionCount}
        onChange={handleQuestionCountChange}
      />
      <div className="mt-4">
        <label className="block text-lg font-semibold">Total Score: {quizData.questions.length}</label>
      </div>
      {quizData.questions.map((question, index) => (
        <CreateQuizCard
          key={index}
          question={question}
          index={index}
          onChangeAnswer={handleAnswerChange}
          // onChangeScore={handleScoreChange}
          onChangeChoice={handleChoiceChange}
          onChangeQuestion={handleQuestionChange}
        />
      ))}
      <Button label="Submit Quiz" onClick={handleSubmit} />

      {showModal && (
              <div className="fixed inset-0 flex items-center justify-center text-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold">Quiz Created</h2>
                  </div>
                  <Button label={"Close"} onClick={() => setShowModal(false)}/>
                </div>
            )}

    </div>
  );
};

export default CreateQuiz;
