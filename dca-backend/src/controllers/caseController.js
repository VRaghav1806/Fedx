"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCase = exports.updateCase = exports.createCase = exports.getCases = void 0;
const express_1 = require("express");
const Case_1 = __importDefault(require("../models/Case"));
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
        const newCase = new Case_1.default(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating case', error });
    }
};
exports.createCase = createCase;
const updateCase = async (req, res) => {
    try {
        const updatedCase = await Case_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCase)
            return res.status(404).json({ message: 'Case not found' });
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
//# sourceMappingURL=caseController.js.map