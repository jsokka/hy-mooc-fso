const _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  if ((blogs || []).length === 0) {
    return 0
  }
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if ((blogs || []).length === 0) {
    return null
  }
  return blogs.reduce((fav, blog) => (fav.likes > blog.likes ? fav : blog), blogs[0])
}

const mostBlogs = (blogs) => {
  return _.chain(blogs || []).groupBy('author').map((value, key) => {
    return {
      author: key,
      blogs: value.length
    }
  }).orderBy('blogs', 'desc').value()[0]
}

const mostLikes = (blogs) => {
  return _.chain(blogs || []).groupBy('author').map((value, key) => {
    return {
      author: key,
      likes: value.reduce((sum, blog) => sum + blog.likes, 0)
    }
  }).orderBy('likes', 'desc').value()[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}