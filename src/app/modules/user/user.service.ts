import AppError from '../../errorHelpers/AppError';
import { IUser, UserRole } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from '../../config/env';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { JwtPayload } from 'jsonwebtoken';

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist');
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select('-password');
  return {
    data: user,
  };
};

const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (
    decodedToken.role === UserRole.RIDER ||
    decodedToken.role === UserRole.DRIVER
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, 'You are not authorized');
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (payload.role) {
    if (
      decodedToken.role === UserRole.RIDER ||
      decodedToken.role === UserRole.DRIVER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  getMe,
};
