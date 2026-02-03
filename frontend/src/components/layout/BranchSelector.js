import React, { useEffect, useState } from 'react';
import { useBranch } from '../../context/BranchContext';
import { jwtDecode } from 'jwt-decode';
import { authHelpers } from '../../services/api';

function BranchSelector() {
    const { branches, currentBranch, loading, loadBranches, selectBranch, clearBranchSelection } = useBranch();

    const [user, setUser] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const token = authHelpers.getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'SUPER_ADMIN' && !hasLoaded && branches.length === 0) {
            loadBranches()
                .then(() => setHasLoaded(true))
                .catch(err => console.error('Failed to load branches:', err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, hasLoaded, branches.length]); // ✅ Intentionally excluding loadBranches

    if (user?.role !== 'SUPER_ADMIN') {
        return null;
    }

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        if (branchId === 'all') {
            clearBranchSelection();
        } else {
            const branch = branches.find(b => b.id === parseInt(branchId));
            if (branch) {
                selectBranch(branch);
            }
        }
    };

    return (
        <div style={{
            marginBottom: 12,
            paddingBottom: 12,
            borderBottom: '1px solid #1f2937'
        }}>
            <label
                htmlFor="branch-selector"
                className="text-small"
                style={{ display: 'block', marginBottom: 4 }}
            >
                View Branch
            </label>
            <select
                id="branch-selector"
                value={currentBranch?.id || 'all'}
                onChange={handleBranchChange}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 13,
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: 6,
                    cursor: 'pointer',
                    outline: 'none',
                }}
            >
                <option value="all">🌐 All Branches</option>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                        📍 {branch.name}
                    </option>
                ))}
            </select>
            {currentBranch && (
                <div style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    marginTop: 4
                }}>
                    Viewing: {currentBranch.name}
                </div>
            )}
        </div>
    );
}

export default BranchSelector;
