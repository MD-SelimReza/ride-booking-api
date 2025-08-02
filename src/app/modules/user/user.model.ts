import { model, Schema } from 'mongoose';
import { IUser, UserRole } from './user.interface';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER,
    },
    phone: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>('User', UserSchema);
