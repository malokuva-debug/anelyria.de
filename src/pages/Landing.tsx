import { useStore } from "../store/useStore";
import { AnelyriaLogo } from "../components/icons";
import { ArrowRight, Shield, Zap, Trophy, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

export function LandingPage({ onLoginClick }: { onLoginClick?: () => void }) {
  const { setShowLoginModal } = useStore();
  const handleLogin = () => {
    if (onLoginClick) onLoginClick();
    else setShowLoginModal(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient Blobs */}
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />

      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <AnelyriaLogo className="h-10 w-10" />
          <div className="leading-tight">
            <div className="gradient-text text-xl font-bold tracking-[0.2em]">ANELYRIA</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Performance Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white md:block">
            Features
          </button>
          <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white md:block">
            Pricing
          </button>
          <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white md:block">
            Docs
          </button>
          <button
            onClick={handleLogin}
            className="btn-glass rounded-full px-5 py-2 text-sm font-semibold"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-10 md:px-12">
        <div className="w-full max-w-6xl">
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-white/10 backdrop-blur-xl mb-8">
              <Sparkles className="h-3 w-3 text-purple-300" />
              <span>Now in Beta — Join the waitlist</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              <span className="gradient-text">Performance,</span>
              <br />
              <span className="text-white">Perfected.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
              The enterprise platform that transforms how teams track performance,
              earn rewards, and celebrate achievements. Built for scale.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleLogin}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-base font-semibold"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-glass rounded-[14px] px-8 py-4 text-base font-semibold">
                Watch Demo
              </button>
            </div>

            {/* Preview glass card */}
            <div className="relative mx-auto mt-16 max-w-4xl animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-fuchsia-500/30 to-purple-500/30 blur-3xl opacity-50" />
              <div className="liquid-glass-strong p-4 md:p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-zinc-500">app.anelyria.io/dashboard</span>
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-4 md:p-6">
                  <StatCard label="CHI Score" value="0.87" trend="+0.05" />
                  <StatCard label="Level" value="2" trend="Achieved" accent="purple" />
                  <StatCard label="Coins" value="2,450" trend="+320" accent="amber" />
                  <StatCard label="Streak" value="18d" trend="Personal best" accent="orange" />
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
                  <MiniChart />
                  <LeaderboardPreview />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-24 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Real-time CHI Tracking"
                description="Live performance metrics with intelligent scoring and automatic bonus qualification."
              />
              <FeatureCard
                icon={<Trophy className="h-6 w-6" />}
                title="Gamified Rewards"
                description="Earn Anelyria Coins, unlock achievements, and compete on leaderboards with your team."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Enterprise-Grade"
                description="Role-based access, audit logs, CSV imports, and admin controls built for scale."
              />
            </div>

            {/* Trust bar */}
            <div className="mt-20 text-center">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Trusted by forward-thinking teams</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
                {["ACME Corp", "Globex", "Initech", "Umbrella", "Wayne Ent.", "Stark Ind."].map((name) => (
                  <div key={name} className="text-lg font-bold tracking-wider text-zinc-500">
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="mt-32">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-white/10 mb-4">
                  Simple Setup
                </div>
                <h2 className="text-4xl font-bold text-white md:text-5xl">Up and running in minutes</h2>
                <p className="mx-auto mt-4 max-w-2xl text-zinc-400">Four steps to transform your team's performance culture.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { step: "01", title: "Create Tenant", desc: "Set up your organization with custom branding and metric names." },
                  { step: "02", title: "Invite Team", desc: "Add employees by ID or email. Assign roles: employee, lead, manager, admin." },
                  { step: "03", title: "Import Metrics", desc: "Upload CHI, INK, and Calls-per-hour data via CSV or API." },
                  { step: "04", title: "Track & Reward", desc: "Watch performance climb. Reward top performers automatically." },
                ].map((s) => (
                  <div key={s.step} className="liquid-glass p-6">
                    <div className="gradient-text text-4xl font-bold tabular-nums">{s.step}</div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="mt-32">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-white/10 mb-4">
                  <Shield className="h-3 w-3 text-emerald-400" /> Enterprise Security
                </div>
                <h2 className="text-4xl font-bold text-white md:text-5xl">Built for compliance</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Role-Based Access", desc: "Employees, Team Leads, Managers, and Admins each see only what they need." },
                  { title: "Full Audit Trail", desc: "Every action logged — CSV uploads, user changes, reward redemptions, settings updates." },
                  { title: "Secure Authentication", desc: "BCrypt password hashing, password reset flows, session management, CSRF protection." },
                  { title: "MariaDB Backend", desc: "Production-ready relational database, deployable on Plesk hosting or any cloud provider." },
                  { title: "Multi-Tenant Isolation", desc: "Each organization's data is fully isolated by tenant ID at every query." },
                  { title: "Configurable Policies", desc: "Set password complexity, session timeouts, billing intervals, and bonus thresholds." },
                ].map((s) => (
                  <div key={s.title} className="liquid-glass p-6">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 ring-1 ring-emerald-400/30">
                      <Shield className="h-5 w-5 text-emerald-300" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-32">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-white/10 mb-4">
                  Pricing
                </div>
                <h2 className="text-4xl font-bold text-white md:text-5xl">Simple, transparent pricing</h2>
                <p className="mx-auto mt-4 max-w-2xl text-zinc-400">Start free. Scale as you grow.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { name: "Starter", price: "$0", period: "forever", features: ["Up to 25 employees", "Basic CHI tracking", "Reward shop", "CSV import", "Email support"], cta: "Start Free", highlighted: false },
                  { name: "Professional", price: "$8", period: "/user/month", features: ["Unlimited employees", "CHI + INK + Calls metrics", "Custom billing intervals", "Advanced analytics", "Team leaderboards", "Priority support"], cta: "Start Trial", highlighted: true },
                  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "SSO / SAML", "Custom integrations", "Dedicated account manager", "SLA guarantee", "On-premise option"], cta: "Contact Sales", highlighted: false },
                ].map((p) => (
                  <div key={p.name} className={cn("liquid-glass p-6", p.highlighted && "ring-2 ring-purple-400/40")}>
                    {p.highlighted && <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Most Popular</div>}
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{p.price}</span>
                      <span className="text-sm text-zinc-400">{p.period}</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-purple-300"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleLogin} className={cn("mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-colors", p.highlighted ? "btn-primary" : "btn-glass")}>
                      {p.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-32">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-white/10 mb-4">
                  FAQ
                </div>
                <h2 className="text-4xl font-bold text-white md:text-5xl">Frequently asked questions</h2>
              </div>
              <div className="mx-auto max-w-3xl space-y-4">
                {[
                  { q: "What is CHI?", a: "CHI (Customer Happiness Index) measures customer interaction quality. Each interaction is scored positive, neutral, or negative. The CHI score formula is (Positive - Negative) / Total." },
                  { q: "What are INK and Calls?", a: "INK tracks knowledge/quality scores (0-100). Calls tracks calls-per-hour productivity. Both can be imported alongside CHI in a single CSV." },
                  { q: "Can we customize metric names?", a: "Yes. The admin panel lets managers rename CHI, INK, Calls, and even Coins to match internal terminology." },
                  { q: "How does multi-tenant work?", a: "Every query is scoped by tenant ID. Each organization has isolated users, metrics, rewards, and settings. Deploy one instance, serve many clients." },
                  { q: "Can we choose our billing period?", a: "Yes. Managers choose any interval: 1st-31st, 26th-25th, or any custom range." },
                  { q: "Is my data secure?", a: "Passwords are BCrypt-hashed. Sessions are server-side. All actions are audited. The platform runs on MariaDB with encrypted connections." },
                ].map((f) => (
                  <details key={f.q} className="liquid-glass group p-5">
                    <summary className="flex cursor-pointer items-center justify-between font-medium text-white">
                      {f.q}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></svg>
                    </summary>
                    <p className="mt-3 text-sm text-zinc-400">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-32 text-center">
              <div className="liquid-glass-strong mx-auto max-w-3xl p-12">
                <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to transform performance?</h2>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">Join thousands of teams using Anelyria to drive engagement, reward excellence, and scale performance culture.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button onClick={handleLogin} className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-semibold">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="btn-glass rounded-[14px] px-8 py-3 text-sm font-semibold">Book a Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-xs text-zinc-500 md:px-12">
        © 2026 Anelyria. All rights reserved. · Privacy · Terms
      </footer>
    </div>
  );
}

function StatCard({ label, value, trend, accent = "green" }: {
  label: string; value: string; trend: string; accent?: string;
}) {
  return (
    <div className="liquid-glass p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className={`mt-1 text-xs font-medium ${
        accent === "green" ? "text-emerald-400" :
        accent === "purple" ? "text-purple-300" :
        accent === "amber" ? "text-amber-300" : "text-orange-300"
      }`}>{trend}</div>
    </div>
  );
}

function MiniChart() {
  return (
    <div className="liquid-glass p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white">Monthly Trend</div>
        <span className="text-xs text-zinc-400">This Month</span>
      </div>
      <div className="flex items-end gap-1 h-24">
        {[40, 55, 45, 65, 58, 72, 68, 80, 75, 88, 82, 87].map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-purple-600 to-purple-400"
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function LeaderboardPreview() {
  const data = [
    { name: "Sarah J.", score: "0.94", rank: 1 },
    { name: "Michael C.", score: "0.89", rank: 2 },
    { name: "Emily D.", score: "0.87", rank: 3 },
  ];
  return (
    <div className="liquid-glass p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white">Top Performers</div>
        <Trophy className="h-4 w-4 text-purple-400" />
      </div>
      <div className="space-y-2">
        {data.map((p) => (
          <div key={p.rank} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-xs font-bold text-purple-300">
              {p.rank}
            </div>
            <div className="flex-1 text-sm text-white">{p.name}</div>
            <div className="text-sm font-semibold tabular-nums text-white">{p.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="liquid-glass p-6 text-left">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 text-purple-300 ring-1 ring-purple-400/30">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
