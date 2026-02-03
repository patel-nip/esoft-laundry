const branchModel = require('../models/branchModel');

const branchController = {
    // Get all branches (Super Admin only)
    getAllBranches: async (req, res) => {
        try {
            const branches = await branchModel.getAll();

            // Get statistics for each branch
            const branchesWithStats = await Promise.all(
                branches.map(async (branch) => {
                    const stats = await branchModel.getStats(branch.id);
                    return { ...branch, stats };
                })
            );

            res.json(branchesWithStats);
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).json({ error: 'Failed to fetch branches' });
        }
    },

    // Get single branch by ID
    getBranchById: async (req, res) => {
        try {
            const { id } = req.params;
            const branch = await branchModel.getById(id);

            if (!branch) {
                return res.status(404).json({ error: 'Branch not found' });
            }

            // Get branch statistics
            const stats = await branchModel.getStats(id);

            res.json({ ...branch, stats });
        } catch (error) {
            console.error('Error fetching branch:', error);
            res.status(500).json({ error: 'Failed to fetch branch' });
        }
    },

    // Create new branch (Super Admin only)
    createBranch: async (req, res) => {
        try {
            const { name, branch_code, location, contact_phone, contact_email, status } = req.body;

            // Validation
            if (!name || !branch_code || !location) {
                return res.status(400).json({
                    error: 'Name, branch code, and location are required'
                });
            }

            // Check if branch code already exists
            const existingBranch = await branchModel.getByCode(branch_code);
            if (existingBranch) {
                return res.status(400).json({
                    error: 'Branch code already exists'
                });
            }

            const branchData = {
                name,
                branch_code,
                location,
                contact_phone,
                contact_email,
                status: status || 'active'
            };

            const newBranch = await branchModel.create(branchData);

            res.status(201).json({
                message: 'Branch created successfully',
                branch: newBranch
            });
        } catch (error) {
            console.error('Error creating branch:', error);
            res.status(500).json({ error: 'Failed to create branch' });
        }
    },

    // Update branch (Super Admin only)
    updateBranch: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, location, contact_phone, contact_email, status } = req.body;

            // Check if branch exists
            const existingBranch = await branchModel.getById(id);
            if (!existingBranch) {
                return res.status(404).json({ error: 'Branch not found' });
            }

            // Validation
            if (!name || !location) {
                return res.status(400).json({
                    error: 'Name and location are required'
                });
            }

            const branchData = {
                name,
                location,
                contact_phone,
                contact_email,
                status: status || 'active'
            };

            await branchModel.update(id, branchData);

            res.json({
                message: 'Branch updated successfully',
                branch: { id, ...branchData }
            });
        } catch (error) {
            console.error('Error updating branch:', error);
            res.status(500).json({ error: 'Failed to update branch' });
        }
    },

    // Delete branch (Super Admin only) - Soft delete
    deleteBranch: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if branch exists
            const existingBranch = await branchModel.getById(id);
            if (!existingBranch) {
                return res.status(404).json({ error: 'Branch not found' });
            }

            // Check if branch has active users or orders
            const stats = await branchModel.getStats(id);
            if (stats.pending_orders > 0) {
                return res.status(400).json({
                    error: 'Cannot delete branch with pending orders'
                });
            }

            await branchModel.delete(id);

            res.json({
                message: 'Branch deactivated successfully'
            });
        } catch (error) {
            console.error('Error deleting branch:', error);
            res.status(500).json({ error: 'Failed to delete branch' });
        }
    },

    // Get branch statistics
    getBranchStats: async (req, res) => {
        try {
            const { id } = req.params;

            const branch = await branchModel.getById(id);
            if (!branch) {
                return res.status(404).json({ error: 'Branch not found' });
            }

            const stats = await branchModel.getStats(id);

            res.json(stats);
        } catch (error) {
            console.error('Error fetching branch stats:', error);
            res.status(500).json({ error: 'Failed to fetch branch statistics' });
        }
    }
};

module.exports = branchController;
