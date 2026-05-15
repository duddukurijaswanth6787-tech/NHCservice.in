import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if users already exist
        const existingAdmin = await User.findOne({ username: 'nany' });
        if (existingAdmin) {
            console.log('⚠️ Users already seeded. Skipping...');
            await mongoose.disconnect();
            return;
        }

        // Create admin user
        const admin = new User({
            username: 'nany',
            password: '123',  // Will be hashed by pre-save hook
            role: 'admin',
            displayName: 'Nany (Admin)'
        });
        await admin.save();
        console.log('✅ Admin user created: nany');

        // Create delivery user
        const delivery = new User({
            username: 'ram@123',
            password: '123',  // Will be hashed by pre-save hook
            role: 'delivery',
            displayName: 'Ram'
        });
        await delivery.save();
        console.log('✅ Delivery user created: ram@123');

        console.log('\n🎉 Users seeded successfully!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedUsers();
