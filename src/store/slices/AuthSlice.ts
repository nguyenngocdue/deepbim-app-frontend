import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: number
  username: string | null
  email: string
  firstName: String
  lastName : String
  picture  : String
  birthday : String
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: UserProfile | null
}

const initialState: AuthState = {
  user: null,
}

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurentUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setCurentUser, clearUser } = AuthSlice.actions
export default AuthSlice.reducer
