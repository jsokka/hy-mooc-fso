const router = require('express').Router()
const Blog = require('./../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: Math.max(request.body.likes || 0, 0)
  }

  if (!blog.title || !blog.url || !blog.author) {
    return response.status(400).json({ error: 'title, url and author are required' })
  }

  var result = await new Blog(blog).save()
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