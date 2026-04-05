const { z } = require('zod');

const schema = z.object({ email: z.string().email() });

try {
  schema.parse({ email: 'invalid' });
} catch (error) {
  console.log('error.name is:', error.name);
  console.log('Is ZodError:', error.name === 'ZodError');
  console.log('error object:', error);
}
