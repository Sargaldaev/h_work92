export interface User {
  _id: string;
  username: string;
  password: string;
  role: string;
  token: string;
  displayName?: string;
  avatar?: File | null;
}

export interface UserForUsing extends Omit<User, 'password' | 'token'> {
  avatar: string | null;
}

export type UserRegister = Omit<User, '_id' | 'token' | 'role'>;

export interface RegisterResponse {
  user: UserForUsing;
  message: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  error: string;
  message: string;
  name: string;
  _message: string;
}

export interface Message {
  _id: string;
  user: UserForUsing;
  text: string;
  datetime: Date;
}

export interface MessageForm {
  text: string;
}

export interface MessageRequest {
  user: string;
  text: string;
}

export interface IncomingMessage {
  type: string;
  payload: [];
}