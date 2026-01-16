import bcryptjs from 'bcryptjs';
import { envVars } from '../config/env';
import { IUser, UserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isAdminExist) {
      console.log('Admin Already Exists!');
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: 'Admin',
      role: UserRole.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
    };

    const admin = await User.create(payload);
    console.log('Admin Created Successfully! \n', admin);
  } catch (error) {
    console.log(error);
  }
};
