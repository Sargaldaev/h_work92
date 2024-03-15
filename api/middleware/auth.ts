import {NextFunction, Request, Response} from 'express';
import {HydratedDocument} from 'mongoose';
import User from '../models/User';
import {UserFields} from '../types';

export interface RequestWithUser extends Request {
  user: HydratedDocument<UserFields>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).send({error: 'No token present!'});
  }

  const user = await User.findOne({token});

  if (!user) {
    return res.status(401).send({error: 'Wrong token!'});
  }

  req.user = user;
  next();
};

export default auth;