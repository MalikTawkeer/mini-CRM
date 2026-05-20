require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      name: 'Admin User',
      email: 'admin@minicrm.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'Sales Agent',
      email: 'agent@minicrm.com',
      password: 'agent123',
      role: 'sales_agent',
    },
  ];

  for (const data of users) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      console.log(`Skipped (exists): ${data.email}`);
      continue;
    }
    await User.create(data);
    console.log(`Created: ${data.email}`);
  }

  console.log('\nSeed complete. Demo credentials:');
  console.log('  Admin:  admin@minicrm.com / admin123');
  console.log('  Agent:  agent@minicrm.com / agent123');
  process.exit(0);
};

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
