/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemeter.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { Admin } from '../admin/admin.model';
import { sendImageToClaudinary } from '../../utils/sendImageToClaudonary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payLoad: TStudent,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given
  userData.password = password || (config.default_pass as string);

  // set student role
  userData.role = 'student';
  userData.email = payLoad.email;

  const admissionSemesterId = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set manually id
    userData.id = await generateStudentId(admissionSemesterId);

    const imageName = `${userData.id}${payLoad?.name?.firstName}`;
    const path = file?.path;
    // send image to claudinary
    const { secure_url } = await sendImageToClaudinary(imageName, path);

    // create a user(t-1)
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create User');
    }
    // set _id, id
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;
    payLoad.profileImg = secure_url;

    // create Student (T-2)
    const newStudent = await Student.create([payLoad], { session });
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payLoad: TFaculty,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);

  userData.role = 'faculty';
  userData.email = payLoad.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  set manually generated id
    userData.id = await generateFacultyId();
    const imageName = `${userData.id}${payLoad?.name?.firstName}`;
    const path = file?.path;
    // send image to claudinary
    const { secure_url } = await sendImageToClaudinary(imageName, path);

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create User');
    }
    // set _id, id
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;
    payLoad.profileImg = secure_url;

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
const createAdminIntoDB = async (password: string, payLoad: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);

  userData.role = 'admin';
  userData.email = payLoad.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  set manually generated id
    userData.id = await generateAdminId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create User');
    }
    // set _id, id
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;

    const newAdmin = await Admin.create([payLoad], { session });
    if (!newAdmin.length) {
      throw new AppError(status.BAD_REQUEST, 'Fail to create Faculty');
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;

  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  return result;
};

const changeStatus = async (id: string, payLoad: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payLoad, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
