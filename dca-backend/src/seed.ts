import mongoose from 'mongoose';
import Case from './models/Case';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dca_management';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        await Case.deleteMany({});

        const cases = [
            {
                accountNumber: 'ACC-8812',
                customerName: 'Global Logistics Corp',
                amount: 45000,
                status: 'assigned',
                priority: 'high',
                slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                recoveryProbability: 0.75
            },
            {
                accountNumber: 'ACC-1102',
                customerName: 'Tech Solutions Ltd',
                amount: 12000,
                status: 'pending',
                priority: 'medium',
                slaDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                recoveryProbability: 0.62
            },
            {
                accountNumber: 'ACC-4491',
                customerName: 'Retail Giant Inc',
                amount: 85000,
                status: 'escalated',
                priority: 'critical',
                slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                recoveryProbability: 0.35
            }
        ];

        await Case.insertMany(cases);
        console.log('Seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed', error);
        process.exit(1);
    }
};

seedData();
