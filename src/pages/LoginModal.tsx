import { useState } from "react";
import { useStore } from "../store/useStore";
import { AnelyriaLogo } from "../components/icons";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "john.doe@anelyria.com", name: "John Doe", role: "Employee", password: "password123" },
  { email: "sarah.johnson@anelyria.com", name: "Sarah Johnson", role: "Team Lead", password: "password123" },
  { email: "alex.martinez@anelyria.com", name: "Alex Martinez", role: "Manager", password: "password123" },
  { email: "priya.patel@anelyria.com", name: "Priya Patel", role: "Admin", password: "password123" },
];

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, showForgotPasswordModal, setShowForgotPasswordModal, login, requestPasswordReset } = useStore();
  const [email, setEmail] = useState("john.doe@anelyria.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  if (!showLoginModal) return null;

  // Forgot Password Screen
  if (showForgotPasswordModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowForgotPasswordModal(false)} />
        <div className="liquid-glass-strong relative w-full max-w-md animate-fadeIn">
          <button onClick={() => { setShowForgotPasswordModal(false); setResetSent(false); setResetEmail(""); }} className="absolute left-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setShowForgotPasswordModal(false)} className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>

          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500">
                  <Mail className="h-7 w-7 text-white" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Reset your password</h2>
              <p className="mt-2 text-sm text-zinc-400">Enter your email and we'll send you a secure reset link.</p>
            </div>

            {resetSent ? (
              <div className="mt-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="mt-4 font-semibold text-white">Check your email</h3>
                <p className="mt-2 text-sm text-zinc-400">If an account exists for <span className="text-white">{resetEmail}</span>, you will receive a password reset link shortly.</p>
                <button onClick={() => { setResetSent(false); setResetEmail(""); }} className="btn-glass mt-6 w-full rounded-xl py-3 text-sm font-semibold">
                  Try another email
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); requestPasswordReset(resetEmail); setResetSent(true); }} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="glass-input w-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-500" placeholder="you@company.com" required />
                  </div>
                </div>
                <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2 py-3">
                  Send Reset Link <Mail className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError("Invalid credentials. Try one of the demo accounts below.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={() => setShowLoginModal(false)}
      />

      {/* Modal */}
      <div className="liquid-glass-strong relative w-full max-w-md animate-fadeIn">
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl" />
              <AnelyriaLogo className="relative h-14 w-14" />
            </div>
            <h2 className="gradient-text mt-4 text-2xl font-bold tracking-wider">ANELYRIA</h2>
            <p className="mt-1 text-sm text-zinc-400">Sign in to your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-500"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full py-3 pl-10 pr-10 text-white placeholder:text-zinc-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-300 ring-1 ring-red-500/20">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-600 bg-transparent" />
                Remember me
              </label>
              <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="hover:text-white transition-colors">
                Forgot password?
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-zinc-500">Demo Accounts</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Demo Accounts */}
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="btn-glass flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-xs font-bold text-purple-300">
                    {account.role[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{account.email}</div>
                    <div className="text-xs text-zinc-500">{account.role}</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
