import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdoteService from './services/anecdoteService'
import { useContext } from 'react'
import NotificationContext from './components/NotificationProvider'

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const { isPending, isError, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, votes }) => anecdoteService.updateVotes(id, votes),
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueriesData(['anecdotes'], anecdotes.map(x => x.id === updatedAnecdote.id ? updatedAnecdote : x))
      notificationDispatch({ type: 'SET', payload: { message: `You voted: ${updatedAnecdote.content}` } })
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate({ id: anecdote.id, votes: anecdote.votes + 1 })
  }

  if (isPending) {
    return <div>loading anecdotes...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server.</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
