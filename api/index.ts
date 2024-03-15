import express from 'express';
import mongoose from 'mongoose';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';

const port = 8088;
const app = express();

expressWs(app)
app.use(cors());
app.use(express.json());


const run = async () => {
  await mongoose.connect(config.db);
  app.listen(port, () => console.log(`server started on ${port} port`));
  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run().catch(e => console.log(e));
