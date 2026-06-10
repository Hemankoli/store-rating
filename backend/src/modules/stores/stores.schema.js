const { z } = require('zod');

const createStoreSchema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().max(400, 'Address must be at most 400 characters'),
  ownerId: z.string().uuid().optional(),
});

module.exports = { createStoreSchema };
