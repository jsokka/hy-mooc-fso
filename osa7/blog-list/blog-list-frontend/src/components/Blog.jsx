import { useState } from 'react'

const Blog = ({ blog, currentUser, onLike, onRemove }) => {
  const [showAll, setShowAll] = useState(false)

  const boxStyle = {
    border: '1px solid #ccc',
    padding: 4,
    margin: 4
  }

  const getDisplayName = (user) => {
    if (!user) {
      return '?'
    }
    if (user.name?.length > 0) {
      return user.name
    }
    return user.username
  }

  return (
    <div style={boxStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'hide' : 'view'}
      </button>
      {showAll && (
        <>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{getDisplayName(blog.user)}</div>
          {currentUser && currentUser.username === blog.user.username && (
            <button onClick={() => onRemove(blog)}>delete</button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
