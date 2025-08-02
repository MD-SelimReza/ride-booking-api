import z from 'zod';
import { RideStatus } from './ride.interface';

export const createRideZodSchema = z.object({
  pickupLocation: z.object({
    lat: z
      .number()
      .min(-90, { message: 'Pickup latitude must be >= -90' })
      .max(90, { message: 'Pickup latitude must be <= 90' }),
    lng: z
      .number()
      .min(-180, { message: 'Pickup longitude must be >= -180' })
      .max(180, { message: 'Pickup longitude must be <= 180' }),
    address: z.string().optional(),
  }),
  destinationLocation: z.object({
    lat: z
      .number()
      .min(-90, { message: 'Destination latitude must be >= -90' })
      .max(90, { message: 'Destination latitude must be <= 90' }),
    lng: z
      .number()
      .min(-180, { message: 'Destination longitude must be >= -180' })
      .max(180, { message: 'Destination longitude must be <= 180' }),
    address: z.string().optional(),
  }),
  fare: z
    .number({ message: 'Fare must be a number' })
    .min(0, { message: 'Fare must be a positive number' }),
});

export const updateRideStatusByDriverZodSchema = z.object({
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
});

export const updateRideByAdminZodSchema = z.object({
  fare: z
    .number({ message: 'Fare must be a number' })
    .min(0, { message: 'Fare must be a positive number' })
    .optional(),
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  driver: z.string({ message: 'Driver ID must be a string' }).optional(),
  pickupLocation: z
    .object({
      lat: z
        .number({ message: 'Pickup latitude must be a number' })
        .min(-90, { message: 'Pickup latitude must be >= -90' })
        .max(90, { message: 'Pickup latitude must be <= 90' }),
      lng: z
        .number({ message: 'Pickup longitude must be a number' })
        .min(-180, { message: 'Pickup longitude must be >= -180' })
        .max(180, { message: 'Pickup longitude must be <= 180' }),
      address: z.string().optional(),
    })
    .optional(),
  destinationLocation: z
    .object({
      lat: z
        .number({ message: 'Destination latitude must be a number' })
        .min(-90, { message: 'Destination latitude must be >= -90' })
        .max(90, { message: 'Destination latitude must be <= 90' }),
      lng: z
        .number({
          message: 'Destination longitude must be a number',
        })
        .min(-180, { message: 'Destination longitude must be >= -180' })
        .max(180, { message: 'Destination longitude must be <= 180' }),
      address: z.string().optional(),
    })
    .optional(),
  timestampsLog: z
    .object({
      requestedAt: z
        .date({ message: 'requestedAt must be a valid date' })
        .optional(),
      acceptedAt: z
        .date({ message: 'acceptedAt must be a valid date' })
        .optional(),
      pickedUpAt: z
        .date({ message: 'pickedUpAt must be a valid date' })
        .optional(),
      completedAt: z
        .date({ message: 'completedAt must be a valid date' })
        .optional(),
      cancelledAt: z
        .date({ message: 'cancelledAt must be a valid date' })
        .optional(),
    })
    .optional(),
});
