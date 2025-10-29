import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <Button onClick={() => setGood(good + 1)} text="good 😋" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral 🙂" />
        <Button onClick={() => setBad(bad + 1)} text="bad 🤮" />
      </div>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistics = ({ good, neutral, bad }) => {
  const points = [
    good * 1,
    neutral * 0,
    bad * -1
  ]

  const total = good + neutral + bad
  const average = total === 0 ? 0 : points.reduce((a, b) => a + b, 0) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  if (total === 0) {
    return (
      <div>No feedback given</div>
    )
  }

  return (
    <div>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="all" value={total} />
      <StatisticsLine text="average" value={average} />
      <StatisticsLine text="positive" value={`${positivePercentage} %`} />
    </div>
  )
}

const StatisticsLine = ({ text, value }) => (
  <div>
    {text} {value}
  </div>
)

export default App