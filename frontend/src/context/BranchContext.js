import React, { createContext, useContext, useState, useEffect } from 'react';
import { branchesAPI } from '../services/api';

const BranchContext = createContext();

export function useBranch() {
    const context = useContext(BranchContext);
    if (!context) {
        throw new Error('useBranch must be used within BranchProvider');
    }
    return context;
}

export function BranchProvider({ children }) {
    const [currentBranch, setCurrentBranch] = useState(null);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load branches (Super Admin only)
    const loadBranches = async () => {
        try {
            setLoading(true);
            const data = await branchesAPI.getAll();
            setBranches(data);
        } catch (error) {
            console.error('Failed to load branches:', error);
        } finally {
            setLoading(false);
        }
    };

    // Select a branch
    const selectBranch = (branch) => {
        setCurrentBranch(branch);
        if (branch) {
            localStorage.setItem('selected_branch_id', branch.id);
        } else {
            localStorage.removeItem('selected_branch_id');
        }
    };

    // Clear branch selection (view all)
    const clearBranchSelection = () => {
        setCurrentBranch(null);
        localStorage.removeItem('selected_branch_id');
    };

    // Load saved branch selection on mount
    useEffect(() => {
        const savedBranchId = localStorage.getItem('selected_branch_id');
        if (savedBranchId && branches.length > 0) {
            const branch = branches.find(b => b.id === parseInt(savedBranchId));
            if (branch) {
                setCurrentBranch(branch);
            }
        }
    }, [branches]);

    const value = {
        currentBranch,
        branches,
        loading,
        loadBranches,
        selectBranch,
        clearBranchSelection,
    };

    return (
        <BranchContext.Provider value={value}>
            {children}
        </BranchContext.Provider>
    );
}
