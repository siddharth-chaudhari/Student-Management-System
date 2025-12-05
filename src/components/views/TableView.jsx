// src/components/views/TableView.jsx
import React from 'react';

export const TableView = ({ students = [], onRowClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="text-xs text-white/70 uppercase tracking-wide">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.id} className="border-t border-white/6 hover:bg-white/2 cursor-pointer" onClick={() => onRowClick(s)}>
                            <td className="px-4 py-3 font-medium">{s.name}</td>
                            <td className="px-4 py-3 text-sm text-white/80">{s.email}</td>
                            <td className="px-4 py-3 text-sm text-white/80">{s.phone}</td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded ${s.status === 'active' ? 'bg-green-600 text-black' : 'bg-red-500 text-white'}`}>{s.status}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-white/70">{s.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
