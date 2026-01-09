"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Case_1 = __importDefault(require("./models/Case"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dca_management';
const seedData = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');
        await Case_1.default.deleteMany({});
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
        await Case_1.default.insertMany(cases);
        console.log('Seeded successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed', error);
        process.exit(1);
    }
};
seedData();
