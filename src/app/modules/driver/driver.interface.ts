import { Schema } from 'mongoose';

export enum VehicleType {
  CAR = 'car',
  BIKE = 'bike',
  SCOOTER = 'scooter',
  AUTO = 'auto',
}

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SUSPENDED = 'suspended',
  APPROVED = 'approved',
  PENDING = 'pending',
}

export interface IDriver {
  user: Schema.Types.ObjectId;
  driverStatus: DriverStatus;
  isApproved: boolean;
  earnings: number;
  vehicle: {
    type: VehicleType;
    model: string;
    plateNumber: string;
  };
}
