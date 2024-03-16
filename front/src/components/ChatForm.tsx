import React, { useState } from 'react';
import { MessageSend } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Button, TextField } from '@mui/material';

interface Props {
  sendMess: (message: MessageSend) => void;
}

const ChatForm: React.FC<Props> = ({ sendMess }) => {
  const { user } = useSelector((state: RootState) => state.users);
  const [messageText, setMessageText] = useState<MessageSend>({
    author: user ? user._id : '',
    message: ''
  });

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setMessageText((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    sendMess(messageText);
    setMessageText({
      author: user ? user._id : '',
      message: ''
    });
  };

  return (
    <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10 }}>
      <TextField
        required
        type="text"
        label="Message:"
        name="message"
        style={{ width: '100%' }}
        value={messageText.message}
        onChange={changeMessage}
      />

      <Button variant="contained" type="submit">Send</Button>
    </form>
  );
};

export default ChatForm;