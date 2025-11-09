const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../src/app')
const Blog = require('../src/models/blog')
const User = require('../src/models/user')

const api = supertest(app)

const testUsername = 'testuser_0'
const testPassword = 'password1234'

const initBlogTestDb = async (blogCount) => {
  await clearBlogTestDb()

  const user = await createUser(testUsername, 'Test User 0', testPassword)

  const blogs = []
  for (let i = 0; i < blogCount; i++) {
    blogs.push(new Blog({
      title: `Test blog ${i}`,
      url: `https://blogs.com/${i}`,
      author: `Blog Author ${i}`,
      likes: Math.floor(Math.random() * 1000),
      user: user._id
    }))
  }
  await Blog.insertMany(blogs)
  return blogs
}

const loginTestUser = async (username, password) => {
  var response = await api.post('/api/login')
    .send({ username: username || testUsername, password: password || testPassword })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  return response.body.token
}

const clearBlogTestDb = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
}

const createUser = async (username, name, password) => {
  const user = User({
    username,
    name,
    passwordHash: await bcrypt.hash(password, 10)
  })
  return await user.save()
}

module.exports = { initBlogTestDb, clearBlogTestDb, createUser, loginTestUser }