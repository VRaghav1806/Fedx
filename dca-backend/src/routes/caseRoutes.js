"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseController_1 = require("../controllers/caseController");
const router = (0, express_1.Router)();
router.get('/', caseController_1.getCases);
router.post('/', caseController_1.createCase);
router.patch('/:id', caseController_1.updateCase);
router.delete('/:id', caseController_1.deleteCase);
exports.default = router;
//# sourceMappingURL=caseRoutes.js.map