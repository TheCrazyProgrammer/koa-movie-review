import Koa from 'koa';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import errorHandler from 'koa-error';
import { setupDatabase } from './database/setup';
import { router } from './routes';
import helmet from 'koa-helmet';

export async function main() {
  // setup database before starting the app !
  await setupDatabase();

  // console.log(await updateMovie('0ebb6325-bda9-4ca2-96aa-fce8805f2e04', { year: 2011 }));
  const app = new Koa();

  app.use(cors());
  app.use(errorHandler({ accepts: ['json'] }));
  app.use(helmet());
  app.use(bodyparser({ enableTypes: ['json'] }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3001, () => {
    console.log(`Server is up on http://localhost:3001`);
  });

  return app;
}
