import { Router } from 'express';
import { getCases, createCase, getDashboardMetrics, updateCase, deleteCase } from '../controllers/caseController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all case routes
router.use(authenticate);

router.get('/', getCases);
router.post('/', createCase);
router.get('/metrics', getDashboardMetrics);
router.patch('/:id', updateCase);
router.delete('/:id', deleteCase);

export default router;
