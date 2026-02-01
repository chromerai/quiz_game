import {decode} from "html-entities"
import { useMemo } from "react"
import clsx from "clsx"

export default function QuizEntity(prop) {
    const {questionIndex, questionsData, selectedIndex, onAnswerSelect, showResults} = prop

    const options = useMemo(() => {
        const optionsList = [questionsData.correct_answer, ...questionsData.incorrect_answers]

        return optionsList.map((option, index) => ({
            text: option,
            isCorrect: index === 0
        })).sort(() => Math.random() - 0.5)
    }, [questionsData])

    const correctIndex = options.findIndex(option => option.isCorrect)

    const handleOptionClick = (index) => {
        if(showResults) return;

        onAnswerSelect(questionIndex, {
            selectedIndex: index,
            isCorrect: options[index].isCorrect,
            selectedText: options[index].text,
            correctIndex: correctIndex,
        })
    }

    const optionListEl = options.map((option, index) => {
        const isSelected = selectedIndex === index
        const isCorrect = option.isCorrect

        const optionClassName= clsx("option-container__item", {
            "selected": isSelected && !showResults,
            "correct": showResults && isCorrect,
            "wrong": showResults && isSelected && !isCorrect
    })
        return (
            <li 
                key={index}
                className={optionClassName}
                onClick={() => handleOptionClick(index)}
                >
                    {decode(option.text)}
                </li>
        )
    })

    return (
        <div className="container">
            <h2 className="question-text">{decode(questionsData.question)}</h2>
            <ul className="options-container">
                {optionListEl}
            </ul>
        </div>
    )
}