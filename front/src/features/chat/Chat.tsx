import {Box} from '@mui/material';
import ChatUsers from './components/ChatUsers';
import ChatMessages from './components/ChatMessages';
import {useEffect, useRef} from 'react';
import {IncomingMessage, MessageForm, MessageRequest} from '../../types';
import {setMessages, setUsers} from '../../store/chat/chatSlice.ts';
import {useAppDispatch, useAppSelector} from '../../app/hook.ts';
import {connect} from 'react-redux';

const Chat = () => {
  const dispatch = useAppDispatch();
  const {messages, onlineUsers} = useAppSelector(state => state.chat);
  const {user} = useAppSelector(state => state.users);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    ws.current = new WebSocket('ws://localhost:8000/chat/' + user._id);

    if (!ws.current) return;

    ws.current.onclose = function (e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function () {
        connect();
      }, 1000);
    };

    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN && !messages.length) {
        ws.current.send(JSON.stringify({
          type: 'GET_MESSAGES',
          payload: '',
        }));
      }
      if (ws.current && ws.current.readyState === WebSocket.OPEN && !onlineUsers.length) {
        ws.current.send(JSON.stringify({
          type: 'GET_USERS',
          payload: '',
        }));
      }
    };

    ws.current.onmessage = (event) => {
      const {type, payload} = JSON.parse(event.data) as IncomingMessage;

      if (type === 'GET_MESSAGES' || type === 'NEW_MESSAGE') {
        dispatch(setMessages(payload));
      } else if (type === 'GET_USERS') {
        dispatch(setUsers(payload));
      }
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [ws.current]);

  const sendMessage = (message: MessageForm) => {
    if (!ws.current || !user) return;

    const payload: MessageRequest = {
      user: user._id,
      text: message.text,
    };

    ws.current.send(JSON.stringify({
      type: 'SET_MESSAGE',
      payload,
    }));
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      height={600}
      marginX={10}
      paddingY={5}
    >
      <ChatUsers/>
      <ChatMessages sendMessage={sendMessage}/>
    </Box>
  );
};

export default Chat;