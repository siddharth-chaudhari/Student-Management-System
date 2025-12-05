// src/components/StudentDrawer.jsx
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCustomFields } from '../hooks/useCustomFields';
import { DynamicFormField } from './DynamicFormField';
import { useToast } from './ToastProvider';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{6,20}$/;

export const StudentDrawer = ({ student, mode = 'view', onClose, onSave, onDelete }) => {
    const { user } = useAuth();
    const { fields } = useCustomFields();
    const toast = useToast();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [currentMode, setCurrentMode] = useState(mode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        customFields: {}
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const firstRef = useRef(null);

    useEffect(() => {
        setCurrentMode(mode);
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone: student.phone || '',
                status: student.status || 'active',
                customFields: student.customFields || {}
            });
        } else {
            setFormData({ name: '', email: '', phone: '', status: 'active', customFields: {} });
        }
        setErrors({});
    }, [student, mode]);

    // autofocus when create mode opens
    useEffect(() => {
        if (currentMode === 'create' && firstRef.current) {
            firstRef.current.focus();
        }
    }, [currentMode]);

    const canEdit = (currentMode === 'create' || currentMode === 'edit') && user?.role === 'admin';

    const handleChange = (key, value) => {
        if (['name', 'email', 'phone', 'status'].includes(key)) {
            setFormData(prev => ({ ...prev, [key]: value }));
        } else {
            setFormData(prev => ({ ...prev, customFields: { ...prev.customFields, [key]: value } }));
        }
        setErrors(prev => ({ ...prev, [key]: null }));
    };

    const validate = () => {
        const e = {};
        if (!formData.name || !formData.name.trim()) e.name = 'Name is required';
        if (!formData.email || !emailRegex.test(formData.email)) e.email = 'Valid email required';
        if (!formData.phone || !phoneRegex.test(formData.phone)) e.phone = 'Valid phone required';
        (fields || []).forEach(f => {
            if (f.required && (formData.customFields?.[f.key] === undefined || formData.customFields?.[f.key] === '')) {
                e[`cf_${f.key}`] = `${f.label} is required`;
            }
        });
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEdit) {
            toast.push('You are not allowed to perform this action', { type: 'error' });
            return;
        }

        if (!validate()) {
            toast.push('Fix form errors first', { type: 'error' });
            return;
        }

        setSaving(true);
        try {
            await Promise.resolve(onSave(formData)); // supports sync or promise
            setShowSuccess(true);
            toast.push(currentMode === 'create' ? 'Student created' : 'Student updated', { type: 'success' });

            setTimeout(() => {
                setShowSuccess(false);
                setSaving(false);
                onClose();
            }, 900);
        } catch (err) {
            console.error(err);
            setSaving(false);
            toast.push('Save failed', { type: 'error' });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!user?.role === 'admin') {
            toast.push('You are not allowed to perform this action', { type: 'error' });
            setShowDeleteConfirm(false);
            return;
        }
        if (!onDelete) {
            toast.push('Delete handler not provided', { type: 'error' });
            setShowDeleteConfirm(false);
            return;
        }

        setDeleting(true);
        try {
            await Promise.resolve(onDelete(student.id));
            toast.push('Student deleted', { type: 'success' });
            setShowDeleteConfirm(false);
            setDeleting(false);
            onClose();
        } catch (err) {
            console.error('delete failed', err);
            setDeleting(false);
            toast.push('Delete failed', { type: 'error' });
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="w-full sm:w-96 h-full overflow-y-auto bg-gradient-to-b from-[#0b1020] to-[#0f1220] p-6 shadow-2xl border-l border-white/10"
            >
                {/* header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {currentMode === 'create' ? 'Create Student' : currentMode === 'edit' ? 'Edit Student' : 'Student Details'}
                        </h3>
                        <p className="text-sm text-white/50">{student?.email || 'New student'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {student && user?.role === 'admin' && (
                            <button
                                onClick={() => setCurrentMode(prev => prev === 'view' ? 'edit' : 'view')}
                                className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                {currentMode === 'view' ? 'Edit' : 'View'}
                            </button>
                        )}

                        {/* Delete (admin only) */}
                        {student && user?.role === 'admin' && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        )}

                        <button onClick={onClose} className="px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">Close</button>
                    </div>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/70 mb-1">Name *</label>
                        <input
                            ref={firstRef}
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            disabled={!canEdit}
                            className={`w-full p-3 rounded-lg ${canEdit ? 'bg-white/10 border border-white/20 text-white' : 'bg-white/5 text-white/60'} outline-none`}
                            placeholder="Full name"
                        />
                        {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm text-white/70 mb-1">Email *</label>
                        <input
                            value={formData.email}
                            onChange={e => handleChange('email', e.target.value)}
                            disabled={!canEdit}
                            className={`w-full p-3 rounded-lg ${canEdit ? 'bg-white/10 border border-white/20 text-white' : 'bg-white/5 text-white/60'} outline-none`}
                            placeholder="email@domain.com"
                        />
                        {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm text-white/70 mb-1">Phone *</label>
                        <input
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            disabled={!canEdit}
                            className={`w-full p-3 rounded-lg ${canEdit ? 'bg-white/10 border border-white/20 text-white' : 'bg-white/5 text-white/60'} outline-none`}
                            placeholder="+91-9876543210"
                        />
                        {errors.phone && <div className="text-xs text-red-400 mt-1">{errors.phone}</div>}
                    </div>

                    {user?.role === 'admin' && (
                        <div>
                            <label className="block text-sm text-white/70 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => handleChange('status', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full p-3 rounded-lg outline-none appearance-none
        ${canEdit
                                        ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 focus:border-indigo-400 transition'
                                        : 'bg-white/5 text-white/50'}
    `}
                            >
                                <option className="bg-[#0b1020]" value="active">Active</option>
                                <option className="bg-[#0b1020]" value="inactive">Inactive</option>
                            </select>

                        </div>
                    )}

                    {/* custom fields */}
                    {(fields || []).map(f => (
                        <div key={f.id}>
                            <label className="block text-sm text-white/70 mb-1">{f.label}{f.required ? ' *' : ''}</label>
                            <DynamicFormField
                                field={f}
                                value={formData.customFields?.[f.key]}
                                onChange={handleChange}
                                disabled={!canEdit}
                            />
                            {errors[`cf_${f.key}`] && <div className="text-xs text-red-400 mt-1">{errors[`cf_${f.key}`]}</div>}
                        </div>
                    ))}

                    {/* action buttons */}
                    <div className="flex gap-3 pt-5 items-center">
                        {(currentMode === 'create' || currentMode === 'edit') && user?.role === 'admin' && (
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-green-400 text-black px-4 py-3 rounded-xl font-semibold shadow hover:scale-[1.02] transition disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : (currentMode === 'create' ? 'Create' : 'Save')}
                            </button>
                        )}

                        <button type="button" onClick={onClose} className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition">Cancel</button>

                        {/* success animation */}
                        <div className="w-12 h-12 flex items-center justify-center">
                            {showSuccess && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </form>

                {/* delete confirm modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center z-[2000] bg-black/50 backdrop-blur-sm">
                        <div className="bg-[#0b0f18] p-6 rounded-2xl border border-white/10 w-80">
                            <h3 className="text-lg font-semibold text-white mb-2">Delete Student?</h3>
                            <p className="text-white/60 text-sm mb-4">This action cannot be undone. The record will be permanently removed.</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl disabled:opacity-60"
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>

                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 bg-white/10 text-white py-2 rounded-xl hover:bg-white/20"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
