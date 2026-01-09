import { Router } from 'express';
import { signup, login, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

console.log('👉 Loading Auth Routes Module...');
const router = Router();

router.use((req, res, next) => {
    console.log(`📡 AUTH ROUTE HIT: ${req.method} ${req.originalUrl}`);
    next();
});

router.get('/ping', (req, res) => res.json({ message: 'Auth Router is Working', timestamp: Date.now() }));

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile', authenticate, updateProfile);

export default router;
