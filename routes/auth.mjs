import { Router } from 'express';
const router = Router();
import User, { findOne } from '../models/User.mjs';

// Signup Route
router.get('/signup', (_req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error signing up');
    }
});

// Login Route
router.get('/login', (_req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid username or password');
        }
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error logging in');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

export default router;
