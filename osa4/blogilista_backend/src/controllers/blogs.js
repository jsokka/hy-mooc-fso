const router = require('express').Router()
const Blog = require('./../models/blog')
const User = require('./../models/user')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.post('/', async (request, response) => {
  const user = (await User.find({}))[0]

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: Math.max(request.body.likes || 0, 0),
    user: user._id
  }

  if (!blog.title || !blog.url || !blog.author) {
    return response.status(400).json({ error: 'title, url and author are required' })
  }

  var result = await new Blog(blog).save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

router.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    url: request.body.url,
    author: request.body.author,
    likes: request.body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if (!result) {
    return response.status(404).end()
  }

  response.status(200).json(result)
})

module.exports = router