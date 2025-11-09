const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('./../models/user')

router.post('/', async (request, response) => {
  const password = (request.body.password || '').trim()
  const username = (request.body.username || '').trim()

  if (password.length < 3 || username.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 character' })
  }

  const user = User({
    username: username,
    name: request.body.name,
    passwordHash: await bcrypt.hash(password, 10)
  })

  const result = await user.save()
  response.status(201).json(result)
})

router.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.status(200).json(users)
})

module.exports = router