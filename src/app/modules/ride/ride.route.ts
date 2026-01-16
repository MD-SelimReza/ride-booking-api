import { Router } from 'express';
import { RideController } from './ride.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { createRideZodSchema } from './ride.validation';

const router = Router();

// Rider
router.post(
  '/request',
  checkAuth(UserRole.RIDER),
  validateRequest(createRideZodSchema),
  RideController.requestRide
);
router.get('/all-rides', checkAuth(UserRole.ADMIN), RideController.getAllRides);
router.patch(
  '/cancel/:id',
  checkAuth(UserRole.RIDER),
  RideController.cancelRide
);
router.get(
  '/me',
  checkAuth(UserRole.RIDER, UserRole.DRIVER),
  RideController.getMyRides
);
router.get(
  '/:id',
  checkAuth(UserRole.RIDER, UserRole.DRIVER),
  RideController.getSingleRide
);

// Driver
router.patch(
  '/accept/:id',
  checkAuth(UserRole.DRIVER),
  RideController.acceptRide
);
router.patch(
  '/:id/status',
  checkAuth(UserRole.DRIVER),
  RideController.updateStatus
);

export const RideRoutes = router;
