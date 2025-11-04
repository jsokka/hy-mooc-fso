require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongodb = require('./mongodb')
const Person = require('./models/person')

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

app.get("/info", (request, response, next) => {
  Person.countDocuments().then((res) => {
    response.send(`
      <div>Phone book has info for ${res} people</div>
      <div>${new Date()}</div>
    `)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  return Person.find({}).then(all => response.json(all))
})

app.post('/api/persons', (request, response, next) => {
  const person = new Person({
    name: (request.body.name || '').trim(),
    number: (request.body.number || '').trim()
  })

  Person.exists({ "name": new RegExp(`^${person.name}$`, 'i') }).then(id => {
    if (id) {
      return response.status(400).json({ error: "Name must be unique" })
    }
    return person.save().then(createdPerson => {
      response.status(201).json(createdPerson)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }
    return response.json(person)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }

  if (person.name.length === 0 || person.number.length === 0) {
    return response.status(400).json({ error: "Name and Number are required" })
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {
    if (!updatedPerson) {
      return response.status(404).end()
    }
    return response.json(updatedPerson)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    return response.status(204).end()
  }).catch(error => next(error))
})

app.use((_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
})

mongodb.connect(process.env.MONGODB_URI)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})