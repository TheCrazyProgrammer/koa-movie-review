import Router from '@koa/router';
import { zodBodyValidator } from '../middlewares/zodBodyValidator';
import * as z from 'zod';
import { signup } from '../logic/signup';

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
    ctx.body = await signup(username, password, name);
  }
);
