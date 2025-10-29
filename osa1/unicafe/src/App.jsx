import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const points = [
    good * 1,
    neutral * 0,
    bad * -1
  ]

  const total = good + neutral + bad
  const average = total === 0 ? 0 : points.reduce((a, b) => a + b, 0) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <Button onClick={() => setGood(good + 1)} text="good 😋" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral 🙂" />
        <Button onClick={() => setBad(bad + 1)} text="bad 🤮" />
      </div>
      <h2>Statistics</h2>
      <div>Good: {good} | Neutral: {neutral} | Bad: {bad}</div>
      <div>Total: {total} | Average: {average} | Positive: {positivePercentage} %</div>
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

export default App