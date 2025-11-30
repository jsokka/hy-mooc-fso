const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  var { username, password } = request.body
  if ((username || '').length === 0 || (password || '').length === 0) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const user = await User.findOne({ username })
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const token = jwt.sign({ username, id: user._id }, process.env.JWT_SIGNING_KEY)
  response.status(200).json({
    token,
    username,
    name: user.name
  })
})

module.exports = loginRouter