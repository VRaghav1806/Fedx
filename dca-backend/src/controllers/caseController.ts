import { Request, Response } from 'express';
import Case from '../models/Case';
import { predictRecovery } from '../services/predictionService';
import { notifyCaseCreated, notifyEscalation } from '../services/emailService';

export const getCases = async (req: Request, res: Response) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error });
    }
};

export const createCase = async (req: Request, res: Response) => {
    try {
        const caseData = req.body;
        // Calculate AI prediction before saving
        caseData.recoveryProbability = predictRecovery(caseData as any);

        const newCase = new Case(caseData);
        const savedCase = await newCase.save();

        // Trigger notification (non-blocking)
        console.log("Triggering new case notification...");
        notifyCaseCreated(savedCase).catch(err => console.error("Notification alert failure:", err));

        res.status(201).json(savedCase);
    } catch (error: any) {
        // Detect MongoDB duplicate key error (code 11000)
        const isDuplicate = error.code === 11000 ||
            (error.name === 'MongoServerError' && error.code === 11000) ||
            (error.message && error.message.includes('E11000'));

        if (isDuplicate) {
            return res.status(409).json({
                message: 'Account number already exists. Please use a unique number.',
                error: 'DuplicateKey'
            });
        }
        res.status(400).json({ message: 'Error creating case', error: error });
    }
};

export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const totalCases = await Case.countDocuments();
        const activeCases = await Case.countDocuments({ status: { $in: ['pending', 'assigned', 'in_progress'] } });
        const escalations = await Case.countDocuments({ status: 'escalated' });

        // Simple recovery rate calculation based on collected status
        const collectedCases = await Case.countDocuments({ status: 'collected' });
        const recoveryRate = totalCases > 0 ? (collectedCases / totalCases) * 100 : 0;

        res.json({
            totalCases,
            activeCases,
            escalations,
            recoveryRate: recoveryRate.toFixed(1) + '%'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error });
    }
};

export const updateCase = async (req: Request, res: Response) => {
    try {
        const caseData = req.body;
        // Recalculate AI prediction on update
        caseData.recoveryProbability = predictRecovery(caseData as any);

        const updatedCase = await Case.findByIdAndUpdate(req.params.id, caseData, { new: true });
        if (!updatedCase) return res.status(404).json({ message: 'Case not found' });

        // Trigger escalation email if status changed to escalated
        if (caseData.status === 'escalated') {
            console.log("Triggering escalation notification...");
            notifyEscalation(updatedCase).catch(err => console.error("Escalation notification error:", err));
        }

        res.json(updatedCase);
    } catch (error) {
        res.status(400).json({ message: 'Error updating case', error });
    }
};

export const deleteCase = async (req: Request, res: Response) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if (!deletedCase) return res.status(404).json({ message: 'Case not found' });
        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting case', error });
    }
};
