import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createBlog,
  deleteBlog,
  likeBlog
} from './../reducers/blogReducer'
import Blog from './Blog'
import Toggleable from './Toggleable'
import CreateBlogForm from './CreateBlogForm'

const BlogList = ({ currentUser }) => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const createBlogToggleRef = useRef()
  const createBlogFormRef = useRef()

  const handleLikeBlog = (blog) => dispatch(likeBlog(blog))
  const handleRemoveBlog = (blog) => dispatch(deleteBlog(blog))
  const handleCreateBlog = async (blog) => {
    dispatch(
      createBlog(blog, currentUser, () => {
        createBlogFormRef.current.resetForm()
        createBlogToggleRef.current.toggleVisibility()
      })
    )
  }

  return (
    <>
      <Toggleable buttonLabel="Create new blog" ref={createBlogToggleRef}>
        <CreateBlogForm onSubmit={handleCreateBlog} ref={createBlogFormRef} />
      </Toggleable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          currentUser={currentUser}
          onLike={handleLikeBlog}
          onRemove={handleRemoveBlog}
        />
      ))}
    </>
  )
}

export default BlogList
