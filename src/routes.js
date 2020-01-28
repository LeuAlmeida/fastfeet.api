import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/login', SessionController.store);

routes.use(authMiddleware);

export default routes;
