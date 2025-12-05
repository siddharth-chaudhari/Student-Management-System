import React from 'react';

export const Alert = ({ children, className = '' }) => {
    return (
        <div className={`p-4 rounded border ${className}`}>
            {children}
        </div>
    );
};

export const AlertDescription = ({ children, className = '' }) => {
    return <div className={`text-sm ${className}`}>{children}</div>;
};