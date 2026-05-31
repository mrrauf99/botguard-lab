import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/database.js';
import { generatePakistaniUsers } from '../utils/pakistaniUsers.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.warn('Cleared existing users');

    // Create admin user
    const adminUser = new User({
      name: 'Administrator',
      email: 'admin@botguard.local',
      password: 'Admin@123',
      role: 'admin',
    });
    await adminUser.save();
    console.warn('✓ Admin user created: admin@botguard.local');

    // Generate and create 50 Pakistani users
    const pakistaniUsers = generatePakistaniUsers(50);
    await User.insertMany(pakistaniUsers);
    console.warn('✓ Created 50 Pakistani users');

    console.warn('\nSeeding complete!');
    console.warn('Admin: admin@botguard.local / Admin@123');
    console.warn('Sample user: ahmed_1@botguard.pk / Password123');

    await disconnectDB();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
