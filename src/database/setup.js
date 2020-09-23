import { knex, SQLITE_FILE_PATH } from './connection';
import fse from 'fs-extra';
import path from 'path';
import uuid from '@lukeed/uuid';

export async function setupDatabase() {
  const dbExist = fse.existsSync(SQLITE_FILE_PATH);

  await fse.ensureDir(path.dirname(SQLITE_FILE_PATH));

  const hasMovies = await knex.schema.hasTable('movies');
  if (!hasMovies) {
    await knex.schema.createTable('movies', (moviesTable) => {
      moviesTable.uuid('movie_id').primary();
      moviesTable.string('title').notNullable();
      moviesTable.integer('year').notNullable();
      moviesTable.string('poster_url').defaultTo(null);
    });
  }

  const hasReviews = await knex.schema.hasTable('reviews');
  if (!hasReviews) {
    await knex.schema.createTable('reviews', (reviewsTable) => {
      reviewsTable.uuid('review_id').primary();
      reviewsTable.uuid('movie_id').notNullable().references('movie_id').inTable('movies');
      reviewsTable.string('author').notNullable();
      reviewsTable.integer('rating').notNullable();
      reviewsTable.text('comment');
    });
  }

  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (usersTable) => {
      usersTable.uuid('user_id').primary();
      usersTable.string('username').unique().notNullable();
      usersTable.string('token').notNullable();
      usersTable.string('password').notNullable();
      usersTable.string('name').notNullable();
    });
  }

  if (dbExist === false) {
    // populate with init data
    const movies = [
      {
        movie_id: uuid(),
        title: 'Inception',
        year: 2010,
        poster_url:
          'https://image.tmdb.org/t/p/w600_and_h900_bestv2/aej3LRUga5rhgkmRP6XMFw3ejbl.jpg',
      },
      {
        movie_id: uuid(),
        title: 'Arrival',
        year: 2016,
        poster_url:
          'https://image.tmdb.org/t/p/w600_and_h900_bestv2/mSgYBWMybY9Ug4ZnCGsttPIjUx7.jpg',
      },
    ];

    await knex.table('movies').insert(movies);

    const reviews = [
      {
        review_id: uuid(),
        movie_id: movies[0].movie_id,
        author: 'Caryn James',
        rating: 91,
        comment: "It's just grade-A filmmaking.",
      },
      {
        review_id: uuid(),
        movie_id: movies[0].movie_id,
        author: 'Sarah',
        rating: 80,
        comment: 'One of the best movies of 2010.',
      },
      {
        review_id: uuid(),
        movie_id: movies[1].movie_id,
        author: 'Andrew',
        rating: 99,
        comment: "Arrival showcases the best performance you'll see by Amy Adams.",
      },
    ];

    await knex.table('reviews').insert(reviews);
  }
}
