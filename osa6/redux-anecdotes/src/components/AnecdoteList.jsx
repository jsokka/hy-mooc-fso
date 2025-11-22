import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createSelector } from '@reduxjs/toolkit'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  // Use createSelector because filter always returns a new array (a new reference)
  // which may cause unnecessary rendering since useSelector is run every time something changes in root state.
  const anecdotes = useSelector(createSelector(
    [state => state.anecdotes, state => state.filter],
    (anecdotes, filter) => {
      return anecdotes
        .filter(a => filter === '' || a.content.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => b.votes - a.votes)
    }))

  const dispatch = useDispatch()

  const vote = id => {
    const anecdote = anecdotes.find(x => x.id === id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted: ${anecdote.content}`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))
      }
    </>
  )
}

export default AnecdoteList