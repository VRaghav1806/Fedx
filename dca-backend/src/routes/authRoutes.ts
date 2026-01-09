import { Router } from 'express';
import { signup, login, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

console.log('👉 Loading Auth Routes Module...');
const router = Router();

router.get('/ping', (req, res) => res.json({ message: 'Auth Router is Working', timestamp: Date.now() }));

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile', authenticate, updateProfile);

export default router;
