import { motion } from 'framer-motion';
import { useState } from 'react';
import { PremiumLayout } from '../components/PremiumLayout';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { useAuth } from '../context/AuthContext';
import { useCustomFields } from '../hooks/useCustomFields';

export const CustomFieldBuilder = () => {
    const { user } = useAuth();
    const { fields, createField, updateField, deleteField } = useCustomFields();
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        key: '',
        type: 'text',
        required: false,
        options: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            updateField(editing, formData);
            setEditing(null);
        } else {
            createField(formData);
        }
        setFormData({ label: '', key: '', type: 'text', required: false, options: [] });
    };

    const handleEdit = (field) => {
        setEditing(field.id);
        setFormData(field);
    };

    const handleCancel = () => {
        setEditing(null);
        setFormData({ label: '', key: '', type: 'text', required: false, options: [] });
    };

    const rightControls = {
        user,
        buttons: <ProfileDropdown />
    };

    return (
        <PremiumLayout rightControls={rightControls}>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-white">Custom Field Builder</h1>
                    <p className="text-sm text-white/70">Define custom fields for student profiles</p>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {editing ? 'Edit Field' : 'Add New Field'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 font-medium mb-1">Label *</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="e.g., Gender"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 font-medium mb-1">Key *</label>
                                <input
                                    type="text"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="e.g., gender"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 font-medium mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 [&>option]:bg-slate-800 [&>option]:text-white"
                                >
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="dropdown">Dropdown</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="date">Date</option>
                                    <option value="time">Time</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer text-white/80">
                                    <input
                                        type="checkbox"
                                        checked={formData.required}
                                        onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="font-medium">Required Field</span>
                                </label>
                            </div>
                        </div>

                        {formData.type === 'dropdown' && (
                            <div>
                                <label className="block text-white/80 font-medium mb-1">
                                    Options (comma-separated) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.options?.join(', ') || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        options: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                    })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Option1, Option2, Option3"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                            >
                                {editing ? 'Update Field' : 'Create Field'}
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Existing Fields */}
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Existing Custom Fields</h2>

                    {fields.length === 0 ? (
                        <p className="text-white/50 text-center py-8">
                            No custom fields yet. Create your first one above!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {fields.map(field => (
                                <div
                                    key={field.id}
                                    className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium text-white text-lg">{field.label}</div>
                                        <div className="text-sm text-white/60 mt-1">
                                            <span className="mr-4">
                                                <strong>Key:</strong> {field.key}
                                            </span>
                                            <span className="mr-4">
                                                <strong>Type:</strong> {field.type}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs ${field.required
                                                ? 'bg-red-500/20 text-red-300'
                                                : 'bg-green-500/20 text-green-300'
                                                }`}>
                                                {field.required ? 'Required' : 'Optional'}
                                            </span>
                                        </div>
                                        {field.type === 'dropdown' && field.options && (
                                            <div className="text-sm text-white/70 mt-2">
                                                <strong className="text-white/80">Options:</strong> {field.options.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(field)}
                                            className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Delete "${field.label}"?`)) {
                                                    deleteField(field.id);
                                                }
                                            }}
                                            className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </PremiumLayout>
    );
};

export default CustomFieldBuilder;