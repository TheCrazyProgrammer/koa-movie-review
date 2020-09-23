import { findUserByToken } from '../database';

export async function authenticated(ctx, next) {
  // get the authorization header
  const authHeader = ctx.request.get('Authorization');
  if (!authHeader) {
    return ctx.throw(401, 'Missing Authorization header');
  }
  const [type, bearerToken] = authHeader.split(' ');
  if (!type || !bearerToken || type !== 'Bearer') {
    return ctx.throw(401, 'Invalid Authorization header');
  }
  const user = await findUserByToken(bearerToken);
  if (!user) {
    return ctx.throw(401, 'Invalid token');
  }
  // foud the user, store it on ctx
  const { user_id, username, name, token } = user;
  ctx.user = { user_id, username, name, token };
  return next();
}
