import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import * as crypto from 'crypto';
import Message from './models/Message';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('messages');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user] = await User.create(
    {
      username: 'User',
      password: '123',
      displayName: 'Bob',
      avatar: 'fixtures/user.png',
      role: 'user',
      token: crypto.randomUUID(),
    },
    {
      username: 'Admin',
      password: '153',
      displayName: 'Triss',
      avatar: 'fixtures/admin.png',
      role: 'moderator',
      token: crypto.randomUUID(),
    },
  );

  await Message.create(
    {
      user: admin._id,
      text: 'how are you',
    },

    {
      user: user._id,
      text: 'something',
    },
    {
      user: user._id,
      text: 'Hello my friend',
    },

  );
  await db.close();
};

run().catch(console.error);
