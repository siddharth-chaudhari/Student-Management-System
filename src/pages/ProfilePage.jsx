// src/pages/ProfilePage.jsx
import { PremiumLayout } from '../components/PremiumLayout';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
    const { user } = useAuth();

    const rightControls = {
        user,
        search: null,
        buttons: null
    };

    return (
        <PremiumLayout rightControls={rightControls}>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-4">Your Profile</h1>

                <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-white/60">Name</div>
                            <div className="font-medium text-lg">{user?.name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/60">Email</div>
                            <div className="font-medium text-lg">{user?.email}</div>
                        </div>

                        <div>
                            <div className="text-sm text-white/60">Role</div>
                            <div className="font-medium text-lg">{user?.role}</div>
                        </div>

                        <div>
                            <div className="text-sm text-white/60">Member ID</div>
                            <div className="font-medium text-lg">{user?.id}</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm text-white/70 mb-2">About</h3>
                        <p className="text-sm text-white/70">This profile page is intentionally minimal — expand with avatar upload, bio editor, or password change if you want.</p>
                    </div>
                </div>
            </div>
        </PremiumLayout>
    );
};
