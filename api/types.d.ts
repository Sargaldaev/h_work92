import { WebSocket } from 'ws';
import { Types } from 'mongoose';

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName?: string | null;
  avatar?: string | null;
}

export type UserSecure = Omit<UserFields, 'password' | 'token'>;

export interface Message {
  _id?:string;
  user: Types.ObjectId;
  text: string;
  datetime: Date,
}