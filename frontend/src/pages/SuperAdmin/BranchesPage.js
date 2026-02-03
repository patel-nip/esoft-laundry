import React, { useState, useEffect } from 'react';
import { branchesAPI } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function BranchesPage() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        branch_code: '',
        location: '',
        contact_phone: '',
        contact_email: '',
        status: 'active'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        try {
            setLoading(true);
            const data = await branchesAPI.getAll();
            setBranches(data);
        } catch (err) {
            setError('Failed to load branches');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingBranch) {
                await branchesAPI.update(editingBranch.id, formData);
                setSuccess('Branch updated successfully!');
            } else {
                await branchesAPI.create(formData);
                setSuccess('Branch created successfully!');
            }

            loadBranches();
            handleCloseModal();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save branch');
        }
    };

    const handleEdit = (branch) => {
        setEditingBranch(branch);
        setFormData({
            name: branch.name,
            branch_code: branch.branch_code,
            location: branch.location,
            contact_phone: branch.contact_phone || '',
            contact_email: branch.contact_email || '',
            status: branch.status
        });
        setShowModal(true);
    };

    const handleDelete = async (branch) => {
        if (!window.confirm(`Are you sure you want to delete "${branch.name}"?`)) {
            return;
        }

        try {
            await branchesAPI.delete(branch.id);
            setSuccess('Branch deleted successfully!');
            loadBranches();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete branch');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBranch(null);
        setFormData({
            name: '',
            branch_code: '',
            location: '',
            contact_phone: '',
            contact_email: '',
            status: 'active'
        });
        setError('');
    };

    const handleOpenCreateModal = () => {
        setEditingBranch(null);
        setFormData({
            name: '',
            branch_code: '',
            location: '',
            contact_phone: '',
            contact_email: '',
            status: 'active'
        });
        setShowModal(true);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />

                <div style={{ padding: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <h1 className="customers-title">Branch Management</h1>
                        <button
                            className="button-primary"
                            onClick={handleOpenCreateModal}
                        >
                            + Add New Branch
                        </button>
                    </div>

                    {success && (
                        <div style={{
                            padding: 12,
                            marginBottom: 16,
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: 6
                        }}>
                            {success}
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: 12,
                            marginBottom: 16,
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderRadius: 6
                        }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>Loading branches...</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: 20
                        }}>
                            {branches.map(branch => (
                                <div
                                    key={branch.id}
                                    style={{
                                        backgroundColor: '#1f2937',
                                        padding: 20,
                                        borderRadius: 12,
                                        border: '1px solid #374151'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: 12
                                    }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: 18 }}>{branch.name}</h3>
                                            <div style={{
                                                fontSize: 12,
                                                color: '#9ca3af',
                                                marginTop: 4
                                            }}>
                                                Code: {branch.branch_code}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 8px',
                                            fontSize: 11,
                                            borderRadius: 4,
                                            backgroundColor: branch.status === 'active' ? '#10b981' : '#6b7280',
                                            color: 'white'
                                        }}>
                                            {branch.status}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: 12, fontSize: 14 }}>
                                        <div style={{ marginBottom: 6 }}>
                                            <strong>📍 Location:</strong> {branch.location}
                                        </div>
                                        {branch.contact_phone && (
                                            <div style={{ marginBottom: 6 }}>
                                                <strong>📞 Phone:</strong> {branch.contact_phone}
                                            </div>
                                        )}
                                        {branch.contact_email && (
                                            <div style={{ marginBottom: 6 }}>
                                                <strong>📧 Email:</strong> {branch.contact_email}
                                            </div>
                                        )}
                                    </div>

                                    {branch.stats && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 8,
                                            marginBottom: 12,
                                            padding: 12,
                                            backgroundColor: '#111827',
                                            borderRadius: 6
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                    {branch.stats.total_customers}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#9ca3af' }}>Customers</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                    {branch.stats.total_orders}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#9ca3af' }}>Orders</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                    {branch.stats.pending_orders}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#9ca3af' }}>Pending</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                    {branch.stats.total_users}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#9ca3af' }}>Users</div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 6,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 6,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Create/Edit Modal */}
                    {showModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: '#1f2937',
                                padding: 30,
                                borderRadius: 12,
                                width: '100%',
                                maxWidth: 500,
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}>
                                <h2 style={{ marginTop: 0 }}>
                                    {editingBranch ? 'Edit Branch' : 'Create New Branch'}
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Branch Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Branch Code * (e.g., NYC001)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.branch_code}
                                            onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
                                            required
                                            disabled={editingBranch} // Can't change code after creation
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: editingBranch ? '#1f2937' : '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            placeholder="e.g., 123 Main St, New York, NY"
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.contact_phone}
                                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 20 }}>
                                        <label style={{ display: 'block', marginBottom: 6 }}>
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                borderRadius: 6,
                                                color: 'white'
                                            }}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            style={{
                                                flex: 1,
                                                padding: 12,
                                                backgroundColor: '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 6,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="button-primary"
                                            style={{ flex: 1 }}
                                        >
                                            {editingBranch ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default BranchesPage;
