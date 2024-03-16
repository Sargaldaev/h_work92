import {useEffect, useRef} from 'react';
import {MessageSend, IncomingMessage} from '../../types';
import {connect, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../app/store';
import {addMessage, addMessages, addUsers} from '../../store/chat/chatSlice';
import ChatForm from '../../components/ChatForm';


const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.users);
  const {messages, users} = useSelector((state: RootState) => state.chat);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    ws.current = new WebSocket('ws://localhost:8000/chat?id=' + user._id);

    if (!ws.current) return;


    ws.current.onopen = () => {
      if (!(ws.current && ws.current?.readyState === WebSocket.OPEN)) return;

      if (!messages.length) {
        ws.current?.send(JSON.stringify({
          type: 'GET_MESSAGES',
          payload: '',
        }));
      }

      if (!users.length) {
        ws.current?.send(JSON.stringify({
          type: 'GET_USERS',
          payload: '',
        }));
      }
    };

    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case 'NEW_MESSAGE':
          dispatch(addMessage(decodedMessage.payload));
          break;
        case 'GET_MESSAGES':
          dispatch(addMessages(decodedMessage.payload));
          break;
        case 'GET_USERS':
          dispatch(addUsers(decodedMessage.payload));
          break;
      }
    };


    ws.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
        connect();
      }, 1000);
    };
    return () => {
      if (ws.current && ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.close();
      }
    };
  }, [dispatch, messages, users, user]);
  const sendMessage = (messageText: MessageSend) => {
    if (!ws.current) return;

    ws.current?.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: messageText
    }));
  };

  return (
    <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 10%', paddingTop: '5%'}}>
      <div style={{width: 500}}>
        Users:
        {users.map(user => (
          <div
            style={{borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', gap: 5}}
            key={user._id}
          >
            <h4 style={{margin: 0}}>{user.displayName}</h4>
            <div className="online-user-icon"></div>
          </div>
        ))}
      </div>
      <div style={{border: '2px solid #000', borderRadius: 15, padding: 10, width: 500}}>
        <div key={2} style={{height: 500, overflowY: 'auto'}}>
          {messages.map((message,index) => (
            <div key={index} style={{border: '1px solid #000', borderRadius: 10, padding: 10, marginTop: 10}}>
              <b>{message.author.displayName}: </b>
              {message.message}
            </div>
          ))}
        </div>

        <ChatForm sendMess={sendMessage}/>
      </div>
    </div>
  );
};

export default Chat;