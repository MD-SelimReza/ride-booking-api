import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { Ride } from '../ride/ride.model';
import { DriverStatus, IDriver } from './driver.interface';
import { IUser, UserRole } from '../user/user.interface';
import { Driver } from './driver.model';

const registerDriver = async (payload: Partial<IDriver>, userId: string) => {
  const isExists = await Driver.findOne({ user: userId });
  if (isExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Driver profile already exists');
  }

  const driver = await Driver.create({
    ...payload,
    user: userId,
    driverStatus: 'offline',
    isApproved: false,
    earnings: 0,
  });

  return driver;
};

const getAllDrivers = async () => {
  const drivers = await Driver.find().populate('user');

  // const queryBuilder = new QueryBuilder(User.find(), query);
  //   const usersData = queryBuilder
  //     .filter()
  //     .search(userSearchableFields)
  //     .sort()
  //     .fields()
  //     .paginate();

  //   const [data, meta] = await Promise.all([
  //     usersData.build(),
  //     queryBuilder.getMeta(),
  //   ]);

  return drivers;
};

const toggleAvailability = async (driverId: string, status: DriverStatus) => {
  const driver = await Driver.findOne({ user: driverId }).populate('user');
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Driver not found');
  }

  if (!driver.isApproved || driver.driverStatus === DriverStatus.SUSPENDED)
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Driver not approved or suspended'
    );

  const user = driver.user as unknown as IUser;

  if (user.role !== UserRole.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid driver role');
  }

  driver.driverStatus = status;
  await driver.save();
  return driver;
};

const getEarnings = async (driverId: string) => {
  const rides = await Ride.find({ driver: driverId, status: 'completed' });
  const total = rides.reduce((sum, ride) => sum + (ride.fare ?? 0), 0);
  return { total, rides };
};

const approveDriver = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId }).populate('user');
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Driver not found');
  }

  const user = driver.user as unknown as IUser;

  if (user.role !== UserRole.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid driver role');
  }
  driver.isApproved = true;
  driver.driverStatus = DriverStatus.APPROVED;
  await driver.save();
  return driver;
};

const suspendDriver = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId }).populate('user');
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Driver not found');
  }

  const user = driver.user as unknown as IUser;

  if (user.role !== UserRole.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid driver role');
  }

  driver.driverStatus = DriverStatus.SUSPENDED;
  await driver.save();
  return driver;
};

export const DriverService = {
  registerDriver,
  getAllDrivers,
  toggleAvailability,
  getEarnings,
  approveDriver,
  suspendDriver,
};
