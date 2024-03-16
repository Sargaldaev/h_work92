import express from 'express';
import mongoose from 'mongoose';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import usersRouter from './routers/users';
import messagesRouter from './routers/messages';

const port = 8000;
const app = express();

expressWs(app);
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/chat', messagesRouter);


const run = async () => {
  await mongoose.connect(config.db);
  app.listen(port, () => console.log(`server started on ${port} port`));
  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run().catch(e => console.log(e));
