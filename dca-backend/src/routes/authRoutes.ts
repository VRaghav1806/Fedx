import { Router } from 'express';
import { signup, login, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile', authenticate, updateProfile);

export default router;
