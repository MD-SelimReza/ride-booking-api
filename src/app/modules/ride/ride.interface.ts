import { Types } from 'mongoose';

export enum RideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId | null;
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  destinationLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: RideStatus;
  fare: number;
  timestampsLog: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
}
