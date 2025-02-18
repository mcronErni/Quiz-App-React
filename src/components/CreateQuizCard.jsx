import React, { useState, useRef } from 'react';
import Button from './Button';

const CreateQuizCard = ({ question, index, onChangeAnswer, handleRemoveQuestion, onChangeChoice, onChangeQuestion }) => {
  const [choices, setChoices] = useState(question.choices);
  
  const choiceRefs = useRef([]);

  const handleQuestionChange = (e) => {
    onChangeQuestion(index, e.target.value); 
  };

  const handleChoiceChange = (e, i) => {
    const updatedChoices = [...choices];
    updatedChoices[i] = e.target.value;
    setChoices(updatedChoices);
    onChangeChoice(index, updatedChoices[i], i); 
  };

  const handleAddChoice = () => {
    const updatedChoices = [...choices, ''];
    setChoices(updatedChoices);
  
    onChangeChoice(index, updatedChoices[updatedChoices.length - 1], updatedChoices.length - 1);
  
    // Delay focusing to ensure React has updated the DOM
    setTimeout(() => {
      if (choiceRefs.current[updatedChoices.length - 1]) {
        choiceRefs.current[updatedChoices.length - 1].focus();
      }
    }, 0);
  };

  const handleDeleteChoice = (i) => {
    const updatedChoices = choices.filter((_, index) => index !== i);
    setChoices(updatedChoices);
    onChangeChoice(index, updatedChoices[i] || '', i);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChoice();
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg mb-4">
      <h3 className="text-xl font-semibold mb-2">Question {index + 1}</h3>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Question</label>
        <input
          type="text"
          value={question.mQuestion}
          onChange={handleQuestionChange}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Answer</label>
        <input
          type="text"
          value={question.answer}
          onChange={(e) => onChangeAnswer(index, e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Choices</label>
        {choices.map((choice, i) => (
          <div key={i} className="mb-2 flex items-center">
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)} // Handle key press event
              ref={(el) => choiceRefs.current[i] = el} // Attach ref to each input
              className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleDeleteChoice(i)}
              className="ml-2 text-red-500"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <button
          onClick={handleAddChoice}
          className="py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Choice
        </button>
      </div>
      <Button label={"❌ Delete"} onClick={() => handleRemoveQuestion(index)}/>
    </div>
  );
};

export default CreateQuizCard;
