const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw Error('Failed to fetch anecdotes')
  }
  return response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  if (!response.ok) {
    throw new Error('Failed to create anedote')
  }
  return await response.json()
}

const updateVotes = async (id, votes) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes }),
  })
  if (!response.ok) {
    throw new Error('Failed to vote anecdote')
  }
  return response.json()
}

export default { getAll, createNew, updateVotes }