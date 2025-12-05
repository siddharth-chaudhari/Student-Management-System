import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PremiumLayout = ({ children, rightControls }) => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Top Navigation Bar */}
            <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Left Side - Logo & Nav Links */}
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Student Portal
                            </h1>
                            
                            <div className="flex gap-2">
                                <Link
                                    to="/dashboard"
                                    className={`px-4 py-2 rounded-xl transition ${
                                        isActive('/students') || isActive('/dashboard')
                                            ? 'bg-white/10 text-white' 
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Dashboard
                                </Link>

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/custom-fields"
                                        className={`px-4 py-2 rounded-xl transition ${
                                            isActive('/custom-fields') || isActive('/fields')
                                                ? 'bg-white/10 text-white' 
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        Custom Fields
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Search, Buttons, Profile */}
                        <div className="flex items-center gap-4">
                            {rightControls?.search}
                            {rightControls?.buttons}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
};
