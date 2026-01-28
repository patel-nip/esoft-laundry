import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccessDenied({ requiredPermission }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#0f172a',
            padding: 20
        }}>
            <div style={{
                maxWidth: 500,
                textAlign: 'center',
                background: '#1e293b',
                padding: 40,
                borderRadius: 12,
                border: '1px solid #334155'
            }}>
                <div style={{
                    fontSize: 72,
                    marginBottom: 16
                }}>
                    🔒
                </div>

                <h1 style={{
                    fontSize: 32,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: '#f1f5f9'
                }}>
                    Access Denied
                </h1>

                <p style={{
                    fontSize: 16,
                    color: '#94a3b8',
                    marginBottom: 8
                }}>
                    You don't have permission to access this page.
                </p>

                {requiredPermission && (
                    <p style={{
                        fontSize: 14,
                        color: '#64748b',
                        marginBottom: 24
                    }}>
                        Required permission: <strong>{requiredPermission}</strong>
                    </p>
                )}

                <p style={{
                    fontSize: 14,
                    color: '#64748b',
                    marginBottom: 24,
                    padding: 12,
                    background: '#0f172a',
                    borderRadius: 6
                }}>
                    Current user: <strong>{user?.username}</strong> ({user?.role})
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="button-primary"
                    style={{
                        padding: '12px 24px',
                        fontSize: 16
                    }}
                >
                    Go to Dashboard
                </button>

                <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    marginTop: 24
                }}>
                    Contact your administrator to request access.
                </p>
            </div>
        </div>
    );
}

export default AccessDenied;
