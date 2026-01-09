"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseController_1 = require("../controllers/caseController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all case routes
router.use(auth_1.authenticate);
router.get('/', caseController_1.getCases);
router.post('/', caseController_1.createCase);
router.get('/metrics', caseController_1.getDashboardMetrics);
router.patch('/:id', caseController_1.updateCase);
router.delete('/:id', caseController_1.deleteCase);
exports.default = router;
