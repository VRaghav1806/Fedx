"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const emailService_1 = require("./services/emailService");
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dca_management';
const startServer = async () => {
    try {
        console.log('--- 🛡️ ENVIRONMENT DIAGNOSTICS ---');
        console.log('PORT:', process.env.PORT || 'Not Set (using 5000)');
        console.log('MONGO_URL Detected:', process.env.MONGO_URL ? '✅ Yes' : '❌ No');
        const maskedUrl = MONGO_URL.replace(/:([^:@]{1,})@/, ':****@');
        console.log(`📡 Connection String: ${maskedUrl}`);
        await mongoose_1.default.connect(MONGO_URL);
        console.log('✅ Connected to MongoDB');
        // Run SMTP Check
        await (0, emailService_1.testConnection)();
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};
startServer();
