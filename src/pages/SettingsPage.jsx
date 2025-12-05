// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PremiumLayout } from '../components/PremiumLayout';

export const SettingsPage = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('dark');

    const rightControls = { user, search: null, buttons: null };

    return (
        <PremiumLayout rightControls={rightControls}>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-4">Settings</h1>

                <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/6">
                    <div className="mb-4">
                        <div className="text-sm text-white/60">Logged in as</div>
                        <div className="font-medium text-lg">{user?.email}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Theme</label>
                            <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full p-3 rounded-lg bg-white/6 outline-none">
                                <option value="dark">Dark Lavender</option>
                                <option value="navy">Navy Blue</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1">Notifications</label>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                                <span className="text-sm text-white/70">Enable email notifications</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button className="bg-indigo-600 px-4 py-2 rounded-2xl text-white">Save Settings</button>
                    </div>
                </div>
            </div>
        </PremiumLayout>
    );
};
