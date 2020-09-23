import { findUserByUsername } from '../database';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { HttpError } from './HttpError';

export async function login(username, password) {
  const user = await findUserByUsername(username);
  let isValid = false;
  if (user) {
    isValid = await bcrypt.compare(password, user.password);
  }
  if (!isValid) {
    throw new HttpError(403);
  }
  return user;
}
