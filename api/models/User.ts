import { HydratedDocument, Model, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../types';
import { randomUUID } from 'crypto';

const SALT_WORK_FACTORS = 10;

export interface UserMethods extends User {
  generateToken(): void;
}

type UserModel = Model<User, {}, UserMethods>;

const UserSchema = new Schema<User, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<User>,
        username: string,
      ): Promise<boolean> {
        if (!this.isModified('username')) return true;
        const user: HydratedDocument<User> | null = await User.findOne({ username });
        return !Boolean(user!);
      },
      message: 'This user is already registered',
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  },
  displayName: String,
  avatar: String,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTORS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;

    return ret;
  },
});

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = model('User', UserSchema);

export default User;