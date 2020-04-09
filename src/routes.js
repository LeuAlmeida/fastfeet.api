import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

// Route to a deliveryman search for available and ended deliveries to him
routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.index);

// Route to list deliverymen and each deliveryman
routes.get('/deliveryman', DeliverymanController.index);

// Route to a deliveryman register a delivery as finished or started
routes.put(
  '/deliveryman/:id/deliveries',
  upload.single('file'),
  DeliveryStatusController.update
);

// Route to a deliveryman register a problem
routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);

// Authentication middleware
routes.use(authMiddleware);

// Upload file route
routes.post('/files', upload.single('file'), FileController.store);

// Admin user routes
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

// Recipients routes
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Deliveryman routes
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// Delivery routes
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

// Delivery problems routes
routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.put('/delivery/problems/:id', DeliveryProblemController.update);
routes.delete('/delivery/problems/:id', DeliveryProblemController.delete);

// Cancel delivery based in a problem
routes.post('/problems/:id/cancel-delivery', DeliveryStatusController.store);

export default routes;
