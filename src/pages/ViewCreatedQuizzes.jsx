import {React, useState, useEffect} from 'react'
import Button from '../components/Button';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import AvailableQuizzesCard from '../components/AvailableQuizzesCard';
import Cookies from 'js-cookie';

export default function ViewCreatedQuizzes() {
  // return (
  //   <>
  //       <div>ViewCreatedQuizzes</div>
  //       <ul>
  //           <li>List the quizzes created by the mentor</li>
  //           <li>quizzes card has different buttons</li>
  //           <li>One button for edit navTo edit quiz</li>
  //           <li>One button: select quiz. list those who finished the quiz</li>
  //           <li>one for delete: soft delete?</li>
  //       </ul>
  //   </>
  // )
    const [mentorId, setMentorId] = useState(null);
    useEffect(() => {
      // Get mentorId from cookies
      const mentorIdFromCookie = Cookies.get('mentorId');
      console.log('MENTORID', mentorIdFromCookie)
      // If mentorId is found in cookies, update quizData state
      if (mentorIdFromCookie) {
        setMentorId(mentorIdFromCookie)
      }
    }, []);

  const [quizzes, setQuizzes] = useState([])
  useEffect(() => {
      const fetchData = async () =>{
      //   setLoading(true);
        try {
          // const {data: response} = await axios.get('https://opentdb.com/api_category.php');
          const {data: response} = await axios.get(`https://localhost:7034/api/Mentor/${mentorId}`);
          setQuizzes(response.quizzes);
        } catch (error) {
          console.error(error.message);
        }
      //   setLoading(false);
      }
  
      fetchData();
    }, [mentorId]);

    const handleDelete = async (quizId) => {
      console.log(quizId)
      if(confirm("Are you sure you want to delete this Quiz?")){
        try {
          const response = await fetch(`https://localhost:7034/api/Quiz/${quizId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            throw new Error("Delete failed");
          }
        } catch (err) {
          setError(err.message);
        }
      }else{
        return
      }
    }
  
  return (
    <>
      <div className="p-6 items-center text-center">
        <Button label="Back" navigateTo="/user" />
        
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {quizzes.map((quiz) => (
              <AvailableQuizzesCard key={quiz.quizId} quiz={quiz} role={"mentor"} onClick={() => handleDelete(quiz.quizId)}/>
          ))}
        </div>
      </div>
    </>
  )
}
