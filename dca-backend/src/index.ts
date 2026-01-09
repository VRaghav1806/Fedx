import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import mongoose from 'mongoose';

import { testConnection } from './services/emailService';

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dca_management';

const startServer = async () => {
    try {
        console.log('--- 🛡️ ENVIRONMENT DIAGNOSTICS ---');
        console.log('PORT:', process.env.PORT || 'Not Set (using 5000)');
        console.log('MONGO_URL Detected:', process.env.MONGO_URL ? '✅ Yes' : '❌ No');

        const maskedUrl = MONGO_URL.replace(/:([^:@]{1,})@/, ':****@');
        console.log(`📡 Connection String: ${maskedUrl}`);

        await mongoose.connect(MONGO_URL);
        console.log('✅ Connected to MongoDB');

        // Run SMTP Check
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

startServer();
