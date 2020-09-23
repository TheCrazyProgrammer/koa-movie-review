import Router from '@koa/router';
import { findAllMovies, findMovie, insertMovie, updateMovie } from '../database';
import { zodBodyValidator } from '../middlewares/zodBodyValidator';
import { authenticated } from '../middlewares/authenticated';
import * as z from 'zod';
import { allUndefined } from '../utils';

export const moviesRouter = Router();

moviesRouter.get('/', async (ctx) => {
  const movies = await findAllMovies();
  ctx.body = movies;
});

moviesRouter.post(
  '/',
  authenticated,
  zodBodyValidator(
    z.object({
      title: z.string().nonempty(),
      year: z.number().int(),
      poster_url: z.string().optional(),
    })
  ),
  async (ctx) => {
    const { title, year, poster_url = null } = ctx.request.body;
    const movie = await insertMovie(title, year, poster_url);
    ctx.body = movie;
  }
);

moviesRouter.put(
  '/:movie_id',
  authenticated,
  zodBodyValidator(
    z.object({
      title: z.string().nonempty().optional(),
      year: z.number().int().optional(),
      poster_url: z.string().optional(),
    })
  ),
  async (ctx) => {
    const { movie_id } = ctx.params;
    const { title, year, poster_url } = ctx.request.body;
    if (allUndefined(title, year, poster_url)) {
      return ctx.throw(400, 'Empty update');
    }
    const movie = await updateMovie(movie_id, { title, year, poster_url });
    ctx.body = movie;
  }
);

moviesRouter.get('/:movie_id', async (ctx) => {
  const { movie_id } = ctx.params;
  const movie = await findMovie(movie_id);
  if (!movie) {
    return ctx.throw(404, 'Movie not found');
  }
  ctx.body = movie;
});
