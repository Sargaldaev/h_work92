import { ChatMessage, UserWithoutPasswordAndToken } from '../../types';
import { createSlice } from '@reduxjs/toolkit';

interface State {
  messages: ChatMessage[];
  users: UserWithoutPasswordAndToken[];
}

const initialState: State = {
  messages: [],
  users: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessages: (state: State, action) => {
      state.messages.push(...action.payload);
    },
    addMessage: (state: State, action) => {
      state.messages.push(action.payload);
    },
    addUsers: (state: State, action) => {
      state.users.push(...action.payload);
    }
  },
});

export const chatReducer = chatSlice.reducer;
export const { addMessages, addMessage, addUsers } = chatSlice.actions;