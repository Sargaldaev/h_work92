import express from 'express';
import User, {UserMethods} from '../models/User';
import mongoose, {HydratedDocument} from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      displayName: req.body.displayName,
      password: req.body.password
    });

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      return res.status(400).send({error: 'Wrong username or password '});
    }

    if (!req.body.password) {
      return res.status(400).send({error: 'Wrong username or password'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(400).send({error: 'Wrong username or password '});
    }

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    next(e);
  }
});

usersRouter.delete('/sessions', auth,async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user as HydratedDocument<UserMethods>;
    user.generateToken();
    user.save();

    return res.send({ message: 'SUCCESS' });
  } catch (e) {
    next(e);
  }
});

export default usersRouter;