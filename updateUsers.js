// updateUsers.js

const mongoose = require('mongoose');
const User = require('./models/userModel'); // adjust the path if needed
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const updateUsers = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE.replace(
        '<db_password>',
        process.env.DATABASE_PASSWORD
      ),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    const result = await User.updateMany(
      {
        $or: [
          { website: { $exists: false } },
          { twitter: { $exists: false } },
          { instagram: { $exists: false } }
        ]
      },
      {
        $set: {
          website: '',
          twitter: '',
          instagram: ''
        }
      }
    );

    console.log('Updated users:', result);
    process.exit();
  } catch (err) {
    console.error('Error updating users:', err);
    process.exit(1);
  }
};

updateUsers();
