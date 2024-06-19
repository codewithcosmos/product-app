const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = 'your_jwt_secret';

exports.authAdmin = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'User is not an admin' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
// kasiwebsites/authMiddleware.js

const requireAdmin = (req, res, next) => {
    // Check if user is logged in and is an admin (role-based check)
    if (req.session && req.session.admin) {
      next(); // Allow access to the next middleware or route handler
    } else {
      res.redirect('/admin/login'); // Redirect to admin login page if not authenticated
    }
  };
  
  module.exports = { requireAdmin };
  