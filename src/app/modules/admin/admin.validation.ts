import { z } from 'zod';

export const userNameZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is required' })
    .refine((val) => val.charAt(0) === val.charAt(0).toUpperCase(), {
      message: 'First name must start with an uppercase letter',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is required' })
    .optional(),
});

export const createAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: userNameZodSchema,
      gender: z.enum(['male', 'female'], {
        required_error: 'Gender is required',
        invalid_type_error: "Gender must be one of: 'male', 'female'",
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email({ message: 'Invalid email' }),
      contactNo: z.string().min(1, { message: 'Contact number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact is required' }),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
        .optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      profileImg: z.string().url().optional(),
      academicDepartment: z
        .string()
        .min(1, { message: 'Academic Department is required' }),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z
      .object({
        name: userNameZodSchema,
        gender: z.enum(['male', 'female'], {
          required_error: 'Gender is required',
          invalid_type_error: "Gender must be one of: 'male', 'female'",
        }),
        dateOfBirth: z.string().optional(),
        email: z.string().email({ message: 'Invalid email' }),
        contactNo: z.string().min(1, { message: 'Contact number is required' }),
        emergencyContactNo: z
          .string()
          .min(1, { message: 'Emergency contact is required' }),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
          .optional(),
        presentAddress: z
          .string()
          .min(1, { message: 'Present address is required' }),
        permanentAddress: z
          .string()
          .min(1, { message: 'Permanent address is required' }),
        profileImg: z.string().url().optional(),
        academicDepartment: z
          .string()
          .min(1, { message: 'Academic Department is required' }),
        isDeleted: z.boolean().optional(),
      })
      .partial(), // All fields inside faculty are now optional
  }),
});

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
