import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('authUser');
            if (raw) {
                const parsed = JSON.parse(raw);
                // Defensive: ensure role exists
                parsed.role = parsed.role || (parsed.email && parsed.email.includes('admin') ? 'admin' : 'student');
                setUser(parsed);
            }
        } catch (err) {
            console.warn('AuthContext: failed to parse authUser', err);
            localStorage.removeItem('authUser');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (!foundUser) return false;

        // strip password
        const { password: _p, ...cleanUser } = foundUser;

        // guarantee role ALWAYS exists (critical)
        cleanUser.role = cleanUser.role || (cleanUser.email.includes("admin") ? "admin" : "student");

        localStorage.setItem("authUser", JSON.stringify(cleanUser));
        setUser(cleanUser);
        return true;
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
