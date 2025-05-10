import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { SemesterResgistrationService } from './semesterRegistration.service';

const semesterRegistration = catchAsync(async (req: Request, res: Response) => {
  const result =
    await SemesterResgistrationService.createSemesterResgistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semister Registred successfully',
    data: result,
  });
});
const getAllSemesterRegistrationCourses = catchAsync(async (req, res) => {
  const result =
    await SemesterResgistrationService.getAllSemesterRegistrationCourseFromDB(
      req.query,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester Registration retrived successfully',
    data: result,
  });
});

const getSingleSemesterRegistrationCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterResgistrationService.getSingleSemesterRegistrationCourseFromDB(
      id,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester Registration retrived successfully',
    data: result,
  });
});
const updateSemesterRegistrationCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterResgistrationService.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester Registration uupdated successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
  semesterRegistration,
  getAllSemesterRegistrationCourses,
  getSingleSemesterRegistrationCourses,
  updateSemesterRegistrationCourses,
};
