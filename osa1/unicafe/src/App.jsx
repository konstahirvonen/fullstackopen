import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const StatisticsLine = (props) => {
  
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  
  if (props.all === 0)
    return (
        <div>
          <p>No feedback given</p>
        </div>
    )
  
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.good}/>
        <StatisticsLine text="neutral" value={props.neutral}/>
        <StatisticsLine text="bad" value={props.bad}/>
        <StatisticsLine text="all" value={props.all}/>
        <StatisticsLine text="average" value={props.average}/>
        <StatisticsLine text="positive" value={props.positive}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" /> 
        <Button handleClick={() => setBad(bad + 1)} text="bad" />

        <h1>statistics</h1>

        <Statistics 
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive}
        />

      </div>
    </div>
  )
}

export default App