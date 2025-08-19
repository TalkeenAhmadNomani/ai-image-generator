import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;

    if (!url) {
      throw new Error('❌ MONGO_URI is not defined in .env');
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit the app on failure
  }
};

export default connectDB;
