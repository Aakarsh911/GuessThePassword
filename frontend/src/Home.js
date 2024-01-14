import React, { useState, useRef, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function Home() {
  function generateRandomNumber() {
    const min = 1000000;
    const max = 9999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }

  function changeRandomIndex(num, number) {
    let numberArray = number.split(''); // Convert string to array
    for (let i = 0; i < num; i++) {
      let indexToChange = Math.floor(Math.random() * numberArray.length);
      let temp = Math.floor(Math.random() * 10);
      numberArray[indexToChange] = temp.toString();
      console.log(numberArray);
    }
    return numberArray.join(''); // Convert array back to string
  }
  function distinctNumber(show, guess) {
    let guessArray = guess.split('');
    let showArray = show.split('');
    let different = 0;
    let index = 0;
    for (let i = 0; i < guessArray.length; i++) {
      if (guess[i] !== show[i]) {
        return guess[i];
      }
    }
  }

  function distinctIndex(show, guess) {
    let guessArray = guess.split('');
    let showArray = show.split('');
    let different = 0;
    let index = 0;
    for (let i = 0; i < guessArray.length; i++) {
      if (guess[i] !== show[i]) {
        return i + 1;
      }
    }
  }

  function ask() {
    let question = document.querySelector('.questions input').value;
  
    if (question === '') {
      toast.error('Please enter a question!');
    } else {
      fetch(`http://localhost:3001/ask/${numberToGuess}/${numberToShow}/${differentNum}/${diffIndex}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })
        .then((res) => res.text())  // Use res.text() instead of res.json()
        .then((data) => {
          if (numTries === 0) {
            toast.error('Cannot ask any more questions!');
          }
          else {
            if (data !== 'not a yes or no question') {
              toast.info(data + '.');
              setNumTries(numTries - 1);
              setAllQuestions([question, ...allQuestions]);
              setAllAnswers([data, ...allAnswers]);
            }
            else {
              toast.error('Please ask a yes or no question!');
            }
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
        });
    }
  }
  

  const [numberToShow, setNumberToShow] = useState(generateRandomNumber());
  const [numberToGuess, setNumberToGuess] = useState(changeRandomIndex(1, numberToShow));
  const differentNum = distinctNumber(numberToShow, numberToGuess) ;
  const diffIndex = distinctIndex(numberToShow, numberToGuess);
  const [userInput, setUserInput] = useState(['', '', '', '', '', '', '']);
  const [confetti, setConfetti] = useState(false);
  const inputRefs = useRef([]);
  const [numTries, setNumTries] = useState(5);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);

  const handleInputChange = (index, value) => {
    const newInput = [...userInput];
    newInput[index] = value;

    if (value !== '' && index !== userInput.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    setUserInput(newInput);
  };

  const handleGuessCheck = () => {
    if (userInput.join('') === numberToGuess) {
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
      }, 3000);
    } else {
      toast.error('You guessed the wrong password!');
    }
  };

  useEffect(() => {
    const nextIndex = userInput.findIndex((value, index) => value === '' && index < userInput.length - 1);
    if (nextIndex !== -1) {
      inputRefs.current[nextIndex].focus();
    }
  }, [userInput]);

  return (
    <div className="container">
      <h1>Guess The Password</h1>
      <h2 className="num-tries">Number of questions left: {numTries}</h2>
      <h1 className="show-num">{numberToShow}</h1>
      <h4>A random one digit has been changed. Guess the new password.</h4>
      <div className="input-boxes">
        {userInput.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && value === '' && index !== 0) {
                inputRefs.current[index - 1].focus();
              }
            }}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
      {confetti && <ReactConfetti />}
      <div className="btns">
        <button
          className="new-game"
          onClick={() => {
            setConfetti(false);
            setUserInput(['', '', '', '', '', '', '']);
            window.location.reload();
          }}
        >
          Reset
        </button>
        <button className="check-btn" onClick={handleGuessCheck}>
          Check
        </button>
      </div>
      <div className="questions">
        <input type="text" placeholder="Enter your question here" />
        <button className="submit-btn" onClick={ask}>Submit</button>
      </div>
      <div className="all-questions">
        <h2>All Questions</h2>
        <div className="list">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {allQuestions.map((question, index) => (
                <tr key={index}>
                  <td>{question}</td>
                  <td>{allAnswers[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
