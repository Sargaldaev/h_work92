import { DeleteById, Message, UserForUsing } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  messages: Message[];
  onlineUsers: UserForUsing[];
}

const initialState: State = {
  messages: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state:State, {payload}: PayloadAction<Message[]>) => {
      state.messages = payload;
    },
    addMessages: (state:State, {payload}: PayloadAction<Message[]>) => {
      state.messages.push(...payload);
    },
    setUsers: (state:State, {payload}: PayloadAction<UserForUsing[]>) => {
      state.onlineUsers.push(...payload);
    },
  },
});

export const chatReducer = chatSlice.reducer;
export const {setMessages, setUsers,addMessages} = chatSlice.actions;