import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: number
  username: string | null
  email: string
  firstName: string
  lastName : string
  picture  : string
  birthday : string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: UserProfile | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
}

// ✅ Thunk: gọi API /me
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No token found')

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error('Failed to fetch user')
    return await res.json() as UserProfile
  }
)

const authSlice = createSlice({
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.loading = false
      })
  }
})

export const { setCurentUser, clearUser } = authSlice.actions
export default authSlice.reducer
