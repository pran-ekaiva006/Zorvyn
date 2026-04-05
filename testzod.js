const { z } = require('zod');
const schema = z.object({ name: z.string() });
try {
  schema.parse({});
} catch (error) {
  console.log('Error issues:', error.issues);
}
