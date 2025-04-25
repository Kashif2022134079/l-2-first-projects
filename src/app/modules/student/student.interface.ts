import { Model, Types } from 'mongoose';
import { TBloodGroup } from '../../interface/user';
import { TUserName } from '../../interface/userName.schema';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGaurdian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  gender: 'male' | 'female';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGaurdian: TLocalGaurdian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  isDeleted?: boolean;
  academicDepartment: Types.ObjectId;
};

export type StudentMethods = {
  isUserExists(id: string): Promise<TStudent | null>;
};
export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
