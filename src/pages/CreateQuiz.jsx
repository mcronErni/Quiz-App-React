// QuizForm.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputField from '../components/InputField';
import Button from '../components/Button';
import CreateQuizCard from '../components/CreateQuizCard';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateQuiz = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    totalScore: 0,
    mentorId: 0,
    questions: [],
  });

  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [activeSection, setActiveSection] = useState('title');

  useEffect(() => {
    const mentorIdFromCookie = Cookies.get('mentorId');

    if (mentorIdFromCookie) {
      setQuizData(prevState => ({
        ...prevState,
        mentorId: parseInt(mentorIdFromCookie),
      }));
    }
  }, []);

  const handleAddQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { mQuestion: '', answer: '', choices: [''], score: 0 }]
    }));
    
    // Auto scroll to new question
    setTimeout(() => {
      const newQuestionElement = document.getElementById(`question-${quizData.questions.length}`);
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...quizData.questions];
    const removedQuestion = updatedQuestions.splice(index, 1)[0];
  
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  
    setRemovedQuestions([...removedQuestions, removedQuestion]);
  };
  
  const handleUndoRemove = () => {
    if (removedQuestions.length === 0) return;
  
    const lastRemoved = removedQuestions.pop();
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, lastRemoved],
    });
  
    setRemovedQuestions([...removedQuestions]);
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

  const validateQuiz = () => {
    if (!quizData.quizTitle.trim()) {
      setError('Please provide a quiz title');
      return false;
    }
    
    if (quizData.questions.length === 0) {
      setError('Please add at least one question');
      return false;
    }
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      
      if (!question.mQuestion.trim()) {
        setError(`Question ${i + 1} is missing a prompt`);
        return false;
      }
      
      if (!question.answer.trim()) {
        setError(`Question ${i + 1} is missing a correct answer`);
        return false;
      }
      
      if (question.choices.some(choice => !choice.trim())) {
        setError(`Question ${i + 1} has empty choices`);
        return false;
      }
      
      if (!question.choices.includes(question.answer)) {
        setError(`Question ${i + 1}'s correct answer must be one of the choices`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    
    // Update total score based on question count
    const updatedQuizData = {
      ...quizData,
      totalScore: quizData.questions.length
    };
    
    if (!validateQuiz()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: response } = await axios.post('https://localhost:7034/api/quiz', updatedQuizData);
      console.log(response);
      setShowModal(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating quiz. Please try again.');
      console.error('Error posting data:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(showModal){
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto my-8 p-0"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h2 className="text-3xl font-bold text-center">Create New Quiz</h2>
          <p className="text-center text-blue-100 mt-2">Design interactive quizzes for your bootcampers</p>
        </div>
        
        <div className="p-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
            >
              {error}
            </motion.div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Quiz Details</h3>
            </div>
            <div className="ml-11">
              <InputField 
                label="Quiz Title" 
                type="text" 
                value={quizData.quizTitle} 
                onChange={handleQuizTitleChange} 
                placeholder="Enter an engaging title for your quiz"
              />
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Questions</h3>
              <div className="ml-auto flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button label="Add Question" onClick={handleAddQuestion} />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: removedQuestions.length > 0 ? 1.05 : 1 }} 
                  whileTap={{ scale: removedQuestions.length > 0 ? 0.95 : 1 }}
                >
                  <Button 
                    label="Undo Remove" 
                    onClick={handleUndoRemove} 
                    disabled={removedQuestions.length === 0}
                  />
                </motion.div>
              </div>
            </div>
            
            <div className="ml-11">
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-800">
                  Total Score: <span className="font-bold">{quizData.questions.length}</span> point{quizData.questions.length !== 1 ? 's' : ''}
                  {quizData.questions.length === 0 && " (Add questions to increase the score)"}
                </span>
              </div>
              
              <AnimatePresence>
                {quizData.questions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 mb-4">No questions yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Your First Question
                    </motion.button>
                  </motion.div>
                ) : (
                  quizData.questions.map((question, index) => (
                    <motion.div
                      key={index}
                      id={`question-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      layout
                      transition={{ duration: 0.3 }}
                    >
                      <CreateQuizCard
                        question={question}
                        index={index}
                        onChangeAnswer={handleAnswerChange}
                        handleRemoveQuestion={handleRemoveQuestion}
                        onChangeChoice={handleChoiceChange}
                        onChangeQuestion={handleQuestionChange}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                label={isSubmitting ? "Creating Quiz..." : "Create Quiz"} 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz Created Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your quiz "{quizData.quizTitle}" with {quizData.questions.length} question{quizData.questions.length !== 1 ? 's' : ''} is now ready for your bootcampers.
                </p>
                <motion.div 
                  className="flex justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button label="Close" onClick={() => setShowModal(false)} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateQuiz;