import express from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import User, { UserMethods } from '../models/User';
import auth, { RequestWithUser } from '../middleware/auth';
import { imagesUpload } from '../multer';

const usersRouter = express.Router();

usersRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName || 'Anonymous',
      avatar: req.file ? 'images/' + req.file.filename : null,
    })

    user.generateToken();

    await user.save();
    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }) as HydratedDocument<UserMethods>;

    if (!user) {
      return res.status(400).send({ error: 'Wrong username or password!' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send({ error: 'Wrong username or password!' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Username and password correct!', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user as HydratedDocument<UserMethods>;
    user.generateToken();
    await user.save();

    return res.send({ message: 'SUCCESS' });
  } catch (e) {
    next(e);
  }
});

export default usersRouter;