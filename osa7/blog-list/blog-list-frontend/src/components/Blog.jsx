import { Link } from 'react-router'
import { IconButton, ListItem, ListItemText } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const Blog = ({ blog }) => {
  return (
    <ListItem divider>
      <ListItemText
        primary={
          <Link
            to={`/blogs/${blog.id}`}
            style={{
              lineHeight: '2em',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            {blog.title} {blog.author}
            <IconButton size="small" style={{ float: 'right' }}>
              <NavigateNextIcon />
            </IconButton>
          </Link>
        }
      ></ListItemText>
    </ListItem>
  )
}

export default Blog
