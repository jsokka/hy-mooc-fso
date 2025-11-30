import { createSlice } from '@reduxjs/toolkit'
import userService from './../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const fetchUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(
      usersSlice.actions.setUsers(
        users.map((user) => {
          return { ...user, blogCount: user.blogs.length }
        })
      )
    )
  }
}

export default usersSlice.reducer
