import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Semester is retrived successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Semester is retrived successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyFromDB(facultyId, faculty);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is updated successfully',
    data: result,
  });
});

export const FacultyController = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
};
