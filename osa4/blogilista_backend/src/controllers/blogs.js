const router = require('express').Router()
const Blog = require('./../models/blog')
const { userExtractor } = require('../models/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = {
    title: request.body?.title,
    author: request.body?.author,
    url: request.body?.url,
    likes: Math.max(request.body?.likes || 0, 0),
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

router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'user not authorized to delete the blog' })
  }

  await blog.deleteOne()
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