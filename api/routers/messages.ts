import express from 'express';
import {ActiveConnections, Chat, IncomingMessage, UserFields, UserWithoutPasswordAndToken} from '../types';
import expressWs from 'express-ws';
import Message from '../models/Message';
import {HydratedDocument} from 'mongoose';
import User from '../models/User';

const app = express();
expressWs(app);
const messagesRouter = express.Router();
const activeConnections: ActiveConnections = {};

messagesRouter.ws('', async (ws, req) => {
  const id = req.query.id as string;
  activeConnections[id] = ws;

  ws.on('close', () => {
    delete activeConnections[id];
  });

  ws.on('message', async (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

    try {
      switch (decodedMessage.type) {
        case 'SEND_MESSAGE' :
          const message = JSON.parse(JSON.stringify(decodedMessage.payload)) as Chat;

          const user = await User.findById(message.author) as HydratedDocument<UserWithoutPasswordAndToken>;

          if (!user) break;

          Object.keys(activeConnections).forEach((key) => {
            const conn = activeConnections[key];
            conn.send(
              (JSON.stringify({
                type: 'NEW_MESSAGE',
                payload: {
                  author: {
                    _id: user._id,
                    username: user.username,
                    displayName: user.displayName,
                  },
                  message: message.message
                }
              }))
            );
          });

          const sms = new Message({
            author: message.author,
            message: message.message
          });

          await sms.save();
          break;

        case 'GET_MESSAGES':
          const messages = await Message.find().populate('author', 'username displayName').limit(30);

          ws.send(JSON.stringify({
            type: 'GET_MESSAGES',
            payload: messages
          }));

          break;
        case 'GET_USERS':
          const users: UserWithoutPasswordAndToken[] = [];

          const promises = Object.keys(activeConnections).map(async connId => {
            const user = await User.findById(connId) as HydratedDocument<UserFields>;

            if (user) {
              users.push({username: user.username, displayName: user.displayName, _id: user._id});
            }
          });

          await Promise.all(promises);

          ws.send(JSON.stringify({
            type: 'GET_USERS',
            payload: users,
          }));
          break;
        default:
          console.log('Unknown message type', decodedMessage.type);
      }
    } catch (e) {
      console.log(e);
    }
  });
});

export default messagesRouter;