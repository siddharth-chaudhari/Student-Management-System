// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         try {
//             const raw = localStorage.getItem('authUser');
//             if (raw) {
//                 const parsed = JSON.parse(raw);
//                 // Defensive: ensure role exists
//                 parsed.role = parsed.role || (parsed.email && parsed.email.includes('admin') ? 'admin' : 'student');
//                 setUser(parsed);
//             }
//         } catch (err) {
//             console.warn('AuthContext: failed to parse authUser', err);
//             localStorage.removeItem('authUser');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const login = (email, password) => {
//         const users = JSON.parse(localStorage.getItem('users') || '[]');
//         const foundUser = users.find(u => u.email === email && u.password === password);

//         if (!foundUser) return false;

//         // strip password
//         const { password: _p, ...cleanUser } = foundUser;

//         // guarantee role ALWAYS exists (critical)
//         cleanUser.role = cleanUser.role || (cleanUser.email.includes("admin") ? "admin" : "student");

//         localStorage.setItem("authUser", JSON.stringify(cleanUser));
//         setUser(cleanUser);
//         return true;
//     };


//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('authUser');
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within AuthProvider');
//     return context;
// };

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext (improved)
 * - synchronous init from localStorage to avoid flicker
 * - storage event listener to sync across tabs
 * - login returns the authUser object on success, null on failure
 * - robust role handling: prefer stored role; if missing, try to re-derive
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // synchronous init to avoid route flicker
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("authUser");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // if role exists use it, otherwise leave for reconciliation in effect
            return parsed;
        } catch {
            localStorage.removeItem("authUser");
            return null;
        }
    });

    // loading only until first effect runs (keeps SSR-friendly)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If authUser was missing a role, try to reconcile against users mock (best-effort)
        try {
            if (user && !user.role) {
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const u = users.find((x) => x.id === user.id || x.email === user.email);
                if (u && u.role) {
                    const merged = { ...user, role: u.role };
                    localStorage.setItem("authUser", JSON.stringify(merged));
                    setUser(merged);
                } else {
                    // fallback: treat as student (safer than assuming admin)
                    const merged = { ...user, role: "student" };
                    localStorage.setItem("authUser", JSON.stringify(merged));
                    setUser(merged);
                }
            }
        } catch (err) {
            console.warn("AuthContext: reconciliation failed", err);
        } finally {
            setLoading(false);
        }

        // sync authUser across tabs
        const onStorage = (e) => {
            if (e.key === "authUser") {
                try {
                    const newVal = e.newValue ? JSON.parse(e.newValue) : null;
                    setUser(newVal);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    /**
     * login: validate against mock users stored in localStorage
     * - returns authUser object on success, null on failure
     */
    const login = (email, password) => {
        try {
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const found = users.find((u) => u.email === email && u.password === password);
            if (!found) return null;

            // strip password
            const { password: _pw, ...clean } = found;

            // ensure role exists (prefer declared role on user)
            clean.role = clean.role || (clean.email === "admin@school.com" ? "admin" : "student");

            localStorage.setItem("authUser", JSON.stringify(clean));
            setUser(clean);
            return clean;
        } catch (err) {
            console.error("AuthContext.login error", err);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem("authUser");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
