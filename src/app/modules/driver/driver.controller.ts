import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { DriverService } from './driver.service';

const registerDriver = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;

  const result = await DriverService.registerDriver(payload, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Driver profile created successfully',
    data: result,
  });
});

const getAllDrivers = async (req: Request, res: Response) => {
  const result = await DriverService.getAllDrivers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drivers retrieved successfully',
    data: result,
  });
};

const toggleAvailability = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user?.userId;
  const { status } = req.body;

  const result = await DriverService.toggleAvailability(driverId, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Driver status updated to ${status}`,
    data: result,
  });
});

const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user?.userId;
  const result = await DriverService.getEarnings(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Earnings retrieved successfully',
    data: result,
  });
});

const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const result = await DriverService.approveDriver(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Driver approved successfully',
    data: result,
  });
});

const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const result = await DriverService.suspendDriver(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Driver suspended successfully',
    data: result,
  });
});

export const DriverController = {
  registerDriver,
  getAllDrivers,
  toggleAvailability,
  getEarnings,
  approveDriver,
  suspendDriver,
};
