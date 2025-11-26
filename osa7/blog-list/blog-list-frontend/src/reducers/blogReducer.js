import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return (action.payload || []).sort((a, b) => b.likes - a.likes)
    }
  }
})

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(blogsSlice.actions.setBlogs(blogs))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch, getState) => {
    const payload = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    const updatedBlog = await blogService.updateBlog(blog.id, payload)
    dispatch(
      blogsSlice.actions.setBlogs(
        getState().blogs.map((b) => (b.id === blog.id ? updatedBlog : b))
      )
    )
  }
}

export const createBlog = (blog, currentUser, onSuccess) => {
  return async (dispatch, getState) => {
    try {
      const newBlog = await blogService.createBlog(blog)
      // Backend only returns userid
      newBlog.user = {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name
      }
      dispatch(blogsSlice.actions.setBlogs(getState().blogs.concat(newBlog)))
      dispatch(
        showNotification(`Added a new blog ${blog.title} by ${blog.author} 🎉`)
      )
      onSuccess(newBlog)
    } catch (error) {
      dispatch(
        showNotification(
          `Failed to create a blog: ${error?.response?.data?.error || ''}`,
          'error'
        )
      )
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch, getState) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog.id)
        dispatch(
          blogsSlice.actions.setBlogs(
            getState().blogs.filter((b) => b.id !== blog.id)
          )
        )
        dispatch(
          showNotification(`Removed blog ${blog.title} by ${blog.author}`)
        )
      }
    } catch (error) {
      dispatch(
        showNotification(
          `Failed to remove blog: ${error?.response?.data?.error}`,
          'error'
        )
      )
    }
  }
}

export default blogsSlice.reducer
