require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/userModel');
const Transaction = require('./src/models/transactionModel');

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Passwords
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    console.log('Creating users...');
    
    // Seed Users
    const users = [
      {
        name: 'Alex Admin',
        email: 'alex.admin@zorvyn.com',
        password: defaultPassword,
        role: 'admin',
        status: 'active'
      },
      {
        name: 'Anna Analyst',
        email: 'anna.analyst@zorvyn.com',
        password: defaultPassword,
        role: 'analyst',
        status: 'active'
      },
      {
        name: 'Victor Viewer',
        email: 'victor.viewer@zorvyn.com',
        password: defaultPassword,
        role: 'viewer',
        status: 'active'
      }
    ];

    const createdUsers = [];
    for (const u of users) {
      // Create user avoiding duplicates
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
        console.log(`Created user: ${user.name} (${user.role})`);
      } else {
        console.log(`User ${user.email} already exists.`);
      }
      createdUsers.push(user);
    }

    console.log('Creating transactions...');

    // Seed Transactions
    const transactions = [];
    for (const user of createdUsers) {
      // Create 3 transactions per user to ensure data is visible for each
      transactions.push(
        {
          amount: Math.floor(Math.random() * 5000) + 1000,
          type: 'income',
          category: 'Salary',
          description: `Monthly Salary for ${user.name}`,
          user: user._id
        },
        {
          amount: Math.floor(Math.random() * 1000) + 100,
          type: 'expense',
          category: 'Food',
          description: `Groceries for ${user.name}`,
          user: user._id
        },
        {
          amount: Math.floor(Math.random() * 500) + 50,
          type: 'expense',
          category: 'Utilities',
          description: `Utility Bill`,
          user: user._id
        }
      );
    }

    await Transaction.insertMany(transactions);
    console.log(`Added ${transactions.length} transactions across seeded users.`);

    mongoose.disconnect();
    console.log('Seeding completed. Disconnected from DB.');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
