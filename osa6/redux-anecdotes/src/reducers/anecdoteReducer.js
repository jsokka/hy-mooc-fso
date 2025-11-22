import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const initialState = []

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    setAnecdotes(_state, action) {
      return action.payload
    },
    setVotes(state, action) {
      const { id, votes } = action.payload
      const anecdote = state.find(x => x.id === id)
      anecdote.votes = votes
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    }
  }
})

const { appendAnecdote, setAnecdotes, setVotes } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const id = anecdote.id
    const votes = anecdote.votes + 1
    await anecdoteService.updateVotes(id, votes)
    dispatch(setVotes({ id, votes }))
  }
}

export default anecdotesSlice.reducer
