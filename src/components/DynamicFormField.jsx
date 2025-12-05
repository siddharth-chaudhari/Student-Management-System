// src/components/DynamicFormField.jsx
import React, { memo } from 'react';

/**
 * DynamicFormField
 * - dark, premium styling for inputs/select/textarea
 * - view-only rendering when `disabled` is true
 * - note: native <option> popups are browser-controlled and may still show a bright background on some platforms.
 */
export const DynamicFormField = memo(function DynamicFormField({ field, value, onChange, disabled }) {
    const onVal = (v) => onChange(field.key, v);

    // view-only display
    if (disabled) {
        let display = '';
        if (field.type === 'checkbox') display = value ? 'Yes' : 'No';
        else if (field.type === 'dropdown') display = (value || '—');
        else display = value || '—';

        return (
            <div className="p-3 rounded-lg bg-white/5 border border-white/6 text-white/70">
                {display}
            </div>
        );
    }

    // common input classes
    const baseInputCls = "w-full p-3 rounded-lg outline-none text-white placeholder-white/40";
    const enabledBg = "bg-white/10 border border-white/20";
    const disabledBg = "bg-white/5 text-white/50";

    switch (field.type) {
        case 'textarea':
            return (
                <textarea
                    value={value || ''}
                    onChange={e => onVal(e.target.value)}
                    className={`${baseInputCls} ${enabledBg}`}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                />
            );

        case 'dropdown':
            return (
                <div className="relative">
                    <select
                        aria-label={field.label}
                        value={value || ''}
                        onChange={(e) => onVal(e.target.value)}
                        className={`${baseInputCls} ${enabledBg} appearance-none pr-10`}
                    >
                        <option value="">{`Select ${field.label}`}</option>
                        {(field.options || []).map(opt => (
                            // option styling is best-effort — many browsers ignore option styles
                            <option key={opt} value={opt} className="bg-[#0b1020] text-white">
                                {opt}
                            </option>
                        ))}
                    </select>

                    {/* custom caret */}
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            );

        case 'checkbox':
            return (
                <label className="inline-flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={e => onVal(e.target.checked)}
                        className="w-4 h-4 rounded-sm bg-white/10 border border-white/20 text-indigo-400"
                    />
                    <span className="text-white">{field.label}</span>
                </label>
            );

        case 'date':
        case 'time':
            return (
                <input
                    type={field.type}
                    value={value || ''}
                    onChange={e => onVal(e.target.value)}
                    className={`${baseInputCls} ${enabledBg}`}
                />
            );

        default:
            return (
                <input
                    type="text"
                    value={value || ''}
                    onChange={e => onVal(e.target.value)}
                    className={`${baseInputCls} ${enabledBg}`}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                />
            );
    }
});
