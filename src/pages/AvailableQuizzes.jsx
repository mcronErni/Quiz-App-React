import {React, useState, useEffect} from 'react'
import axios from 'axios'
import AvailableQuizzesCard from '../components/AvailableQuizzesCard';
import { NavLink, Outlet } from 'react-router-dom';
import Button from '../components/Button';

export default function AvailableQuizzes() {
    const [quizzes, setQuizzes] = useState([])
    useEffect(() => {
        const fetchData = async () =>{
        //   setLoading(true);
          try {
            // const {data: response} = await axios.get('https://opentdb.com/api_category.php');
            const {data: response} = await axios.get('https://localhost:7034/api/quiz');
            setQuizzes(response);
            console.log(response)
          } catch (error) {
            console.error(error.message);
          }
        //   setLoading(false);
        }
    
        fetchData();
      }, []);
    
    return (
      <>
        <div className="p-6 bg-indigo items-center text-center">
          <Button label="Back" navigateTo="/user" />
          
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {quizzes.map((quiz) => (
              <NavLink
                key={quiz.quizId}
                to={`${quiz.quizId}`}
                state={{ quiz }}
                className="no-underline"
              >
                <AvailableQuizzesCard quiz={quiz} />
              </NavLink>
            ))}
          </div>
        </div>
        {/* <Outlet/> */}
      </>
    )
}
