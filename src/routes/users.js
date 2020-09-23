import Router from '@koa/router';
import { zodBodyValidator } from '../middlewares/zodBodyValidator';
import * as z from 'zod';
import { signup } from '../logic/signup';
import { login } from '../logic/login';
import { authenticated } from '../middlewares/authenticated';

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

usersRouter.post(
  '/login',
  zodBodyValidator(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  ),
  async (ctx) => {
    const { username, password } = ctx.request.body;
    ctx.body = await login(username, password);
  }
);

usersRouter.get('/me', authenticated, async (ctx) => {
  ctx.body = ctx.user;
});
