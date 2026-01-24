import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, authHelpers } from "../services/api";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter username and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await authAPI.login(username, password);

            // Save token to localStorage
            authHelpers.saveToken(data.token);

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="full-screen-center">
            <div className="card" style={{ width: 380 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "999px",
                            background: "#0ea5e9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontWeight: 600,
                            margin: "0 auto 12px",
                        }}
                    >
                        <img
                            src="/esoft.jpeg"
                            alt="Esoft logo"
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "999px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                        Laundry Control
                    </h1>
                    <p className="text-small">
                        Sign in with your username and password.
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: "12px",
                        background: "#991b1b",
                        color: "#fecaca",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontSize: "13px"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <label className="label">Username</label>
                        <input
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            disabled={loading}
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="button-primary"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div style={{
                    marginTop: 16,
                    padding: "12px",
                    background: "#1f2937",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#9ca3af"
                }}>
                    <strong>Demo credentials:</strong><br />
                    Username: admin<br />
                    Password: admin123
                </div>
            </div>
        </main>
    );
}

export default LoginPage;
