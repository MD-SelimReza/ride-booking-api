import { model, Schema } from 'mongoose';
import { DriverStatus, IDriver, VehicleType } from './driver.interface';

const DriverSchema = new Schema<IDriver>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    driverStatus: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.OFFLINE,
    },
    earnings: { type: Number, default: 0 },
    vehicle: {
      type: {
        type: String,
        enum: Object.values(VehicleType),
        default: VehicleType.BIKE,
      },
      model: { type: String, required: true },
      plateNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Driver = model<IDriver>('Driver', DriverSchema);
