const bcrypt = require('bcrypt')
const Blog = require('../src/models/blog')
const User = require('../src/models/user')

const initBlogTestDb = async (blogCount) => {
  await clearBlogTestDb()

  const user = await createUser('testuser_0', 'Test User 0', 'password1234')

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

module.exports = { initBlogTestDb, clearBlogTestDb, createUser }