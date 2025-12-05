import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomFieldBuilder } from '../pages/CustomFieldBuilder';
import { StudentManagement } from '../pages/StudentManagement';

export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState('students');

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Student Management System</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            {user?.name} <span className="text-gray-500">({user?.role})</span>
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6">
                {user?.role === 'admin' && (
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setCurrentPage('students')}
                            className={`px-4 py-2 rounded ${currentPage === 'students'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white hover:bg-gray-100'
                                }`}
                        >
                            Student Management
                        </button>
                        <button
                            onClick={() => setCurrentPage('fields')}
                            className={`px-4 py-2 rounded ${currentPage === 'fields'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white hover:bg-gray-100'
                                }`}
                        >
                            Custom Fields
                        </button>
                    </div>
                )}

                {currentPage === 'students' && <StudentManagement />}
                {currentPage === 'fields' && user?.role === 'admin' && <CustomFieldBuilder />}
            </div>
        </div>
    );
};