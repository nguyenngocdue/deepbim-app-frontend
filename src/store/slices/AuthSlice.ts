import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true, // ✅ Khi app load lần đầu, đang kiểm tra user
};

// ✅ Thunk: gọi API /auth/me để lấy user hiện tại
export const fetchCurrentUser = createAsyncThunk<UserProfile>(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch user');
    const json = await res.json();
    return json.data as UserProfile;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setCurrentUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
