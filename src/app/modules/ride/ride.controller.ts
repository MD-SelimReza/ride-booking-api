/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { RideStatus } from './ride.interface';
import { RideService } from './ride.service';

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user?.userId;
    const ride = await RideService.requestRide(riderId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Ride requested successfully',
      data: ride,
    });
  }
);

const getAllRides = async (req: Request, res: Response) => {
  const result = await RideService.getAllRides();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rides retrieved successfully',
    data: result,
  });
};

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user?.userId;
    const ride = await RideService.cancelRide(req.params.id, riderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride cancelled successfully',
      data: ride,
    });
  }
);

const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user?.userId;
    const ride = await RideService.acceptRide(req.params.id, driverId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride accepted successfully',
      data: ride,
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user?.userId;
    const status = req.body.status as RideStatus;
    const ride = await RideService.updateRideStatus(
      req.params.id,
      driverId,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride status updated',
      data: ride,
    });
  }
);

const getMyRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const rides = await RideService.getMyRides(userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Rides fetched successfully',
      data: rides,
    });
  }
);

const getSingleRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const userId = req.user?.userId;
    const role = req.user?.role;

    const ride = await RideService.getSingleRide(rideId, userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride fetched successfully',
      data: ride,
    });
  }
);

export const RideController = {
  requestRide,
  getAllRides,
  cancelRide,
  acceptRide,
  updateStatus,
  getMyRides,
  getSingleRide,
};
