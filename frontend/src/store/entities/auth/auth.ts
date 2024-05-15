import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosAuthorizedBaseQuery } from '../../api/axiosQuery';

type AuthState = {
  userAuth: 'doctor' | 'client' | null;
  token: string | null;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosAuthorizedBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<string, { username: string }>({
      query: (body) => ({
        url: 'authorization/login',
        method: 'POST',
        data: body,
      }),
    }),
  }),
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userAuth: localStorage.getItem('userAuth') ?? null,
    token: localStorage.getItem('refreshToken') ?? null,
  } as AuthState,
  reducers: {
    //эти редюсеры могут пригодится для будущего рефактора авторизации
    tokenReceived(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
    loggedOut(state) {
      state.token = null;
      state.userAuth = null;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userAuth');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.token = payload;
      state.userAuth = 'doctor';
      localStorage.setItem('userAuth', 'admin');
      localStorage.setItem('token', payload);
    });
  },
});

export const { useLoginMutation } = authApi;
