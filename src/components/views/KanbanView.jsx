// src/components/views/KanbanView.jsx
import React from "react";
import { motion } from "framer-motion";

export const KanbanView = ({ students = [], onCardClick }) => {
    const columns = ["active", "inactive"];

    return (
        <div className="flex gap-4">
            {columns.map((col) => (
                <div key={col} className="flex-1 bg-white/6 p-4 rounded-2xl">
                    <div className="font-semibold mb-3 capitalize">
                        {col}{" "}
                        <span className="text-sm text-white/60">
                            ({students.filter((s) => s.status === col).length})
                        </span>
                    </div>

                    <div className="space-y-3">
                        {students
                            .filter((s) => s.status === col)
                            .map((s) => (
                                <motion.div
                                    key={s.id}
                                    whileHover="hovered"
                                    whileTap={{ scale: 0.97 }}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        const rotateY = ((x / rect.width) - 0.5) * 6;
                                        const rotateX = ((y / rect.height) - 0.5) * -6;
                                        e.currentTarget.style.transform =
                                            `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
                                    }}
                                    className="relative p-[1.5px] rounded-xl cursor-pointer overflow-hidden transition-transform duration-150"
                                    onClick={() => onCardClick(s)}
                                >
                                    {/* Subtle gradient border */}
                                    <motion.div
                                        variants={{
                                            hovered: {
                                                backgroundPosition: ["0% 50%", "120% 50%"],
                                                opacity: 0.5,
                                                transition: {
                                                    duration: 1.8,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                },
                                            },
                                        }}
                                        initial={{ opacity: 0.25 }}
                                        className="
                      absolute inset-0 rounded-xl pointer-events-none
                      bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30
                      bg-[length:200%_200%]
                    "
                                    />

                                    {/* Shine sweep */}
                                    <motion.div
                                        variants={{
                                            hovered: {
                                                opacity: 0.15,
                                                x: "120%",
                                                transition: { duration: 0.8 },
                                            },
                                        }}
                                        initial={{ opacity: 0, x: "-70%" }}
                                        className="
                      absolute top-0 left-[-50%]
                      w-[70%] h-full
                      bg-gradient-to-r from-transparent via-white/20 to-transparent
                      rotate-12 pointer-events-none
                    "
                                    />

                                    {/* Inner card */}
                                    <div className="relative p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                                        <div className="font-medium text-white">{s.name}</div>
                                        <div className="text-sm text-white/60">{s.email}</div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
