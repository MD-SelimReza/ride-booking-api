import { Router } from 'express';
import { DriverController } from './driver.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '../user/user.interface';

const router = Router();

// Driver-only
router.post(
  '/register',
  checkAuth(UserRole.DRIVER),
  DriverController.registerDriver
);

router.get(
  '/all-drivers',
  checkAuth(UserRole.ADMIN),
  DriverController.getAllDrivers
);

router.patch(
  '/status',
  checkAuth(UserRole.DRIVER),
  DriverController.toggleAvailability
);

router.get(
  '/earnings',
  checkAuth(UserRole.DRIVER),
  DriverController.getEarnings
);

// Admin-only
router.patch(
  '/approve/:id',
  checkAuth(UserRole.ADMIN),
  DriverController.approveDriver
);
router.patch(
  '/suspend/:id',
  checkAuth(UserRole.ADMIN),
  DriverController.suspendDriver
);

export const DriverRoutes = router;
