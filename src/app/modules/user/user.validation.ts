import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(1, 'Password is required')
    .optional(),
});
export const UserValidation = {
  userValidationSchema,
};
