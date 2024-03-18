import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import { RegisterResponse, UserForUsing, UserRegister, ValidationError } from '../../types';
import { isAxiosError } from 'axios';

export const register = createAsyncThunk<
  UserForUsing,
  UserRegister,
  { rejectValue: ValidationError }
>('users/register', async (userRegister, {rejectWithValue}) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(userRegister) as (keyof UserRegister)[];

    keys.forEach((key) => {
      const value = userRegister[key];

      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const {data} = await axiosApi.post<UserForUsing>('/users', formData);

    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const login = createAsyncThunk<
  UserForUsing,
  UserRegister,
  { rejectValue: ValidationError }
>('users/login', async (user, {rejectWithValue}) => {
  try {
    const {data} = await axiosApi.post<RegisterResponse>('/users/sessions', user);
    return data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const logout = createAsyncThunk('users/logout', async () => {
  await axiosApi.delete('/users/sessions');
});
