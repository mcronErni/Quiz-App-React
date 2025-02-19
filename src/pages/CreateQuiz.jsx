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

  const [mentorId, setMentorId] = useState(null);

  useEffect(() => {
    // Get mentorId from cookies
    const mentorIdFromCookie = Cookies.get('mentorId');

    // If mentorId is found in cookies, update quizData state
    if (mentorIdFromCookie) {
      setQuizData(prevState => ({
        ...prevState,
        mentorId: mentorIdFromCookie, // Set the mentorId from the cookie
      }));
      setMentorId(mentorIdFromCookie);
    }
  }, []);

    const handleAddQuestion = () => {
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, { mQuestion: '', answer: '', choices: [''], score: 0 }]
      }));
    };
    
    const [removedQuestions, setRemovedQuestions] = useState([]);
    const handleRemoveQuestion = (index) => {
      const updatedQuestions = [...quizData.questions];
      const removedQuestion = updatedQuestions.splice(index, 1)[0]; // Remove question
    
      setQuizData({
        ...quizData,
        questions: updatedQuestions,
      });
    
      setRemovedQuestions([...removedQuestions, removedQuestion]); // Store removed question
    };
    
    const handleUndoRemove = () => {
      if (removedQuestions.length === 0) return;
    
      const lastRemoved = removedQuestions.pop(); // Get last removed question
      setQuizData({
        ...quizData,
        questions: [...quizData.questions, lastRemoved],
      });
    
      setRemovedQuestions([...removedQuestions]); // Update state
    };

  const handleQuizTitleChange = (e) => {
    setQuizData({ ...quizData, quizTitle: e.target.value });
  };


  const handleAnswerChange = (index, answer) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].answer = answer;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

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

    quizData.mentorId = mentorId;

    quizData.totalScore = quizData.questions.length
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
      <div className="mt-4">
      <label className="block text-lg font-semibold">Total Score: {quizData.questions.length}</label>
        <Button label={"Add Question"} onClick={handleAddQuestion}/>
        <Button label={"Undo Remove"} onClick={handleUndoRemove}/>
      </div>
      {quizData.questions.map((question, index) => (
        <CreateQuizCard
          key={index}
          question={question}
          index={index}
          onChangeAnswer={handleAnswerChange}
          handleRemoveQuestion={handleRemoveQuestion}
          onChangeChoice={handleChoiceChange}
          onChangeQuestion={handleQuestionChange}
        />
      ))}
      <Button label="Submit Quiz" onClick={handleSubmit} />

      {showModal && (
              <div className="fixed inset-0 flex items-center justify-center text-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold">Quiz Created</h2>
                  <Button label={"Close"} onClick={() => setShowModal(false)}/>
                  </div>
                </div>
            )}

    </div>
  );
};

export default CreateQuiz;
