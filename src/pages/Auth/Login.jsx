// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    const resetForm = (keepMode = false) => {
        setFormData({ email: "", password: "" });
        setError("");
        if (!keepMode) {
            setIsSignUp(false);
            setIsAdmin(false);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError("");

        // Admin login (right form)
        if (isAdmin) {
            if (!formData.email || !formData.password) {
                setError("Please fill in both email and password.");
                return;
            }
            setLoading(true);
            try {
                const res = await Promise.resolve(login(formData.email.trim(), formData.password));
                if (!res) setError("Invalid admin credentials. Please try again.");
                else navigate("/dashboard", { replace: true });
            } catch (err) {
                console.error("admin login error", err);
                setError("Login failed. Try again.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Student sign-in (left)
        if (!isSignUp) {
            if (!formData.email || !formData.password) {
                setError("Please fill in both email and password.");
                return;
            }
            setLoading(true);
            try {
                const res = await Promise.resolve(login(formData.email.trim(), formData.password));
                if (!res) setError("Invalid credentials. Please try again.");
                else navigate("/dashboard", { replace: true });
            } catch (err) {
                console.error("login error", err);
                setError("Login failed. Try again.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Sign up placeholder if needed
        if (isSignUp && !isAdmin) {
            if (!formData.email || !formData.password) {
                setError("Please fill in all fields to sign up.");
                return;
            }
            setError("Sign up functionality - Coming soon!");
        }
    };

    // apple easing shorthand used multiple times
    const apple = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#050513] to-[#120421] flex items-center justify-center p-6 text-white">
            {/* background soft glows */}
            <div className="absolute -z-10 top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-700/20 blur-[140px]" />
            <div className="absolute -z-10 right-[-10%] bottom-[-10%] w-[520px] h-[520px] rounded-full bg-purple-600/18 blur-[160px]" />

            <div className="relative w-full max-w-3xl h-[520px] mx-auto rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2">
                {/* LEFT PANEL: subtle Apple animation when switching */}
                <div
                    className={`p-10 flex flex-col justify-center ${apple} ${isSignUp ? "opacity-80 scale-[0.985] -translate-x-2" : "opacity-100 scale-100 translate-x-0"
                        } bg-white/5`}
                >
                    {!isSignUp ? (
                        <>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-100">Sign In</h2>
                            <p className="text-sm text-white/70 mb-6">Use your account to access the dashboard</p>

                            <p className="text-sm text-white/60 mb-6">Or sign in with your email</p>

                            {error && (
                                <div className="mb-4 rounded-lg bg-red-700/10 border border-red-700/20 p-3 text-red-300 text-sm">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    required
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>
                            </form>

                            <div className="mt-6 text-sm text-white/50">
                                <div className="mb-2 font-medium">Demo credentials</div>
                                <div className="text-xs">Admin: admin@school.com / admin123</div>
                                <div className="text-xs">Student: john@student.com / john123</div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Welcome, Student Login!</h2>
                            <p className="text-white/80 mb-6"></p>
                            <button
                                onClick={() => {
                                    setIsSignUp(false);
                                    setIsAdmin(false);
                                    resetForm(true);
                                }}
                                className="px-8 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition"
                            >
                                Back to Student Login
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: greeting OR admin form. both crossfade & slide with Apple easing */}
                <div className={`relative p-10 flex items-center justify-center ${apple} bg-[#070712]/60`}>
                    {/* GREETING */}
                    <div
                        className={`${apple} max-w-md text-center ${isSignUp
                            ? "opacity-0 translate-x-6 scale-[0.985] pointer-events-none"
                            : "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                            }`}
                    >
                        <h3 className="text-3xl font-bold mb-3 text-white">Hello, Admin!</h3>
                        <p className="text-white/70 mb-6">Admin Login This side</p>
                        <button
                            onClick={() => {
                                setIsSignUp(true);
                                setIsAdmin(true);
                                resetForm(true);
                            }}
                            className="px-10 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold hover:shadow-lg transform hover:scale-105 transition"
                        >
                            Admin Login
                        </button>
                    </div>

                    {/* ADMIN FORM */}
                    <div
                        className={`${apple} absolute inset-0 flex items-center justify-center ${isSignUp
                            ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                            : "opacity-0 translate-x-6 scale-[0.985] pointer-events-none"
                            }`}
                        style={{ zIndex: isSignUp ? 40 : 10 }}
                    >
                        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg mx-4">
                            <h3 className="text-2xl font-semibold mb-3 text-white">Admin Account</h3>
                            <p className="text-white/70 mb-4">Use email and password</p>

                            {error && (
                                <div className="mb-4 rounded-lg bg-red-700/10 border border-red-700/20 p-3 text-red-300 text-sm">{error}</div>
                            )}

                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    required
                                />

                                <div className="flex gap-3">



                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold hover:shadow-lg transform hover:scale-105 transition"
                                    >
                                        Admin Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
