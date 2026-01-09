import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
    accountNumber: string;
    customerName: string;
    amount: number;
    currency: string;
    status: 'pending' | 'assigned' | 'in_progress' | 'collected' | 'closed' | 'escalated';
    assignedDCA?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recoveryProbability?: number; // AI predicted 0-1
    slaDeadline: Date;
    notes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema: Schema = new Schema({
    accountNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'collected', 'closed', 'escalated'],
        default: 'pending'
    },
    assignedDCA: { type: String },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    recoveryProbability: { type: Number, default: 0.5 },
    slaDeadline: { type: Date, required: true },
    notes: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<ICase>('Case', CaseSchema);
