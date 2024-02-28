const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();


const errorHandler = (req, res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
};

router.post('/Signup', async (req, res) => {
    try {
        const { name, email, password} = req.body;

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const user = new User({ name, email, password: hashedPassword});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        errorHandler(req, res, error);
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ userId: user._id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: '48hr', 
        });

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        errorHandler(req, res, error);
    }
});

router.get('/username', authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ name: user.name });
    } catch (error) {
        errorHandler(req, res, error);
    }
});

router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const { name, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.name = name;
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Name and password updated successfully' });
    } catch (error) {
        errorHandler(req, res, error);
    }
});


module.exports = router;
