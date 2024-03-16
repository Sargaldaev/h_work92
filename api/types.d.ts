import {Schema} from 'mongoose';
import {WebSocket} from 'ws';

export interface UserFields {
  _id: Schema.Types.ObjectId;
  username: string;
  displayName: string;
  password: string;
  token: string;
}


export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string,
  payload: string
}

export interface Chat {
  author: Schema.Types.ObjectId;
  message: string;
}

export type UserWithoutPasswordAndToken = Omit<UserFields, 'password' | 'token'>;
