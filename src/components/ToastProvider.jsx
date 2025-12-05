// src/components/ToastProvider.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const push = useCallback((message, { type = 'info', duration = 3000 } = {}) => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
        return id;
    }, []);

    const remove = useCallback((id) => {
        setToasts(t => t.filter(x => x.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ push, remove }}>
            {children}
            {/* Toast container */}
            <div className="fixed right-6 top-6 z-[9999] flex flex-col gap-3">
                <AnimatePresence initial={false}>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className={`min-w-[220px] max-w-sm rounded-xl p-3 shadow-lg border border-white/8 ${t.type === 'success' ? 'bg-green-400 text-black' :
                                    t.type === 'error' ? 'bg-red-600 text-white' :
                                        'bg-white/10 text-white'
                                }`}
                        >
                            <div className="text-sm">{t.message}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
