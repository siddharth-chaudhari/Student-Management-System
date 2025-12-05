import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lazy load pages
const Login = lazy(() => import('../pages/Auth/Login'));
const StudentManagement = lazy(() => import('../pages/StudentManagement'));
const CustomFieldBuilder = lazy(() => import('../pages/CustomFieldBuilder'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Loading component (matches your premium theme)
const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-xl font-semibold text-white">Loading...</div>
        </div>
    </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingFallback />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/students" replace />;
    }

    return children;
};

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/" element={<Navigate to="/students" replace />} />
                    
                    <Route path="/students" element={
                        <ProtectedRoute>
                            <StudentManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <StudentManagement />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin Only Routes */}
                    <Route path="/custom-fields" element={
                        <ProtectedRoute adminOnly>
                            <CustomFieldBuilder />
                        </ProtectedRoute>
                    } />

                    <Route path="/fields" element={
                        <ProtectedRoute adminOnly>
                            <CustomFieldBuilder />
                        </ProtectedRoute>
                    } />
                    
                    {/* User Routes */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    } />

                    {/* Catch all - 404 */}
                    <Route path="*" element={<Navigate to="/students" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};