import { IRide, RideStatus } from './ride.interface';
import { Ride } from './ride.model';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import { UserRole } from '../user/user.interface';

const requestRide = async (riderId: string, payload: Partial<IRide>) => {
  const ride = await Ride.create({ ...payload, rider: riderId });
  return ride;
};

const getAllRides = async () => {
  const rides = await Ride.find().populate('rider').populate('driver');
  return rides;
};

const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride || ride.rider.toString() !== riderId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found or unauthorized');
  }
  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Ride cannot be cancelled at this stage'
    );
  }
  ride.status = RideStatus.CANCELLED;
  ride.timestampsLog.cancelledAt = new Date();
  await ride.save();
  return ride;
};

const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride || ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Ride is not available for acceptance'
    );
  }
  ride.status = RideStatus.ACCEPTED;
  ride.driver = new Types.ObjectId(driverId);
  ride.timestampsLog.acceptedAt = new Date();
  await ride.save();
  return ride;
};

const allowedTransitions: Partial<Record<RideStatus, RideStatus[]>> = {
  [RideStatus.REQUESTED]: [
    RideStatus.ACCEPTED,
    RideStatus.CANCELLED,
    RideStatus.REJECTED,
  ],
  [RideStatus.ACCEPTED]: [RideStatus.PICKED_UP, RideStatus.CANCELLED],
  [RideStatus.PICKED_UP]: [RideStatus.IN_TRANSIT],
  [RideStatus.IN_TRANSIT]: [RideStatus.COMPLETED],
};

const updateRideStatus = async (
  rideId: string,
  driverId: string,
  status: RideStatus
) => {
  const ride = await Ride.findById(rideId);
  if (!ride || ride.driver?.toString() !== driverId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found or unauthorized');
  }

  const currentStatus = ride.status;
  const allowedNextStatuses = allowedTransitions[currentStatus];

  if (!allowedNextStatuses?.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from "${currentStatus}" to "${status}"`
    );
  }

  ride.status = status;

  switch (status) {
    case RideStatus.ACCEPTED:
      ride.timestampsLog.acceptedAt = new Date();
      break;
    case RideStatus.PICKED_UP:
      ride.timestampsLog.pickedUpAt = new Date();
      break;
    case RideStatus.COMPLETED:
      ride.timestampsLog.completedAt = new Date();
      break;
    case RideStatus.CANCELLED:
      ride.timestampsLog.cancelledAt = new Date();
      break;
  }

  await ride.save();
  return ride;
};

const getMyRides = async (userId: string, role: string) => {
  const filter =
    role === UserRole.DRIVER ? { driver: userId } : { rider: userId };
  const rides = await Ride.find(filter).sort({ createdAt: -1 });
  return rides;
};

const getSingleRide = async (rideId: string, userId: string, role: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
  }

  const isRider = role === UserRole.RIDER && ride.rider.toString() === userId;
  const isDriver =
    role === UserRole.DRIVER && ride.driver?.toString() === userId;

  if (!isRider && !isDriver) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return ride;
};

export const RideService = {
  requestRide,
  getAllRides,
  cancelRide,
  acceptRide,
  updateRideStatus,
  getMyRides,
  getSingleRide,
};
