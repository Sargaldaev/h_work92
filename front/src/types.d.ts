export interface User {
  _id: string;
  username: string;
  displayName: string;
  password: string;
  token: string;
}

export type UserWithoutPasswordAndToken = Omit<User, 'password' | 'token'>;


export interface Register {
  username: string;
  password: string;
  displayName: string;
}

export interface Login {
  username: string;
  password: string;
}
export interface ChatMessage {
  _id: string
  author: UserWithoutPasswordAndToken,
  message: string
}

export interface MessageSend {
  author: string;
  message: string;
}

export interface IncomingMessage {
  type: string,
  payload: ChatMessage
}


export interface ValidationError {
  errors: {
    [key: string]: {
      name: string,
      message: string,
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}