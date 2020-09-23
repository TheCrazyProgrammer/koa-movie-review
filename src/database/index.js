import { knex } from './connection';
import uuid from '@lukeed/uuid';

export async function insertMovie(title, year, poster_url) {
  const movie = {
    movie_id: uuid(),
    title,
    year,
    poster_url,
  };
  await knex.table('movies').insert(movie);
  return movie;
}

export async function updateMovie(movieId, updates) {
  await knex.table('movies').where('movie_id', movieId).update(updates).limit(1).select('*');
  return findMovie(movieId);
}

export async function updateReview(reviewId, updates) {
  await knex.table('reviews').where('review_id', reviewId).update(updates).limit(1).select('*');
  return findReview(reviewId);
}

export async function insertReview(movieId, author, rating, comment) {
  const review = {
    review_id: uuid(),
    movie_id: movieId,
    author,
    rating,
    comment,
  };
  await knex.table('reviews').insert(review);
  return review;
}

export async function findAllMovies() {
  return knex
    .select('movies.*')
    .count('reviews.review_id', { as: 'reviews_count' })
    .from('movies')
    .leftJoin('reviews', 'movies.movie_id', 'reviews.movie_id')
    .groupBy('movies.movie_id');
}

export async function findReview(reviewId) {
  return knex.table('reviews').where('review_id', reviewId).first();
}

export async function findMovie(movieId) {
  return await knex
    .select('movies.*')
    .count('*', { as: 'reviews_count' })
    .from('movies')
    .leftJoin('reviews', 'movies.movie_id', 'reviews.movie_id')
    .groupBy('movies.movie_id')
    .where('movies.movie_id', movieId)
    .first();
}

export async function movieExist(movieId) {
  return knex.count('*').from('movies').where('movies.movie_id', movieId).first();
}

export async function findMovieReviews(movieId) {
  return knex.select('*').from('reviews').where('movie_id', movieId);
}

export async function userByUsernameExists(username) {
  return (
    await knex.table('users').count('user_id', { as: 'count' }).where('username', username).first()
  ).count;
}

export async function insertUser(username, password, name, token) {
  const user = {
    user_id: uuid(),
    username,
    password,
    name,
    token,
  };
  await knex.table('users').insert(user);
  return user;
}

export async function findUserByUsername(username) {
  return knex.table('users').where('username', username).first();
}

export async function findUserByToken(token) {
  return knex.table('users').where('token', token).first();
}
