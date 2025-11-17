require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const IS_TEST_ENV = process.env.NODE_ENV === 'test'

module.exports = { PORT, MONGODB_URI, IS_TEST_ENV }