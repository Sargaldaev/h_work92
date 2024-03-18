import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import User from '../models/User';
import { User as user } from '../types';

export interface RequestWithUser extends Request {
  user: HydratedDocument<user>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;

  const token = req.get('Authorization');

  if (!token) {
    return res.status(400).send({ error: 'No token !' });
  }

  const user = await User.findOne({ token });

  if (!user) {
    return res.status(400).send({ error: 'Incorrect token !' });
  }

  req.user = user;

  next();
};

export default auth;