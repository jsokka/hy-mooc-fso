const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2"
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3"
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4"
  }
]

const generateId = () => {
  const min = 1
  const max = 1000
  id = Math.floor(Math.random() * (max - min) + min)
  if (persons.some(p => p.id === id)) {
    return generateId()
  }
  return String(id)
}

app.get("/info", (request, response) => {
  response.send(`
    <div>Phone book has info for ${persons.length} people</div>
    <div>${new Date()}</div>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const person = {
    name: (request.body.name || '').trim(),
    number: (request.body.number || '').trim(),
    id: generateId()
  }

  if (person.name.length === 0 || person.number.length === 0) {
    return response.status(400).json({ error: "Name and Number are required" })
  }

  if (persons.some(p => p.name.toLowerCase() === person.name.toLowerCase())) {
    return response.status(400).json({ error: "Name must be unique" })
  }

  persons.push(person)
  response.status(201).json(person)
})

app.get('/api/persons/:id', (request, response) => {
  var person = persons.find(p => p.id == request.params.id)

  if (!person) {
    return response.status(404).end()
  }

  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== request.params.id)
  return response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})