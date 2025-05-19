import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { sendEmail } from '../../utils/sendEmail';
import { verifyToken } from './auth.utils';
// import { createToken } from './auth.utils';

const loginUser = async (payLoad: TLoginUser) => {
  // check if the user exists
  const user = await User.findOne({ id: payLoad?.id }).select('+password');
  // console.log(user);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'User is already deleted');
  }
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  // checking is the passsword is correct
  const isPasswordMatch = await bcrypt.compare(
    payLoad?.password,
    user?.password,
  );
  if (isPasswordMatch === false) {
    throw new AppError(status.FORBIDDEN, 'Password is not matched');
  }

  // create token and sent
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '1d',
  });
  // const accessToken = createToken(
  //   jwtPayload,
  //   config.jwt_access_secret as string,
  //   config.jwt_access_expires_in as string,
  // );
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: '365d',
    },
  );
  // refresh token
  // const refreshToken = createToken(
  //   jwtPayload,
  //   config.jwt_refresh_secret as string,
  //   config.jwt_refresh_expires_in as string,
  // );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  // console.log(userData);
  const user = await User.findOne({ id: userData.userId }).select('+password');
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'User is already deleted');
  }
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  // checking is the passsword is correct
  const isPasswordMatch = await bcrypt.compare(
    payLoad?.oldPassword,
    user?.password,
  );
  // console.log(isPasswordMatch);
  if (isPasswordMatch === false) {
    throw new AppError(status.FORBIDDEN, 'Password is not matched');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // chcek is the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  console.log(decoded);
  const { userId, iat } = decoded;

  // check if the user exists
  const user = await User.findOne({ id: userId }).select('+password');
  // console.log(user);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'User is already deleted');
  }
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  const ifJWTissuedBeforePasswordChange = (
    passwordChangeTimestamps: Date,
    jwtIssuedTimestamps: number,
  ) => {
    const passwordChangeTime =
      new Date(passwordChangeTimestamps).getTime() / 1000;
    return passwordChangeTime > jwtIssuedTimestamps;
  };
  if (
    user?.passwordChangeAt &&
    ifJWTissuedBeforePasswordChange(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '1d',
  });

  return {
    accessToken,
  };
};
const forgetPassword = async (userId: string) => {
  const user = await User.findOne({ id: userId }).select('+password');
  // console.log(user);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'User is already deleted');
  }
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10m',
  });

  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
  sendEmail(user.email, resetUILink);
  console.log(resetUILink);
};

const resetPassword = async (
  payLoad: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.findOne({ id: payLoad?.id }).select('+password');
  // console.log(user);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'User is already deleted');
  }
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (payLoad.id !== decoded.userId) {
    throw new AppError(status.FORBIDDEN, 'You are forbidden');
  }
  // hash new password
  const newHashPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
