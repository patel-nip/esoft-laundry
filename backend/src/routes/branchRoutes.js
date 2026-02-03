const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Middleware to check if user is Super Admin
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Access denied. Super Admin only.' });
    }
    next();
};

// All routes require authentication
router.use(authenticateToken);

// Get all branches (Super Admin only)
router.get('/', isSuperAdmin, branchController.getAllBranches);

// Get single branch by ID
router.get('/:id', branchController.getBranchById);

// Get branch statistics
router.get('/:id/stats', branchController.getBranchStats);

// Create new branch (Super Admin only)
router.post('/', isSuperAdmin, branchController.createBranch);

// Update branch (Super Admin only)
router.put('/:id', isSuperAdmin, branchController.updateBranch);

// Delete branch (Super Admin only)
router.delete('/:id', isSuperAdmin, branchController.deleteBranch);

module.exports = router;
