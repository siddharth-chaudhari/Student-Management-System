// src/components/views/CalendarView.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * CalendarView with:
 * - grouping by month (e.g. "December 2024")
 * - scroll reveal animation per month block (fade + lift)
 *
 * expects student.createdAt in a parseable date string (YYYY-MM-DD works fine)
 */
export const CalendarView = ({ students = [], onCardClick }) => {
    // helper: format month-year label
    const formatMonthLabel = (y, m) => {
        const date = new Date(y, m - 1, 1);
        return date.toLocaleString(undefined, { month: "long", year: "numeric" });
    };

    // group students by month-year using useMemo for perf
    const groupedByMonth = useMemo(() => {
        const map = {};
        (students || []).forEach((s) => {
            if (!s.createdAt) return;
            // normalize date -> YYYY-MM-DD or parseable string
            const d = new Date(s.createdAt);
            if (isNaN(d)) return;
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-12
            const key = `${year}-${String(month).padStart(2, "0")}`; // "2024-12"
            map[key] = map[key] || { year, month, items: [] };
            map[key].items.push(s);
        });

        // convert to array sorted descending by year-month
        const arr = Object.entries(map)
            .map(([k, v]) => ({ key: k, year: v.year, month: v.month, items: v.items }))
            .sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                return b.month - a.month;
            });

        // sort items within each month by createdAt desc (recent first)
        arr.forEach((g) => {
            g.items.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
        });

        return arr;
    }, [students]);

    if (!students || students.length === 0) {
        return <div className="text-white/60">No records to show.</div>;
    }

    return (
        <div className="space-y-6">
            {groupedByMonth.map((group) => (
                <motion.section
                    key={group.key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10"
                >
                    {/* Header: Month label + count */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            {formatMonthLabel(group.year, group.month)}
                        </h3>
                        <div className="text-sm text-white/60">{group.items.length} item{group.items.length > 1 ? "s" : ""}</div>
                    </div>

                    <div className="grid gap-3">
                        {group.items.map((s) => (
                            <motion.article
                                key={s.id}
                                whileHover={{ scale: 1.02, y: -4 }}
                                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                                onClick={() => onCardClick(s)}
                                className="relative p-[2px] rounded-xl cursor-pointer overflow-hidden"
                            >
                                {/* subtle hover border + shine (same pattern used across views) */}
                                <motion.div
                                    initial={{ opacity: 0.18 }}
                                    whileHover={{ opacity: 0.5, backgroundPosition: ["0% 50%", "120% 50%"] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 bg-[length:200%_200%]"
                                />

                                <div className="relative p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-white">{s.name}</div>
                                            <div className="text-sm text-white/60">{s.email}</div>
                                        </div>
                                        <div className="text-sm text-white/50">{s.createdAt}</div>
                                    </div>

                                    {s.customFields?.bio && (
                                        <div className="mt-2 text-sm text-white/60">{s.customFields.bio}</div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>
            ))}
        </div>
    );
};
