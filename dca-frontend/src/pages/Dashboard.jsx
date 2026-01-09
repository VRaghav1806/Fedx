import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { caseService } from '../services/api';
import '../styles/Dashboard.css';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card stat-card">
        <div className="stat-icon" style={{ backgroundColor: color }}>
            <Icon size={24} color="white" />
        </div>
        <div className="stat-content">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalCases: 0,
        activeCases: 0,
        escalations: 0,
        recoveryRate: '0%'
    });
    const [recentCases, setRecentCases] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mRes, cRes] = await Promise.all([
                    caseService.getMetrics(),
                    caseService.getAll()
                ]);
                setMetrics(mRes.data);
                setRecentCases(cRes.data.slice(0, 5));

                // Create chart data: Recovery Rate by Month
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                // Initialize last 6 months buckets
                const now = new Date();
                const last6Months = {};
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
                    last6Months[label] = { total: 0, collected: 0 };
                }

                // Aggregate cases by month
                cRes.data.forEach(item => {
                    const date = new Date(item.createdAt); // Use creation date for 'Total' pool
                    const label = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;

                    if (last6Months.hasOwnProperty(label)) {
                        last6Months[label].total += 1;
                        if (item.status === 'collected') {
                            last6Months[label].collected += 1;
                        }
                    }
                });

                const formattedChartData = Object.keys(last6Months).map(label => {
                    const { total, collected } = last6Months[label];
                    const rate = total > 0 ? (collected / total) * 100 : 0;
                    return {
                        name: label,
                        rate: parseFloat(rate.toFixed(1))
                    };
                });

                setChartData(formattedChartData);
            } catch (error) {
                console.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>DCA Management Insight</h1>
                <div className="user-profile">
                    <span>{loading ? 'Syncing...' : 'Admin Workspace'}</span>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="stats-grid">
                    <StatCard title="Total Cases" value={metrics.totalCases} icon={FileText} color="#0070f3" />
                    <StatCard title="Active Cases" value={metrics.activeCases} icon={Users} color="#10b981" />
                    <StatCard title="Escalations" value={metrics.escalations} icon={AlertCircle} color="#ef4444" />
                    <StatCard title="Recovery Rate" value={metrics.recoveryRate} icon={TrendingUp} color="#f59e0b" />
                </section>

                <section className="charts-grid">
                    <div className="glass-card chart-container">
                        <h3>Monthly Recovery Rate (%)</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#a1a1a1" />
                                    <YAxis stroke="#a1a1a1" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        labelStyle={{ color: '#ededed' }}
                                        formatter={(value) => [`${value}%`, 'Recovery Rate']}
                                    />
                                    <Bar dataKey="rate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card list-container">
                        <h3>Recent Case Updates</h3>
                        <div className="case-list">
                            {recentCases.map((c) => (
                                <div key={c._id} className="case-item">
                                    <div className="case-info">
                                        <h4>{c.accountNumber}</h4>
                                        <p>Customer: {c.customerName}</p>
                                    </div>
                                    <div className={`case-status ${c.status.replace('_', '-')}`}>{c.status.replace('_', ' ')}</div>
                                    <div className="case-amount">${c.amount.toLocaleString()}</div>
                                </div>
                            ))}
                            {recentCases.length === 0 && (
                                <p className="p-4 text-center text-muted">No cases registered yet.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
