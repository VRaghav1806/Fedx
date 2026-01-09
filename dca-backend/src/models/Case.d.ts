import mongoose, { Document } from 'mongoose';
export interface ICase extends Document {
    accountNumber: string;
    customerName: string;
    amount: number;
    currency: string;
    status: 'pending' | 'assigned' | 'in_progress' | 'collected' | 'closed' | 'escalated';
    assignedDCA?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recoveryProbability?: number;
    slaDeadline: Date;
    notes: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICase, {}, {}, {}, mongoose.Document<unknown, {}, ICase, {}, mongoose.DefaultSchemaOptions> & ICase & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICase>;
export default _default;
//# sourceMappingURL=Case.d.ts.map