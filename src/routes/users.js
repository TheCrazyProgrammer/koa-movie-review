import Router from '@koa/router';
import { zodBodyValidator } from '../middlewares/zodBodyValidator';
import * as z from 'zod';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { insertUser, userByUsernameExists } from '../database';

export const usersRouter = Router();

usersRouter.post(
  '/signup',
  zodBodyValidator(
    z.object({
      username: z.string().nonempty(),
      password: z.string().min(4),
      name: z.string().nonempty(),
    })
  ),
  async (ctx) => {
    const { username, password, name } = ctx.request.body;
    const alreadyExist = await userByUsernameExists(username);
    if (alreadyExist) {
      return ctx.throw(400, 'This username already taken');
    }
    const token = nanoid();
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await insertUser(username, passwordHashed, name, token);
    ctx.body = user;
  }
);
