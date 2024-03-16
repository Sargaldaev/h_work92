import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore,  FLUSH, PAUSE, PERSIST,PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userReducer } from '../store/user/userSlice';
import {chatReducer} from '../store/chat/chatSlice.ts';

const usersPersistConfig={
  key: 'chat:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, userReducer),
  chat: chatReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware)=>{
    return getDefaultMiddleware({
      serializableCheck:{
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persister = persistStore(store);