import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // if the token is sent from the client
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }
    // chcek is the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

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
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
