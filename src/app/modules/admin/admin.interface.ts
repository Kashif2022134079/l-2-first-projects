import { Types } from 'mongoose';
import { TBloodGroup, TGender } from '../../interface/user';
import { TUserName } from '../../interface/userName.schema';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  // academicDepartment: Types.ObjectId;
  isDeleted?: boolean;
};
