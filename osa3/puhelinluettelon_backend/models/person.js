const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(val) {
        const parts = val.split('-') // dash as a separator
        if (parts.length !== 2) {
          return false
        }
        const left = parts[0]
        const right = parts[1]
        return (left.length === 2 || left.length === 3) // Left 2 or 3 numbers
          && left.length + right.length >= 8 // at least 8 numbers in total
          && !isNaN(left) && !isNaN(right) // only numbers in both parts
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)