const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character');

const createUserSchema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email'),
  password: passwordSchema,
  address: z.string().max(400, 'Address must be at most 400 characters'),
  role: z.enum(['admin', 'user', 'store_owner']),
});

module.exports = { createUserSchema };
