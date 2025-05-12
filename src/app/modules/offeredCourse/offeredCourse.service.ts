import status from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { Course } from '../Course/course.model';
import { timeHasConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    faculty,
    section,
    course,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(status.NOT_FOUND, 'Semester Registration is not found');
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;
  const isAcademicFacultyexists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyexists) {
    throw new AppError(status.NOT_FOUND, 'Academic Faculty is not found');
  }
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(status.NOT_FOUND, 'Academic Department is not found');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found');
  }
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Course is not found');
  }

  // check if department belong to Faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      status.BAD_REQUEST,
      ` This ${isAcademicDepartmentExists.name} id not belong to this ${isAcademicFacultyexists.name}`,
    );
  }

  // chcek if the same offered course is registred for same section

  const sameOfferedSemesterWithSameSection = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (sameOfferedSemesterWithSameSection) {
    throw new AppError(
      status.BAD_REQUEST,
      `Offered Course with same section is alredy exists`,
    );
  }

  // get the schedule for faculty
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (timeHasConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      'The Faculty not available at that time',
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCourseFromDB = async () => {
  const result = await OfferedCourse.find();
  return result;
};
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Offered Course is not found');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  // get the schedule for faculty

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      status.BAD_REQUEST,
      'You cannot update this offered course',
    );
  }
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (timeHasConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      'The Faculty not available at that time',
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
