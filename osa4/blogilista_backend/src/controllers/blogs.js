const router = require('express').Router()
const Blog = require('./../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post('/', async (request, response) => {
  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog(request.body)

  var result = await blog.save()
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
    likes: request.body.likes
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if (!result) {
    return response.status(404).end()
  }

  response.status(200).json(result)
})

module.exports = router