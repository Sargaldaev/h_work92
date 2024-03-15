import {HydratedDocument, Model, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import {randomUUID} from 'crypto';
import {UserFields} from '../types';

const SALT_WORK_FACTOR = 10;


export interface UserMethods extends UserFields {
  generateToken(): void;

  checkPassword(password: string): Promise<boolean>;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<UserFields>,
        username: string,
      ): Promise<boolean> {
        if (!this.isModified('username')) return true;
        const user: HydratedDocument<UserFields> | null = await User.findOne({username});
        return !Boolean(user);
      },
      message: 'This user is already registered',
    },
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = model('User', UserSchema);
export default User;