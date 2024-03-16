import axios, { AxiosHeaders } from 'axios';
import { Store } from '@reduxjs/toolkit';
import { RootState } from './app/store';

export const addInterceptor = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config) => {
    const token = store.getState().users.user?.token;
    const headers = config.headers as AxiosHeaders;
    headers.set('Authorization', token);

    return config;
  });
};

const axiosApi = axios.create({
  baseURL: 'http://localhost:8000'
})

export default axiosApi