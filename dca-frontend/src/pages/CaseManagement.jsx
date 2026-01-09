import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { caseService } from '../services/api';
import NewCaseModal from '../components/NewCaseModal';
import '../styles/CaseManagement.css';
import '../styles/Modal.css';

const CaseManagement = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const response = await caseService.getAll();
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
            setCases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await caseService.delete(id);
                fetchCases();
            } catch (error) {
                alert('Error deleting case.');
            }
        }
    };

    const handleEdit = (caseItem) => {
        setSelectedCase(caseItem);
        setIsModalOpen(true);
    };

    const handleResolve = async (caseItem) => {
        try {
            await caseService.update(caseItem._id, { ...caseItem, status: 'collected' });
            fetchCases();
        } catch (error) {
            alert('Error resolving case.');
        }
    };

    const handleDetails = (caseItem) => {
        alert(`Case Details for ${caseItem.accountNumber}:\nCustomer: ${caseItem.customerName}\nAmount: $${caseItem.amount}\nStatus: ${caseItem.status}\nPriority: ${caseItem.priority}\nProbability: ${(caseItem.recoveryProbability * 100).toFixed(1)}%`);
    };

    const filteredCases = cases.filter(c =>
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="case-mgmt-container">
            <header className="page-header">
                <h1>Case Management</h1>
                <button
                    onClick={() => { setSelectedCase(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} /> New Case
                </button>
            </header>

            <NewCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCaseCreated={fetchCases}
                initialData={selectedCase}
            />

            <div className="controls-row">
                <div className="search-box glass-card">
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search accounts or customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="glass-card filter-btn">
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div className="glass-card table-wrapper">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Account #</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map((c) => (
                            <tr key={c._id}>
                                <td className="font-bold">{c.accountNumber}</td>
                                <td>{c.customerName}</td>
                                <td>${c.amount.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${c.status}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <span className={`priority-badge ${c.priority}`}>
                                        {c.priority}
                                    </span>
                                </td>
                                <td>{new Date(c.slaDeadline).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleResolve(c)}
                                            title="Mark as Collected"
                                            disabled={c.status === 'collected'}
                                            className={c.status === 'collected' ? 'btn-disabled' : 'btn-success'}
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                        <button onClick={() => handleEdit(c)} title="Edit"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(c._id)} title="Delete"><Trash2 size={16} /></button>
                                        <button onClick={() => handleDetails(c)} title="Details"><ExternalLink size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="loading-state">Syncing cases...</div>}
            </div>
        </div>
    );
};

export default CaseManagement;
