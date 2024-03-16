import {GlobalError, User, ValidationError} from '../../types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {login, register} from './userThunk';

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
};

export const usersSlice = createSlice(({
  name: 'users',
  initialState,
  reducers: {
    clearUser: (state: UserState) => {
      state.user = null;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(register.pending, (state: UserState) => {
      state.registerLoading = true;
      state.registerError = null;
    });
    builder.addCase(register.fulfilled, (state: UserState, action:PayloadAction<User>) => {
      state.registerLoading = false;
      state.user = action.payload || null;
    });
    builder.addCase(register.rejected, (state: UserState, action) => {
      state.registerLoading = false;
      state.registerError = action.payload || null;
    });

    builder.addCase(login.pending, (state: UserState) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(login.fulfilled, (state: UserState, action:PayloadAction<User>) => {
      state.loginLoading = false;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state: UserState, action) => {
      state.loginLoading = false;
      state.loginError = action.payload ? action.payload : null;
    });
  }
}));

export const userReducer = usersSlice.reducer;
export const {clearUser} = usersSlice.actions;
