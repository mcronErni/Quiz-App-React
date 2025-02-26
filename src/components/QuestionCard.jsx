import { useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const QuizComponent = ({ quiz }) => {
  const [selectedChoices, setSelectedChoices] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const passingScore = quiz.totalScore * 0.8;
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const { id } = useParams();

  const handleChoiceClick = (questionId, choice) => {
    if (!isSubmitted) {
      setSelectedChoices((prev) => { 
        const isFirstTimeChoosing = !prev.hasOwnProperty(questionId);
        const previousChoice = prev[questionId] || null; // Default to null if no previous choice
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

    const [bootcamperId, setBootcamperId] = useState(0);
    //maybe i can use this to lock quizzes from other mentors?
    useEffect(() => {
      const bootcamperIdFromCookie = Cookies.get('bootcamperId');

      if (bootcamperIdFromCookie) {
  
        setBootcamperId(parseInt(bootcamperIdFromCookie))
        console.log(bootcamperIdFromCookie)
      }
    }, []);

    const handleSubmit = async () => {
      if (confirm(`Submit the Quiz? You have answered ${answeredQuestions}/${quiz.questions.length}`)) {
        try {
          const response = await axios.post('https://localhost:7034/api/BootcamperQuiz', {
            bootcamperId: bootcamperId,
            quizId: id,
            score: correct,
            withCredentials: true
          });
    
          console.log('Submission successful:', response.data);
          
          setIsSubmitted(true);
          setShowModal(true);
        } catch (error) {
          if (error.response?.status === 409) {
            alert('You have already submitted this quiz.');
          } else {
            alert('There was an issue submitting your quiz. Please try again.');
          }
          console.log(error.response?.status)
          console.error('Error submitting the exam:', error.response?.data || error.message);
        }
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
    <div className="p-4 border rounded-lg shadow-md bg-gray max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.quizTitle}</h1>
      <p className="text-gray-600 mb-4">Total Score: {quiz.totalScore}</p>
      {quiz.questions.map((question) => (
        <div key={question.questionId} className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">{question.mQuestion}</h2>
          <ul>
            {question.choices.map((choice, index) => (
              <li
                key={index}
                className={`p-2 border rounded-md mb-2 cursor-pointer transition-all ${
                  selectedChoices[question.questionId] === choice ? "bg-blue-300" : "bg-gray"
                } ${
                  isSubmitted && choice === question.answer ? "border-green-500 bg-green-500" : 
                  isSubmitted && selectedChoices[question.questionId] === choice ? "border-red-500 bg-red-500" : ""
                  
                }`}
                onClick={() => handleChoiceClick(question.questionId, choice)}
              >
                {choice}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className={`mt-4 p-2 bg-blue-500 text-white rounded-md w-full disabled:opacity-50 ${
          isSubmitted ? "" : "cursor-pointer"
        }`}
        disabled={isSubmitted}
      >
        Submit Quiz
      </button>
      {isSubmitted && (
        <>
          <div className="text-center">
            <p className="mt-2 text-lg font-semibold text-center">
              Quiz Submitted!
            </p>
            <Button label={"Result"} onClick={() => setShowModal(true)}/>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center text-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold">Quiz Results</h2>
            <p className="mt-2 text-lg">You scored <strong>{correct}/{quiz.totalScore}</strong></p>
            <div className="mt-2 text-lg">
              {correct >= passingScore ? (<p className="text-green-400">You Passed! 🎉🎉🎉</p>)
              : (<p className="text-red-400">Better Luck Next Time 😿</p>)}
            </div>
            <Button label={"Close"} onClick={() => setShowModal(false)}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;