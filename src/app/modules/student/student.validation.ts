import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First Name is required')
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First letter must be uppercase',
      },
    ),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last Name is required'),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().trim().min(1, 'Father contact is required'),
  motherName: z.string().trim().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().trim().min(1, 'Mother contact is required'),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().trim().min(1, 'Local guardian name is required'),
  occupation: z.string().min(1, 'Local guardian occupation is required'),
  contactNo: z.string().trim().min(1, 'Local guardian contact is required'),
  address: z.string().min(1, 'Local guardian address is required'),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female']),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email format'),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z.string().min(1, 'Emergency contact is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      guardian: createGuardianValidationSchema,
      localGaurdian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
      academicDepartment: z.string(),
    }),
  }),
});
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value || value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First letter must be uppercase',
      },
    ),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().trim().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().trim().optional(),
  motherName: z.string().trim().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().trim().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().trim().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().trim().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
      .object({
        name: updateUserNameValidationSchema,
        gender: z.enum(['male', 'female']).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email('Invalid email format').optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGaurdian: updateLocalGuardianValidationSchema.optional(),
        admissionSemester: z.string().optional(),
        profileImg: z.string().optional(),
        academicDepartment: z.string().optional(),
      })
      .partial(),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
