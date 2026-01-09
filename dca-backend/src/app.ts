import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import caseRoutes from './routes/caseRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middleware (Development & Simplified Hosting)
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('DCA Management API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

export default app;
