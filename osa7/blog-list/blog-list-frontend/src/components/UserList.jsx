import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <b>Blogs created</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell component="th" scope="row">
                  <Link to={`/users/${user.id}`}>
                    {user.name || user.username}
                  </Link>
                </TableCell>
                <TableCell>{user.blogCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
