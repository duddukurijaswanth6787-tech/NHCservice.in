import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    console.log('Testing MongoDB connection...');
    console.log('URI Structure:', process.env.MONGODB_URI.split('@')[1]); // Sanitize for logs
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed');
        console.error('Reason:', error.message);
        process.exit(1);
    }
};

testConnection();
