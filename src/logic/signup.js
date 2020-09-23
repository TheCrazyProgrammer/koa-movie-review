import { insertUser, userByUsernameExists } from '../database';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { HttpError } from './HttpError';

export async function signup(username, password, name) {
  const alreadyExist = await userByUsernameExists(username);
  if (alreadyExist) {
    throw new HttpError(400, 'This usersname already exists');
  }
  const token = nanoid();
  const passwordHashed = await bcrypt.hash(password, 10);
  const user = await insertUser(username, passwordHashed, name, token);
  return user;
}
