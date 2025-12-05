// src/components/views/GalleryView.jsx
import { motion } from 'framer-motion';

export const GalleryView = ({ students = [], onCardClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(s => (
                <motion.div
                    key={s.id}
                    whileHover="hovered"
                    whileTap={{ scale: 0.98 }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const rotateY = ((x / rect.width) - 0.5) * 10;
                        const rotateX = ((y / rect.height) - 0.5) * -10;

                        e.currentTarget.style.transform =
                            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                            "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
                    }}
                    className="relative rounded-2xl p-[1.5px] cursor-pointer overflow-hidden transition-transform duration-200"
                    onClick={() => onCardClick(s)}
                >

                    {/* 🔥 Subtle gradient border */}
                    <motion.div
                        variants={{
                            hovered: {
                                opacity: 0.6,
                                backgroundPosition: ["0% 50%", "120% 50%"],
                                transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            },
                        }}
                        initial={{ opacity: 0.3 }}
                        className="
      absolute inset-0 rounded-2xl pointer-events-none
      bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30
      bg-[length:200%_200%]
    "
                    />

                    {/* ✨ Very subtle shine (not too bright) */}
                    <motion.div
                        variants={{
                            hovered: {
                                opacity: 0.15,
                                x: "120%",
                                transition: { duration: 1 }
                            }
                        }}
                        initial={{ opacity: 0, x: "-70%" }}
                        className="
      absolute top-0 left-[-50%]
      w-[70%] h-full
      bg-gradient-to-r from-transparent via-white/20 to-transparent
      rotate-12 pointer-events-none
    "
                    />

                    {/* 🧊 Inner card — darker, cleaner */}
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-600/80 text-white font-bold text-xl flex items-center justify-center">
                                {(s.name || "").charAt(0)}
                            </div>

                            <div>
                                <div className="font-semibold text-white">{s.name}</div>
                                <div className="text-sm text-white/60">{s.email}</div>
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-white/50">
                            {s.customFields?.bio || "—"}
                        </div>
                    </div>
                </motion.div>




            ))}
        </div>
    );
};
