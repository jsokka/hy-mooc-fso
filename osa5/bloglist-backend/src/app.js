const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const { errorMiddleware, tokenExtractor } = require('./models/middleware')

const app = express()

mongoose.set('strictQuery', false)

mongoose.connection.on('connecting', () => {
  logger.info('MongoDb: Trying to establish a connection')
})

mongoose.connection.on('connected', () => {
  logger.info('MongoDb: Connection established successfully')
})

mongoose.connection.on('error', (err) => {
  logger.error('MongoDb: Connection failed', err)
})

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (config.IS_TEST_ENV) {
  app.use('/api/testing', testingRouter)
}

app.use(errorMiddleware)

module.exports = app