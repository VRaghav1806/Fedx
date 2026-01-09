import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield } from 'lucide-react';
import { authService } from '../services/api';
import '../styles/Auth.css';

const Signup = ({ setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.signup(formData);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card auth-card">
                <div className="auth-logo">F</div>
                <h1>Get Started</h1>
                <p>Create your DCA Platform account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="search-box glass-card" style={{ padding: '0.25rem 0.75rem' }}>
                            <User size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="search-box glass-card" style={{ padding: '0.25rem 0.75rem' }}>
                            <Mail size={18} color="var(--text-muted)" />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="search-box glass-card" style={{ padding: '0.25rem 0.75rem' }}>
                            <Lock size={18} color="var(--text-muted)" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Initial Role</label>
                        <div className="search-box glass-card" style={{ padding: '0.25rem 0.75rem' }}>
                            <Shield size={18} color="var(--text-muted)" />
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            >
                                <option value="admin" style={{ background: '#1a1a1a' }}>Super Administrator</option>
                                <option value="manager" style={{ background: '#1a1a1a' }}>Case Manager</option>
                                <option value="dca" style={{ background: '#1a1a1a' }}>External DCA Agent</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login Here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
