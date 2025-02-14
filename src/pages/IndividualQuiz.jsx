// import {React, useEffect, useState} from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios';
// import QuestionCard from '../components/QuestionCard';

// export default function IndividualQuiz({}) {
//     const navigate = useNavigate()
//     const {id} = useParams();
//     const [items, setItems] = useState([])
//     useEffect(() => {
//         const fetchData = async () =>{
//         //   setLoading(true);
//           try {
//             // const {data: response} = await axios.get('https://opentdb.com/api_category.php');
//             const {data: response} = await axios.get(`https://localhost:7034/api/quiz/${id}`);
//             setItems(response);
//             console.log("helooo")
//             console.log(response)
//           } catch (error) {
//             console.error(error.message);
//           }
//         //   setLoading(false);
//         }
    
//         fetchData();
//       }, []);

//       function clickHandler(){
//           if(confirm('Are you sure you want to cancel?')){
//             navigate(-1)
//           }
            
//       }

//   return (
//     <>
//         <div><h1>Quiz {items.quizId} : {items.quizTitle}</h1></div>
//         <button type="button" onClick={clickHandler}>Cancel</button>
//         <div className="quiz-cards-container">
//             <QuestionCard quiz={items}/>
//         </div>
//     </>
//   )
// }



import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/Button";

export default function IndividualQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          `https://localhost:7034/api/quiz/${id}`
        );
        setItems(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function clickHandler() {
    if (confirm("Are you sure you want to cancel?")) {
      navigate(-1);
    }
  }

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  if (!items) {
    return <p>Error loading quiz. Please try again.</p>;
  }

  return (
    <>
      <div>
        <h1>
          Quiz {items.quizId}: {items.quizTitle}
        </h1>
      </div>
      <Button label={"Cancel"} onClick={clickHandler}/>
      <div className="quiz-cards-container">
        <QuestionCard quiz={items} />
      </div>
    </>
  );
}
