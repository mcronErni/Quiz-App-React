import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

// Assuming Button is a custom component, we'll keep the import
import Button from "./Button";

const QuizComponent = ({ quiz }) => {
  const [selectedChoices, setSelectedChoices] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  
  const passingScore = quiz.totalScore * 0.8;
  const progressPercentage = (answeredQuestions / quiz.questions.length) * 100;

  const [bootcamperId, setBootcamperId] = useState(0);

  useEffect(() => {
    const bootcamperIdFromCookie = Cookies.get('bootcamperId');
    if (bootcamperIdFromCookie) {
      setBootcamperId(parseInt(bootcamperIdFromCookie));
    }
  }, []);

  const handleChoiceClick = (questionId, choice) => {
    if (!isSubmitted) {
      setSelectedChoices((prev) => { 
        const isFirstTimeChoosing = !prev.hasOwnProperty(questionId);
        const previousChoice = prev[questionId] || null;
        const correctAnswer = quiz.questions.find(q => q.questionId === questionId).answer;
  
        if (isFirstTimeChoosing) {
          setAnsweredQuestions((prev) => prev + 1);
        }
  
        setCorrect((prevCorrect) => {
          if (!previousChoice) {
            return choice === correctAnswer ? prevCorrect + 1 : prevCorrect;
          } else {
            const wasPreviousCorrect = previousChoice === correctAnswer;
            const isNewChoiceCorrect = choice === correctAnswer;
  
            if (wasPreviousCorrect && !isNewChoiceCorrect) {
              return prevCorrect - 1;
            } else if (!wasPreviousCorrect && isNewChoiceCorrect) {
              return prevCorrect + 1;
            }
          }
          return prevCorrect;
        });
  
        return { ...prev, [questionId]: choice };
      });
    }
  };

  const handleSubmit = async () => {
    // Using window.confirm for better browser compatibility
    if (window.confirm(`Submit the Quiz? You have answered ${answeredQuestions}/${quiz.questions.length}`)) {
      setSubmitting(true);
      setError("");
      
      try {
        const response = await axios.post('https://localhost:7034/api/BootcamperQuiz', {
          bootcamperId: bootcamperId,
          quizId: id,
          score: correct,
          withCredentials: true
        });
  
        setIsSubmitted(true);
        setShowModal(true);
      } catch (error) {
        if (error.response?.status === 409) {
          setError('You have already submitted this quiz.');
        } else {
          setError('There was an issue submitting your quiz. Please try again.');
        }
        console.error('Error submitting the exam:', error.response?.data || error.message);
      } finally {
        setSubmitting(false);
      }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto my-8"
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.quizTitle}</h1>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Total Score: {quiz.totalScore}</p>
            <p className="text-gray-600">
              Progress: {answeredQuestions}/{quiz.questions.length} questions
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300"
          >
            {error}
          </motion.div>
        )}

        {quiz.questions.map((question, qIndex) => (
          <motion.div 
            key={question.questionId} 
            className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: qIndex * 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {qIndex + 1}. {question.mQuestion}
            </h2>
            <ul className="space-y-3">
              {question.choices.map((choice, index) => {
                const isSelected = selectedChoices[question.questionId] === choice;
                const isCorrect = isSubmitted && choice === question.answer;
                const isIncorrect = isSubmitted && isSelected && !isCorrect;
                
                return (
                  <motion.li
                    key={index}
                    whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center
                      ${isSubmitted ? "cursor-default" : "hover:bg-blue-50"}
                      ${isSelected && !isSubmitted ? "bg-blue-100 border-blue-300 border" : "border border-gray-200"}
                      ${isCorrect ? "bg-green-100 border-green-500 text-green-800" : ""}
                      ${isIncorrect ? "bg-red-100 border-red-500 text-red-800" : ""}
                    `}
                    onClick={() => handleChoiceClick(question.questionId, choice)}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 mr-3 rounded-full text-sm
                      ${isSelected && !isSubmitted ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}
                      ${isCorrect ? "bg-green-500 text-white" : ""}
                      ${isIncorrect ? "bg-red-500 text-white" : ""}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{choice}</span>
                    {isCorrect && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                    {isIncorrect && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}

        <motion.button
          whileHover={!isSubmitted ? { scale: 1.02 } : {}}
          whileTap={!isSubmitted ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={isSubmitted || submitting}
          className={`mt-6 py-3 px-6 rounded-lg text-white font-medium w-full transition-all
            ${isSubmitted 
              ? "bg-gray-400 cursor-not-allowed" 
              : submitting 
                ? "bg-blue-400 cursor-wait" 
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }
          `}
        >
          {submitting ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : isSubmitted ? "Submitted" : "Submit Quiz"}
        </motion.button>
        
        {isSubmitted && !showModal && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex justify-center"
          >
            <Button label="View Results" onClick={() => setShowModal(true)} />
          </motion.div>
        )}
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
              className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-6">Quiz Results</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <motion.circle 
                      className={correct >= passingScore ? "text-green-500" : "text-red-500"} 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (correct / quiz.totalScore))}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (correct / quiz.totalScore)) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {correct}
                    </motion.span>
                    <span className="text-gray-500">out of {quiz.totalScore}</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className={`text-center text-xl font-medium mb-8 ${
                  correct >= passingScore ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {correct >= passingScore ? (
                  <>
                    <p className="mb-2">Congratulations! 🎉</p>
                    <p>You've passed the quiz!</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">Better luck next time 😿</p>
                    <p>Keep practicing!</p>
                  </>
                )}
              </motion.div>
              
              <div className="flex justify-center">
                <Button label="Close" onClick={() => setShowModal(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizComponent;