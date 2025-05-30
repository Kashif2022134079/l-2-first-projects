import { Schema } from 'mongoose';
import { TFaculty } from './faculty.interface';
import { userNameSchema } from '../../interface/userName.schema';
import { model } from 'mongoose';

const facultySchema = new Schema<TFaculty>({
  id: { type: String, required: true, unique: true },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is nedded'],
    unique: true,
    ref: 'User',
  },
  designation: {
    type: String,
    required: true,
  },
  name: {
    type: userNameSchema,
    required: [true, 'Name is required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: "The gender is must be any of them from: 'male','female'",
    },
    required: [true, 'Gender is required'],
  },
  dateOfBirth: { type: Date },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  contactNo: {
    type: String,
    required: [true, 'contact is required'],
    unique: true,
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact is required'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present adress is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent adress is required'],
  },
  profileImg: { type: String },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  isDeleted: {
    type: Boolean,
    default: 'false',
  },
});

export const Faculty = model<TFaculty>('Faculty', facultySchema);
