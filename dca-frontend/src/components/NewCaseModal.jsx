import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { caseService } from '../services/api';

const NewCaseModal = ({ isOpen, onClose, onCaseCreated, initialData = null }) => {
    const [formData, setFormData] = useState({
        accountNumber: '',
        customerName: '',
        amount: '',
        priority: 'medium',
        status: 'pending',
        slaDeadline: ''
    });

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        setServerError(null);
        if (initialData) {
            setFormData({
                accountNumber: initialData.accountNumber,
                customerName: initialData.customerName,
                amount: initialData.amount,
                priority: initialData.priority,
                status: initialData.status,
                slaDeadline: initialData.slaDeadline ? new Date(initialData.slaDeadline).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                accountNumber: '',
                customerName: '',
                amount: '',
                priority: 'medium',
                status: 'pending',
                slaDeadline: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setServerError(null);
        try {
            if (initialData) {
                await caseService.update(initialData._id, formData);
            } else {
                await caseService.create(formData);
            }
            onCaseCreated();
            onClose();
        } catch (error) {
            console.error('Save Case Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            const errorMessage = error.response?.data?.message || (initialData ? 'Error updating case.' : 'Error creating case. Please check if the account number is unique.');
            setServerError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Edit Case' : 'Create New Case'}</h2>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    {serverError && (
                        <div className="error-banner">
                            {serverError}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Account Number</label>
                        <input
                            required
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            placeholder="e.g. ACC-1234"
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input
                            required
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            placeholder="Full Name / Company"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                required
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="collected">Collected / Solved</option>
                                <option value="escalated">Escalated</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>SLA Deadline</label>
                        <input
                            required
                            type="date"
                            value={formData.slaDeadline}
                            onChange={(e) => setFormData({ ...formData, slaDeadline: e.target.value })}
                        />
                    </div>
                    <button disabled={loading} type="submit" className="btn-primary w-full mt-4">
                        {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Register Case')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewCaseModal;
