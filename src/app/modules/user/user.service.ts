import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
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
