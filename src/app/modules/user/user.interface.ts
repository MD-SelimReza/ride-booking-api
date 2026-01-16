import { Schema, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isBlocked?: boolean;
  isVerified?: boolean;
  role?: UserRole;
  driver?: Schema.Types.ObjectId;
}
