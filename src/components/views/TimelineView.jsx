// src/components/views/TimelineView.jsx
import { motion } from "framer-motion";

export const TimelineView = ({ students = [], onCardClick }) => {
    const sorted = [...(students || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="max-w-3xl mx-auto relative">

            {sorted.map((s, idx) => (
                <div key={s.id} className="flex gap-6 mb-8 relative">

                    {/* Timeline Dot + Line */}
                    <div className="flex flex-col items-center">
                        {/* Glowing Dot */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.7)]"></div>

                        {/* Line */}
                        {idx < sorted.length - 1 && (
                            <div className="w-[2px] flex-1 bg-gradient-to-b from-indigo-500/40 to-purple-500/40"></div>
                        )}
                    </div>

                    {/* Card */}
                    <motion.div
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
                        onClick={() => onCardClick(s)}
                        className="relative flex-1 p-[2px] rounded-xl cursor-pointer overflow-hidden transition-transform duration-150"
                    >
                        {/* Subtle gradient border */}
                        <motion.div
                            variants={{
                                hovered: {
                                    backgroundPosition: ["0% 50%", "120% 50%"],
                                    opacity: 0.55,
                                    transition: {
                                        duration: 1.5,
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

                        {/* Shine effect */}
                        <motion.div
                            variants={{
                                hovered: {
                                    opacity: 0.12,
                                    x: "120%",
                                    transition: { duration: 0.8 },
                                },
                            }}
                            initial={{ opacity: 0, x: "-60%" }}
                            className="
                absolute top-0 left-[-50%]
                w-[70%] h-full
                bg-gradient-to-r from-transparent via-white/25 to-transparent
                rotate-12 pointer-events-none
              "
                        />

                        {/* Inner glass card */}
                        <div className="relative bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <div className="text-xs text-white/60 mb-1">{s.createdAt}</div>
                            <div className="font-semibold text-white">{s.name}</div>
                            <div className="text-sm text-white/60">{s.email}</div>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );
};
