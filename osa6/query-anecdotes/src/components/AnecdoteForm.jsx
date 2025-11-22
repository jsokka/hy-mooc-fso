import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import anecdoteService from '../services/anecdoteService'
import NotificationContext from './NotificationProvider'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { notificationDispatch } = useContext(NotificationContext)

  const showNotification = (message) => notificationDispatch({ type: 'SET', payload: { message } })

  const mutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      showNotification(`You added: ${newAnecdote.content}`)
    },
    onError: (error) => {
      showNotification(error.toString())
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    mutation.mutate(content, {
      onSuccess: () => {
        event.target.anecdote.value = ''
      },
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit" disabled={mutation.isPending}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
