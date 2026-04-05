const { z } = require('zod');

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be either 'income' or 'expense'" })
  }),
  category: z.string().min(1, 'Category is required'),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});

const updateTransactionSchema = createTransactionSchema.partial();

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
};
