import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save } from 'lucide-react';
import '../styles/Settings.css';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const sections = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'workflow', name: 'Workflow', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'system', name: 'System', icon: Globe },
    ];

    return (
        <div className="settings-container">
            <header className="page-header">
                <h1>Settings</h1>
                <button className="btn-primary flex items-center gap-2">
                    <Save size={18} /> Save Changes
                </button>
            </header>

            <div className="settings-layout">
                <aside className="settings-sidebar glass-card">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            className={`settings-nav-item ${activeTab === section.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(section.id)}
                        >
                            <section.icon size={20} />
                            <span>{section.name}</span>
                        </button>
                    ))}
                </aside>

                <main className="settings-content glass-card">
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h2>Profile Settings</h2>
                            <p className="text-muted">Manage your personal information and roles.</p>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" defaultValue="Admin User" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" defaultValue="admin@dcaplatform.com" />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select defaultValue="admin">
                                        <option value="admin">Super Administrator</option>
                                        <option value="manager">Case Manager</option>
                                        <option value="dca">External DCA Agent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workflow' && (
                        <div className="settings-section">
                            <h2>Workflow Configuration</h2>
                            <p className="text-muted">Set default SLAs and priority weights for auto-allocation.</p>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Default SLA (Days)</label>
                                    <input type="number" defaultValue="30" />
                                </div>
                                <div className="form-group">
                                    <label>Priority Escalation Threshold</label>
                                    <select defaultValue="high">
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>Notification Preferences</h2>
                            <p className="text-muted">Control how you receive alerts and updates.</p>
                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <span>Email alerts for new escalations</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="toggle-item">
                                    <span>Dashboard popups for high-value recoveries</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="toggle-item">
                                    <span>SLA breach reminders</span>
                                    <input type="checkbox" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="settings-section">
                            <h2>System Preferences</h2>
                            <p className="text-muted">Global application settings and display options.</p>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Currency Symbol</label>
                                    <select defaultValue="USD">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Default Timezone</label>
                                    <select defaultValue="utc">
                                        <option value="utc">UTC (Coordinated Universal Time)</option>
                                        <option value="est">EST (Eastern Standard Time)</option>
                                        <option value="ist">IST (Indian Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
