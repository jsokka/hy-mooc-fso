import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <b>blogs created</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>
                    {user.name || user.username}
                  </Link>
                </td>
                <td>{user.blogCount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
