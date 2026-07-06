import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Eye, EyeOff, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/" });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message);
      } else {
        navigate({ to: "/" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: { full_name: signupForm.name },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! You can now log in.");
        setTimeout(() => {
          setTab("login");
          setSuccess("");
          setLoginForm({ email: signupForm.email, password: "" });
        }, 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="h-5 w-5 text-[#060a14]" />
        </div>
        <span className="text-xl font-bold text-white">
          Stocketize <span className="text-cyan-400">AI</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

        {/* Tab switcher */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-7">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === "login"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#060a14] shadow-md"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === "signup"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#060a14] shadow-md"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success messages */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === "login" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-sm text-white/40 mt-1">Sign in to access your dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 focus:bg-white/8 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#060a14] font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-white/30 mt-5">
              Don't have an account?{" "}
              <button onClick={() => { setTab("signup"); setError(""); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Sign Up
              </button>
            </p>
          </>
        )}

        {/* SIGNUP FORM */}
        {tab === "signup" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Create account</h2>
              <p className="text-sm text-white/40 mt-1">Join Stocketize AI for free</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-cyan-500/50 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#060a14] font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-white/30 mt-5">
              Already have an account?{" "}
              <button onClick={() => { setTab("login"); setError(""); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Sign In
              </button>
            </p>
          </>
        )}
      </div>

      {/* Features hint */}
      <div className="mt-8 flex items-center gap-6 text-xs text-white/20">
        <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-cyan-500/40" /> Live market data</span>
        <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-cyan-500/40" /> Stock analysis</span>
      </div>
    </div>
  );
}
