import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemeter.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

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

  // set manually id
  userData.id = await generateStudentId(admissionSemesterId);

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set _id, id
    payLoad.id = newUser.id;
    payLoad.user = newUser._id;

    const newStudent = await Student.create(payLoad);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};

// We can do it using rollback and transaction

// import mongoose from 'mongoose';
// import config from '../../config';
// import { AcademicSemester } from '../academicSemester/academicSemeter.model';
// import { TStudent } from '../student/student.interface';
// import { Student } from '../student/student.model';
// import { TUser } from './user.interface';
// import { User } from './user.model';
// import { generateStudentId } from './user.utils';
// import AppError from '../../errors/AppError';
// import status from 'http-status';

// const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
//   // create a user object
//   const userData: Partial<TUser> = {};

//   // if password is not given
//   userData.password = password || (config.default_pass as string);

//   // set student role
//   userData.role = 'student';

//   const admissionSemester = await AcademicSemester.findById(
//     payLoad.admissionSemester,
//   );

//   const session = mongoose.startSession();

//   try {
//     (await session).startTransaction();
//     // set manually id
//     userData.id = await generateStudentId(admissionSemester);

//     // create a user
//     const newUser = await User.create([userData], { session });

//     // create a student
//     if (!newUser.length) {
//       throw new AppError(status.BAD_REQUEST, 'Failed to create user');
//     }
//     // set _id, id
//     payLoad.id = newUser[0].id;
//     payLoad.user = newUser[0]._id;

//     const newStudent = await Student.create([payLoad], { session });

//     if (!newStudent.length) {
//       throw new AppError(status.BAD_REQUEST, 'Failed to create student');
//     }

//     (await session).commitTransaction();
//     (await session).endSession();

//     return newStudent;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (err) {
//     (await session).abortTransaction();
//     (await session).endSession();
//   }
// };
// export const UserServices = {
//   createStudentIntoDB,
// };
