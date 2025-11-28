import { Link } from 'react-router'

const Blog = ({ blog }) => {
  const boxStyle = {
    border: '1px solid #ccc',
    padding: 4,
    margin: 4
  }

  return (
    <div style={boxStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default Blog
