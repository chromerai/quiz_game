import { useEffect, useState } from 'react'
import QuizEntity from "./components/quizEntity"
import './App.css'
import clsx from 'clsx'

function App() {
  const [questionsData, setQuestionsData] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  async function handleStartButton() {
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
      const data = await res.json();
      setQuestionsData(data.results)
    }
    catch (err) {
      return (
        <h1>There was some error loading the questions! Kindly refresh the page</h1>
      )
    }
    
  }

  function handleAnswerSelect(index, answerData) {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [index]: answerData 
    }))
  }      

  
  const quizItems = questionsData.map((data, index) => {
        return <QuizEntity 
          key={index} 
          questionIndex={index} 
          questionsData={data}
          selectedIndex={selectedAnswers[index]?.selectedIndex ?? null}
          onAnswerSelect={handleAnswerSelect} 
          showResults={showResults}
        />
    })

  function resetGame(){
    setQuestionsData([])
    setSelectedAnswers({})
    setShowResults(false)
  }

  const allAnswers = Object.keys(selectedAnswers).length === questionsData.length
  const numCorrectAnswers = Object.values(selectedAnswers).filter(sA => sA.isCorrect).length

  return (
    <>
      {(questionsData.length === 0) && <div className="initial-screen">
          <h1>Quizzical</h1>
          <p>Lets have some fun</p>
          <button className="start-btn" onClick={handleStartButton}>Start quiz</button>
      </div>}
      {
        (questionsData.length > 0) && <main className='active'>
          <section className='question-section'>
            {quizItems}
          </section>
          {!showResults ?
            <button className={clsx("check-btn", !allAnswers&&"not-usable")}
            onClick={() => setShowResults(true)}
            disabled={!allAnswers}
            >
              Check answers
            </button> 
            : <div className='result'>
                <p>Your scored {numCorrectAnswers}/{questionsData.length} correct answers</p>
                <button onClick={resetGame}>Play Again</button>
              </div>}
        </main>
      }
    </>
  )
}

export default App