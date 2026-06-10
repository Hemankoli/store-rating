const { z } = require('zod');

const submitRatingSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  value: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

const updateRatingSchema = z.object({
  value: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

module.exports = { submitRatingSchema, updateRatingSchema };
