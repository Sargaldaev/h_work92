import mongoose, {model, Schema} from 'mongoose';
import {Chat} from '../types';
import User from './User';


const MessageSchema = new Schema<Chat>({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => await User.findById(value),
      message: 'User does not exist',
    },
  },

  message: {
    type: String,
    required: true
  }
});


const Message = model('Message', MessageSchema);
export default Message;