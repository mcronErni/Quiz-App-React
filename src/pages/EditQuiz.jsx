// QuizForm.js
import React, { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import CreateQuizCard from '../components/CreateQuizCard';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuiz = ({quiz}) => {
  const [showModal, setShowModal] = useState(false);
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    totalScore: 0,
    mentorId : 0, //CHANGE THIS AFTER AUTHENTICATION
    questions: [],
  });


  const navigate = useNavigate();
  const { id } = useParams();
  const [mentorId, setMentorId] = useState(0);
  //maybe i can use this to lock quizzes from other mentors?
  useEffect(() => {
    // Get mentorId from cookies
    const mentorIdFromCookie = Cookies.get('mentorId');

    if (mentorIdFromCookie) {

      setMentorId(parseInt(mentorIdFromCookie))
    }
  }, []);

    const [jwtToken, setJwt] = useState(null);
    useEffect(() => {
      const jwt = Cookies.get('jwt')
      setJwt(jwt);
    }, []);

  useEffect(() => {

    if(!mentorId || !jwtToken) return;

    const fetchData = async () =>{
    //   setLoading(true);
      try {
        // const {data: response} = await axios.get('https://opentdb.com/api_category.php');
        const {data: response} = await axios.get(`https://localhost:7034/api/quiz/${id}`,{
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        console.log(response)

        //check if mentor is the one who created thge quiz
        if(parseInt(mentorId) != response.mentorId){
            console.log("Current Mentor ID:",mentorId,"response: ",response.mentorId)
            alert("You are not Authorized to edit this quiz.")
            navigate(-1);
            return
        }
        setQuizData(response);

      } catch (error) {
        console.error(error.message);
      }
    //   setLoading(false);
    }

    fetchData();
  }, [mentorId, jwtToken]);

  //ADD QUESTION USING ADD BUTTON 
  const handleAddQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { mQuestion: '', answer: '', choices: [''], score: 0 }]
    }));
  };
  
  const [removedQuestions, setRemovedQuestions] = useState([]);
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
      const { data: response } = await axios.put(`https://localhost:7034/api/quiz/${id}`, quizData);
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
      <h2 className="text-3xl font-semibold text-center mb-6">Edit Quiz</h2>
      <InputField label="Quiz Title" type="text" value={quizData.quizTitle} onChange={handleQuizTitleChange} />
      {/* <InputField
        label="Number of Questions"
        type="number"
        value={questionCount}
        onChange={handleQuestionCountChange}
      /> */}
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
                  </div>
                  <Button label={"Close"} onClick={() => setShowModal(false)}/>
                </div>
            )}

    </div>
  );
};

export default EditQuiz;
