require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../config/db');
const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/password');

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Administrator';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
  }

  await connectDB();

  const existingUser = await userRepository.findByEmail(email.toLowerCase());

  if (existingUser) {
    console.log(`Admin already exists: ${existingUser.email}`);
    await mongoose.disconnect();
    return;
  }

  const admin = await userRepository.create({
    name,
    email: email.toLowerCase(),
    password: await hashPassword(password),
    role: 'admin',
  });

  console.log(`Admin created: ${admin.email}`);
  await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
  console.error(`Failed to seed admin: ${error.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
