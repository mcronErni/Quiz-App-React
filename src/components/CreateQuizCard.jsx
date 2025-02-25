import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

const CreateQuizCard = ({ question, index, onChangeAnswer, handleRemoveQuestion, onChangeChoice, onChangeQuestion }) => {
  const [choices, setChoices] = useState(question.choices);
  const choiceRefs = useRef([]);
  
  useEffect(() => {
    // Sync with parent when external changes happen
    if (JSON.stringify(choices) !== JSON.stringify(question.choices)) {
      setChoices(question.choices);
    }
  }, [question.choices]);

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
    setTimeout(() => {
      if (choiceRefs.current[updatedChoices.length - 1]) {
        choiceRefs.current[updatedChoices.length - 1].focus();
      }
    }, 0);
  };

  const handleDeleteChoice = (i) => {
    const updatedChoices = choices.filter((_, index) => index !== i);
    setChoices(updatedChoices);
    onChangeChoice(index, '', i, true); // Added flag for deletion
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChoice();
    }
  };

  return (
    <motion.div 
      className="p-6 bg-white border border-indigo-200 rounded-xl mb-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-indigo-900">Question {index + 1}</h3>
        <Button 
          label="Delete Question" 
          onClick={() => handleRemoveQuestion(index)}
          variant="danger"
          icon="trash"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-indigo-800 mb-2">Question</label>
        <input
          type="text"
          value={question.mQuestion}
          onChange={handleQuestionChange}
          className="mt-1 p-3 border border-indigo-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="Enter your question here..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-indigo-800 mb-2">Correct Answer</label>
        <input
          type="text"
          value={question.answer}
          onChange={(e) => onChangeAnswer(index, e.target.value)}
          className="mt-1 p-3 border border-indigo-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="Enter the correct answer..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-indigo-800 mb-2">Choices</label>
        <div className="space-y-3">
          {choices.map((choice, i) => (
            <motion.div 
              key={i} 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => choiceRefs.current[i] = el}
                className="p-3 border border-indigo-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder={`Choice ${i + 1}`}
              />
              <motion.button
                onClick={() => handleDeleteChoice(i)}
                className="ml-2 p-2 text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <motion.button
          onClick={handleAddChoice}
          className="py-2 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center transition-all duration-200"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Choice
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateQuizCard;