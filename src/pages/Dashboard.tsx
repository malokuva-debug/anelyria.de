import { useStore } from "../store/useStore";
import {
  CheckCircle2, Circle,
  ChevronRight, Star
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts";
import { cn } from "../utils/cn";
import {
  OctopusLogo, ChiPositive, ChiNeutral, ChiNegative,
  Coin, LevelBadge, AchievementIcon, RankBadge
} from "../components/icons";

// ===== Circular Progress =====
function CircularProgress({ score, size = 180 }: { score: number; size?: number }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, score);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e4e4e7" />
            <stop offset="100%" stopColor="#a1a1aa" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-white">{score.toFixed(2)}</div>
        <div className="mt-1 text-xs font-medium text-ink-300">
          {score >= 0.85 ? "Excellent!" : score >= 0.80 ? "Great job!" : score >= 0.70 ? "Good progress" : "Keep pushing"}
        </div>
      </div>
    </div>
  );
}

// ===== Donut Chart =====
function DonutChart({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  const total = positive + neutral + negative;
  const size = 150;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const positivePct = positive / total;
  const neutralPct = neutral / total;
  const negativePct = negative / total;

  const positiveLen = circumference * positivePct;
  const neutralLen = circumference * neutralPct;
  const negativeLen = circumference * negativePct;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#6ee7b7" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${positiveLen} ${circumference - positiveLen}`} strokeDashoffset={0} />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#fde047" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${neutralLen} ${circumference - neutralLen}`} strokeDashoffset={-positiveLen} />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#fda4af" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${negativeLen} ${circumference - negativeLen}`} strokeDashoffset={-(positiveLen + neutralLen)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-ink-400">Total</div>
        <div className="text-3xl font-bold text-white">{total}</div>
        <div className="text-xs text-ink-400">CHIs</div>
      </div>
    </div>
  );
}

// ===== Card wrapper =====
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("liquid-glass p-5", className)}>
      {children}
    </div>
  );
}

// ===== Main Dashboard =====
export function Dashboard() {
  const store = useStore();
  const score = store.getCurrentScore();
  const positive = store.getPositiveCount();
  const neutral = store.getNeutralCount();
  const negative = store.getNegativeCount();
  const total = store.getTotalCHIs();
  const level = store.getCurrentLevel();
  const coins = store.getCurrentCoins();
  const monthlyEarned = store.getMonthlyCoinsEarned();
  const nextLevel = store.getNextLevelInfo();
  const inkAvg = store.getInkAverage();
  const inkLevel = store.getInkLevel();
  const inkNextLevel = store.getInkNextLevelInfo();
  const callsAvg = store.getCallsAverage();
  const callsLevel = store.getCallsLevel();
  const callsNextLevel = store.getCallsNextLevelInfo();
  const settings = store.settings;

  const recentCHIs = store.chiEntries.slice(0, 4);
  const activeTasks = store.tasks.filter((t) => t.status === "active").slice(0, 3);
  const trend = store.monthlyTrend;
  const leaderboard = [
    { rank: 1, name: "Sarah Johnson", avatar: "https://i.pravatar.cc/120?img=47", score: 0.93, coins: 3250 },
    { rank: 2, name: "Michael Chen", avatar: "https://i.pravatar.cc/120?img=33", score: 0.88, coins: 2890 },
    { rank: 3, name: "Emily Davis", avatar: "https://i.pravatar.cc/120?img=23", score: 0.86, coins: 2680 },
    { rank: 4, name: "John Doe (You)", avatar: "https://i.pravatar.cc/120?img=12", score: 0.82, coins: 2450, isYou: true },
  ];

  const achievementList = [
    { id: "ach-001", title: "5 Positive CHIs", criteria: "5_positive_chis" as const, status: "Achieved" as const, color: "from-purple-500 to-violet-600" },
    { id: "ach-002", title: "30 Day Streak", criteria: "30_day_streak" as const, status: "In Progress" as const, color: "from-pink-500 to-rose-600", progress: "18 / 30" },
    { id: "ach-003", title: "Top Performer", criteria: "top_performer" as const, status: "Achieved" as const, color: "from-amber-500 to-orange-600" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      {/* Greeting */}
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-white md:text-3xl">
          <span>{greeting}, {store.currentUser.name.split(" ")[0]}!</span>
          <span className="inline-block animate-floaty">
            <OctopusLogo className="h-9 w-9" />
          </span>
        </h1>
        <p className="mt-1 text-sm text-ink-300">Here's your performance overview</p>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {/* CHI Score */}
        <Card className="flex items-center justify-between gap-4">
          <CircularProgress score={score} size={160} />
          <div className="flex-1 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400">Level 1 Bonus</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">0.80</span>
                {score >= 0.80 && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Achieved</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400">Level 2 Bonus</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">0.85</span>
                {score >= 0.85 ? (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Achieved</span>
                ) : (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">In Progress</span>
                )}
              </div>
            </div>
            {nextLevel && (
              <div className="text-[11px] text-ink-400">
                {nextLevel.threshold - score > 0.01
                  ? `${(nextLevel.threshold - score).toFixed(2)} away from Level ${level + 1}`
                  : `Just hit Level ${level}!`
                }
              </div>
            )}
          </div>
        </Card>

        {/* INK Score */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-200">INK Score</h3>
            <span className="text-xs text-ink-400">This Month</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{inkAvg.toFixed(0)}</span>
            <span className="text-sm text-ink-400">/ 100</span>
          </div>
          <div className="mt-3 space-y-2">
            <BonusRow
              level={1}
              threshold={settings.inkLevel1Threshold}
              reward={settings.inkLevel1Reward}
              achieved={inkAvg >= settings.inkLevel1Threshold}
              current={inkAvg}
            />
            <BonusRow
              level={2}
              threshold={settings.inkLevel2Threshold}
              reward={settings.inkLevel2Reward}
              achieved={inkAvg >= settings.inkLevel2Threshold}
              current={inkAvg}
            />
            <BonusRow
              level={3}
              threshold={settings.inkLevel3Threshold}
              reward={settings.inkLevel3Reward}
              achieved={inkAvg >= settings.inkLevel3Threshold}
              current={inkAvg}
            />
          </div>
          {inkLevel > 0 && (
            <div className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-center text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              Level {inkLevel} Achieved
            </div>
          )}
        </Card>

        {/* Calls Per Hour */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-200">Calls / Hour</h3>
            <span className="text-xs text-ink-400">This Month</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{callsAvg.toFixed(0)}</span>
            <span className="text-sm text-ink-400">avg</span>
          </div>
          <div className="mt-3 space-y-2">
            <BonusRow
              level={1}
              threshold={settings.callsLevel1Threshold}
              reward={settings.callsLevel1Reward}
              achieved={callsAvg >= settings.callsLevel1Threshold}
              current={callsAvg}
              isCalls
            />
            <BonusRow
              level={2}
              threshold={settings.callsLevel2Threshold}
              reward={settings.callsLevel2Reward}
              achieved={callsAvg >= settings.callsLevel2Threshold}
              current={callsAvg}
              isCalls
            />
            <BonusRow
              level={3}
              threshold={settings.callsLevel3Threshold}
              reward={settings.callsLevel3Reward}
              achieved={callsAvg >= settings.callsLevel3Threshold}
              current={callsAvg}
              isCalls
            />
          </div>
          {callsLevel > 0 && (
            <div className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-center text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              Level {callsLevel} Achieved
            </div>
          )}
        </Card>

        {/* CHI Breakdown */}
        <Card className="flex items-center justify-between gap-4">
          <DonutChart positive={positive} neutral={neutral} negative={negative} />
          <div className="flex-1 space-y-2.5">
            <Legend color="bg-emerald-500" label="Positive" value={positive} pct={((positive/total)*100).toFixed(0)} />
            <Legend color="bg-amber-500" label="Neutral" value={neutral} pct={((neutral/total)*100).toFixed(0)} />
            <Legend color="bg-pink-500" label="Negative" value={negative} pct={((negative/total)*100).toFixed(0)} />
          </div>
        </Card>

        {/* Octo Coins */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-200">Octo Coins</h3>
            <span className="text-xs text-ink-400">This Month</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{coins.toLocaleString()}</span>
            <Coin className="h-7 w-7" />
          </div>
          <div className="mt-1 text-sm font-medium text-emerald-400">+{monthlyEarned} this month</div>
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={2} fill="url(#coinGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Current Level */}
        <Card className="flex flex-col items-center text-center">
          <h3 className="self-start text-sm font-semibold text-ink-200">Current Level</h3>
          <div className="my-3 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse-glow" />
                <LevelBadge level={Math.max(1, level)} className="h-full w-full" />
              </div>
            </div>
          </div>
          <div className="text-lg font-bold text-white">Level {level}</div>
          <div className="mt-1 text-xs text-ink-300">
            {level >= 2 ? "Outstanding!" : level >= 1 ? "Great work! Keep it up!" : "Almost there!"}
          </div>
        </Card>
      </div>

      {/* Progress to next level - all three metrics */}
      <Card>
        <h3 className="mb-4 text-base font-bold text-white">Progress to Next Bonus Level</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* CHI */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-300">CHI Score</span>
              <span className="text-sm font-bold tabular-nums text-white">{score.toFixed(2)} / {nextLevel ? nextLevel.threshold.toFixed(2) : "✓ Max"}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink-800">
              <div
                className="gradient-bar h-full rounded-full transition-all"
                style={{ width: `${Math.min(1, nextLevel ? nextLevel.progress : 1) * 100}%` }}
              />
            </div>
            {nextLevel ? (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-400">
                <span>Need {nextLevel.neededPositives} more positive CHIs</span>
                <span className="font-semibold text-emerald-400">Level {level + 1}</span>
              </div>
            ) : (
              <div className="mt-1.5 text-[11px] font-semibold text-emerald-400">✓ All CHI levels achieved</div>
            )}
          </div>

          {/* INK */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-300">INK Score</span>
              <span className="text-sm font-bold tabular-nums text-white">{inkAvg.toFixed(0)} / {inkNextLevel ? inkNextLevel.threshold : "✓ Max"}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all"
                style={{ width: `${Math.min(1, inkNextLevel ? inkNextLevel.progress : 1) * 100}%` }}
              />
            </div>
            {inkNextLevel ? (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-400">
                <span>Need {Math.max(0, Math.ceil(inkNextLevel.threshold - inkAvg))} more INK points</span>
                <span className="font-semibold text-emerald-400">Level {inkLevel + 1}</span>
              </div>
            ) : (
              <div className="mt-1.5 text-[11px] font-semibold text-emerald-400">✓ All INK levels achieved</div>
            )}
          </div>

          {/* Calls */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-300">Calls/Hour</span>
              <span className="text-sm font-bold tabular-nums text-white">{callsAvg.toFixed(0)} / {callsNextLevel ? callsNextLevel.threshold : "✓ Max"}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all"
                style={{ width: `${Math.min(1, callsNextLevel ? callsNextLevel.progress : 1) * 100}%` }}
              />
            </div>
            {callsNextLevel ? (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-400">
                <span>Need {Math.max(0, Math.ceil(callsNextLevel.threshold - callsAvg))} more calls/hr</span>
                <span className="font-semibold text-emerald-400">Level {callsLevel + 1}</span>
              </div>
            ) : (
              <div className="mt-1.5 text-[11px] font-semibold text-emerald-400">✓ All Calls levels achieved</div>
            )}
          </div>
        </div>
      </Card>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* How to level up */}
        <Card>
          <h3 className="mb-4 text-base font-bold text-white">How to Level Up</h3>
          <div className="space-y-3">
            <ChecklistItem done={score >= 0.80} title={`Maintain a CHI score of 0.80`} subtitle="Achieved Level 1" accent="emerald" />
            <ChecklistItem
              done={score >= 0.85}
              title="Reach a CHI score of 0.85"
              subtitle={`You need ${nextLevel?.neededPositives ?? 0} more positive CHIs`}
              progress={`${score.toFixed(2)} / 0.85`}
              accent="purple"
            />
            <ChecklistItem
              done={score >= 0.90}
              title="Reach a CHI score of 0.90"
              subtitle="Level 3 Bonus"
              progress={`${score.toFixed(2)} / 0.90`}
              accent="pink"
            />
          </div>
          <button className="glass-btn mt-4 w-full rounded-xl py-2 text-sm font-medium text-white flex items-center justify-center gap-2">
            View full breakdown <ChevronRight className="h-4 w-4" />
          </button>
        </Card>

        {/* Recent CHIs */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent CHIs</h3>
            <button onClick={() => useStore.setState({ currentPage: "chis" })} className="text-xs font-medium text-white hover:text-zinc-300">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentCHIs.map((chi) => (
              <div key={chi.id} className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg",
                  chi.type === "positive" && "bg-emerald-500/20",
                  chi.type === "neutral" && "bg-amber-500/20",
                  chi.type === "negative" && "bg-pink-500/20",
                )}>
                  {chi.type === "positive" && <ChiPositive className="h-5 w-5" />}
                  {chi.type === "neutral" && <ChiNeutral className="h-5 w-5" />}
                  {chi.type === "negative" && <ChiNegative className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white capitalize">
                    {chi.type} CHI
                  </div>
                  <div className="truncate text-xs text-ink-400">{chi.notes}</div>
                </div>
                <div className="text-xs text-ink-400 whitespace-nowrap">
                  {chi.date === "2024-05-28" ? "Today" : chi.date === "2024-05-27" ? "Yesterday" : `${chi.date.split("-")[2]}d ago`}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Tasks */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Tasks</h3>
            <button onClick={() => useStore.setState({ currentPage: "tasks" })} className="text-xs font-medium text-white hover:text-zinc-300">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {activeTasks.map((task) => {
              const pct = Math.min(1, task.progress / task.target);
              return (
                <div key={task.id}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{task.title}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                          <div className="gradient-bar h-full rounded-full" style={{ width: `${pct * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-ink-300 whitespace-nowrap">
                          {Math.round(task.progress)}/{task.target}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-amber-400">{task.rewardCoins} Octo Coins</div>
                      <div className="text-[10px] text-ink-400">
                        {Math.ceil((new Date(task.endDate).getTime() - Date.now()) / 86400000)} days left
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Monthly Trend */}
        <Card className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Monthly Trend</h3>
            <span className="text-xs text-ink-400">This Month</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a1a1aa" />
                    <stop offset="50%" stopColor="#e4e4e7" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  labelStyle={{ color: "#fafafa" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <ReferenceLine y={0.80} stroke="#6ee7b7" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={0.85} stroke="#fde047" strokeDasharray="4 4" strokeWidth={1.5} />
                <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "#ffffff", r: 4, stroke: "#000" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Team Leaderboard */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Team Leaderboard</h3>
            <span className="text-xs text-ink-400">This Month</span>
          </div>
          <div className="space-y-2">
            {leaderboard.map((p) => (
              <div
                key={p.rank}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                  p.isYou ? "bg-white/5 ring-1 ring-white/20" : "hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm",
                  p.rank === 1 && "bg-amber-500/20 text-amber-400",
                  p.rank === 2 && "bg-slate-400/20 text-slate-300",
                  p.rank === 3 && "bg-orange-600/20 text-orange-400",
                  p.rank === 4 && "bg-white/10 text-white",
                )}>
                  <RankBadge rank={p.rank} className="h-6 w-6" />
                </div>
                <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-ink-700" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{p.name}</div>
                </div>
                <div className="text-sm font-bold text-white">{p.score.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                  {p.coins.toLocaleString()} <Coin className="h-4 w-4" />
                </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Achievements</h3>
            <button onClick={() => useStore.setState({ currentPage: "achievements" })} className="text-xs font-medium text-white hover:text-zinc-300">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {achievementList.map((ach) => (
              <div key={ach.id} className="flex flex-col items-center text-center">
                <div className={cn(
                  "relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg",
                  ach.status === "Achieved" ? "ring-2 ring-emerald-400/50" : "opacity-70"
                )}>
                  <AchievementIcon criteria={ach.criteria} className="h-16 w-16" />
                  {ach.status === "Achieved" && (
                    <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 text-white ring-2 ring-ink-900" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold text-white leading-tight">{ach.title}</div>
                <div className={cn(
                  "mt-0.5 text-[10px] font-medium",
                  ach.status === "Achieved" ? "text-emerald-400" : "text-ink-400"
                )}>
                  {ach.status === "In Progress" ? ach.progress : ach.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===== Sub components =====
function Legend({ color, label, value, pct }: { color: string; label: string; value: number; pct: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-ink-300">{label}</span>
      <span className="ml-auto font-semibold text-white">{value}</span>
      <span className="text-xs text-ink-400 w-12 text-right">({pct}%)</span>
    </div>
  );
}

function BonusRow({ level, threshold, reward, achieved, current, isCalls = false }: {
  level: number;
  threshold: number;
  reward: number;
  achieved: boolean;
  current: number;
  isCalls?: boolean;
}) {
  const displayThreshold = isCalls ? threshold.toString() : threshold.toFixed(2);
  return (
    <div className="flex items-center justify-between rounded-lg bg-ink-800/40 px-2.5 py-1.5 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-ink-400">L{level}</span>
        <span className="text-ink-200">{displayThreshold}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-medium">+{reward}</span>
        {achieved ? (
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">✓</span>
        ) : (
          <span className="rounded-full bg-ink-700 px-1.5 py-0.5 text-[9px] font-medium text-ink-400">
            {isCalls ? Math.max(0, Math.ceil(threshold - current)) : Math.max(0, (threshold - current)).toFixed(2)} away
          </span>
        )}
      </div>
    </div>
  );
}

function ChecklistItem({ done, title, subtitle, progress }: {
  done: boolean;
  title: string;
  subtitle: string;
  progress?: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        done ? "bg-white text-black" : "bg-white/10 text-white"
      )}>
        {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-ink-400">{subtitle}</div>
      </div>
      {progress && <div className="text-sm font-semibold text-ink-200">{progress}</div>}
    </div>
  );
}
