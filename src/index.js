
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();


console.log("ENV CHECK:", process.env.MONGODB_URI);


connectDB();

// 4. MIDDLEWARE
app.use(express.json());

// 5. TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});