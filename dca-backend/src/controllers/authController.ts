import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'admin'
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, userId: newUser._id, name: newUser.name, role: newUser.role });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ token, userId: user._id, name: user.name, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const userId = req.user?.userId;

        console.log('👤 Profile Update Request:', { userId, name, email, role });

        if (!userId) {
            console.error('❌ Update failed: No userId in request');
            return res.status(401).json({ message: 'User identity not found in token' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`❌ Update failed: User not found for ID ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        await user.save();
        console.log('✅ Profile updated successfully for:', user.email);

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('❌ Profile Update Global Error:', error);
        res.status(500).json({
            message: 'Error updating profile',
            error: error.message,
            code: error.code // Capture MongoDB unique constraint errors
        });
    }
};
