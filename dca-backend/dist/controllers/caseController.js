"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCase = exports.updateCase = exports.getDashboardMetrics = exports.createCase = exports.getCases = void 0;
const Case_1 = __importDefault(require("../models/Case"));
const predictionService_1 = require("../services/predictionService");
const emailService_1 = require("../services/emailService");
const getCases = async (req, res) => {
    try {
        const cases = await Case_1.default.find().sort({ createdAt: -1 });
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error });
    }
};
exports.getCases = getCases;
const createCase = async (req, res) => {
    try {
        const caseData = req.body;
        // Calculate AI prediction before saving
        caseData.recoveryProbability = (0, predictionService_1.predictRecovery)(caseData);
        const newCase = new Case_1.default(caseData);
        const savedCase = await newCase.save();
        // Trigger notification (non-blocking)
        console.log("Triggering new case notification...");
        (0, emailService_1.notifyCaseCreated)(savedCase).catch(err => console.error("Notification alert failure:", err));
        res.status(201).json(savedCase);
    }
    catch (error) {
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
exports.createCase = createCase;
const getDashboardMetrics = async (req, res) => {
    try {
        const totalCases = await Case_1.default.countDocuments();
        const activeCases = await Case_1.default.countDocuments({ status: { $in: ['pending', 'assigned', 'in_progress'] } });
        const escalations = await Case_1.default.countDocuments({ status: 'escalated' });
        // Simple recovery rate calculation based on collected status
        const collectedCases = await Case_1.default.countDocuments({ status: 'collected' });
        const recoveryRate = totalCases > 0 ? (collectedCases / totalCases) * 100 : 0;
        res.json({
            totalCases,
            activeCases,
            escalations,
            recoveryRate: recoveryRate.toFixed(1) + '%'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
const updateCase = async (req, res) => {
    try {
        const caseData = req.body;
        // Recalculate AI prediction on update
        caseData.recoveryProbability = (0, predictionService_1.predictRecovery)(caseData);
        const updatedCase = await Case_1.default.findByIdAndUpdate(req.params.id, caseData, { new: true });
        if (!updatedCase)
            return res.status(404).json({ message: 'Case not found' });
        // Trigger escalation email if status changed to escalated
        if (caseData.status === 'escalated') {
            console.log("Triggering escalation notification...");
            (0, emailService_1.notifyEscalation)(updatedCase).catch(err => console.error("Escalation notification error:", err));
        }
        res.json(updatedCase);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating case', error });
    }
};
exports.updateCase = updateCase;
const deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case_1.default.findByIdAndDelete(req.params.id);
        if (!deletedCase)
            return res.status(404).json({ message: 'Case not found' });
        res.json({ message: 'Case deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting case', error });
    }
};
exports.deleteCase = deleteCase;
