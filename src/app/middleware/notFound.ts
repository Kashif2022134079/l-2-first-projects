/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    // ei jaigai httpStatus nie asha baki
    success: false,
    message: 'Api not found',
    error: '',
  });
};
export default notFound;
