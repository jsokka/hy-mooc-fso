const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

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

app.use('/api/blogs', blogsRouter)

module.exports = app