const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const errorMiddleware = (error, request, response, next) => {
  logger.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const unauthorized = () => {
    return response.status(401).json({ error: 'missing or invalid bearer token' })
  }

  let userId
  try {
    userId = jwt.verify(request.token, process.env.JWT_SIGNING_KEY).id
  } catch {
    return unauthorized()
  }

  const user = await User.findById(userId)
  if (!user) {
    return unauthorized()
  }
  request.user = user
  next()
}

module.exports = { errorMiddleware, tokenExtractor, userExtractor }