// src/pages/StudentManagement.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PremiumLayout } from '../components/PremiumLayout';
import { ProfileDropdown } from '../components/ProfileDropdown'; // ← added
import { StudentDrawer } from '../components/StudentDrawer';
import { CalendarView } from '../components/views/CalendarView';
import { GalleryView } from '../components/views/GalleryView';
import { KanbanView } from '../components/views/KanbanView';
import { TableView } from '../components/views/TableView';
import { TimelineView } from '../components/views/TimelineView';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../hooks/useStudents';

export const StudentManagement = () => {
    const { user } = useAuth();
    const { students = [], createStudent, updateStudent, deleteStudent, isLoading } = useStudents();
    const [view, setView] = useState('table');
    const [drawer, setDrawer] = useState({ open: false, student: null, mode: 'view' });
    const [query, setQuery] = useState('');

    // search + filter
    const filtered = (students || []).filter(s => {
        const q = (query || '').trim().toLowerCase();
        if (!q) return true;
        return (s.name || '').toLowerCase().includes(q)
            || (s.email || '').toLowerCase().includes(q)
            || (s.phone || '').toLowerCase().includes(q);
    });

    const openCreate = () => setDrawer({ open: true, student: null, mode: 'create' });
    const openView = (student) => setDrawer({ open: true, student, mode: 'view' });

    const handleSave = async (payload) => {
        if (drawer.mode === 'create') {
            await createStudent(payload);
        } else {
            await updateStudent(drawer.student.id, payload);
        }
        setDrawer({ open: false, student: null, mode: 'view' });
    };

    const rightControls = {
        user,
        search: (
            <div className="flex items-center gap-2 bg-white/6 backdrop-blur p-2 rounded-xl">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search name, email or phone"
                    className="flex-1 bg-transparent outline-none px-3 py-2 text-sm text-white"
                />
                <button
                    onClick={() => { }}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                    Search
                </button>
            </div>
        ),
        // Replaced buttons block to include ProfileDropdown
        buttons: (
            <div className="flex items-center gap-3">
                {user?.role === 'admin' && (
                    <button
                        onClick={openCreate}
                        className="bg-gradient-to-br from-green-400 to-teal-500 px-4 py-2 rounded-2xl text-black font-semibold shadow hover:scale-[1.02] transition"
                    >
                        + Add Student
                    </button>
                )}

                <ProfileDropdown />
            </div>
        )
    };

    return (
        <>
  <PremiumLayout rightControls={rightControls}>
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-extrabold text-white">Students</h1>
            <p className="text-sm text-white/70">Manage students, fields and records</p>
        </div>

        <div className="bg-white/6 rounded-2xl p-2 px-3 flex items-center gap-2">
            {['table', 'gallery', 'kanban', 'timeline', 'calendar'].map(v => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-2 rounded ${view === v ? 'bg-indigo-600 text-white' : 'text-white/80 hover:bg-white/10'}`}
                >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
            ))}
        </div>
    </motion.div>

    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10 relative z-0">
        {isLoading ? (
            <div className="text-center py-8 text-white/60">Loading students...</div>
        ) : (
            <>
                {view === 'table' && <TableView students={filtered} onRowClick={openView} />}
                {view === 'gallery' && <GalleryView students={filtered} onCardClick={openView} />}
                {view === 'kanban' && <KanbanView students={filtered} onCardClick={openView} />}
                {view === 'timeline' && <TimelineView students={filtered} onCardClick={openView} />}
                {view === 'calendar' && <CalendarView students={filtered} onCardClick={openView} />}
            </>
        )}
    </div>
</PremiumLayout>
    {/* Drawer outside layout - renders at root level */}
    {drawer.open && (
        <StudentDrawer
            student={drawer.student}
            mode={drawer.mode}
            onClose={() => setDrawer({ open: false, student: null, mode: 'view' })}
            onSave={handleSave}
            onDelete={deleteStudent}
        />
    )}
</>
    );
};
export default StudentManagement;