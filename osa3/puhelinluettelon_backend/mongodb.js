const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connection.on('connecting', () => {
  console.log('MongoDb: Trying to establish a connection')
})

mongoose.connection.on('connected', () => {
  console.log('MongoDb: Connection established successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDb: Connection failed', err)
})

module.exports.connect = (uri) => {
  return mongoose.connect(uri)
}