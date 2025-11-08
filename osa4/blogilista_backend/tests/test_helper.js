const Blog = require('../src/models/blog')

const initBlogTestDb = async (blogCount) => {
  await clearBlogTestDb()
  const blogs = []
  for (let i = 0; i < blogCount; i++) {
    blogs.push(new Blog({
      title: `Test blog ${i}`,
      url: `https://blogs.com/${i}`,
      likes: Math.floor(Math.random() * 1000)
    }))
  }
  await Blog.insertMany(blogs)
  return blogs
}

const clearBlogTestDb = async () => {
  await Blog.deleteMany({})
}

module.exports = { initBlogTestDb, clearBlogTestDb }