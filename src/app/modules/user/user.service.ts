import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemeter.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given
  userData.password = password || (config.default_pass as string);

  // set student role
  userData.role = 'student';

  const admissionSemesterId = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set manually id
    userData.id = await generateStudentId(admissionSemesterId);

    // create a user(t-1)
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create User');
    }
    // set _id, id
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;

    // create Student (T-2)
    const newStudent = await Student.create([payLoad], { session });
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const createFacultyIntoDB = async (password: string, payLoad: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);

  userData.role = 'faculty';

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  set manually generated id
    userData.id = await generateFacultyId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create User');
    }
    // set _id, id
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payLoad], { session });
    if (!newFaculty.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create Faculty');
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
