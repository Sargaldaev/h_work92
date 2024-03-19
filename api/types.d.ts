import { WebSocket } from 'ws';
import { Types } from 'mongoose';

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface User {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName?: string | null;
  avatar?: string | null;
}

export type UserSecure = Omit<User, 'password' | 'token'>;

export interface Message {
  user: Types.ObjectId;
  text: string;
  datetime: Date,
}

