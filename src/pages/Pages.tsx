import { useState } from "react";
import { useStore } from "../store/useStore";
import { cn } from "../utils/cn";
import {
  CheckCircle2, Star, Trophy,
  Upload, Check, AlertCircle, Download, Plus, Eye,
  Shield, Settings as SettingsIcon, User,
  Gift, Clock, X, Trash2, TrendingUp, BarChart3
} from "lucide-react";
import {
  ChiPositive, ChiNeutral, ChiNegative, Coin, Flame,
  AchievementIcon, RankBadge,
  IconAchievement, IconBonus, IconTask, IconRedemption, IconImport, IconInfo,
  RewardCategoryIcon
} from "../components/icons";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  Legend as RLegend
} from "recharts";
import { USERS, TEAMS, formatDate } from "../data/mockData";
import type { ChiType } from "../types";

// Shared card
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("liquid-glass p-5", className)}>{children}</div>;
}

// Settings field (number or text input)
function SettingsField({ field, onUpdate }: {
  field: { label: string; key: string; value: any; step?: number | null; suffix?: string };
  onUpdate: (updates: any) => void;
}) {
  const isNumber = field.step !== null && field.step !== undefined;
  const step = field.step === null ? undefined : (field.step ?? 1);
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5">
      <label className="text-sm text-ink-200">
        {field.label}
        {field.suffix && <span className="ml-1 text-xs text-ink-400">{field.suffix}</span>}
      </label>
      <input
        type={isNumber ? "number" : "text"}
        step={step}
        defaultValue={field.value}
        onBlur={(e) => onUpdate({ [field.key]: isNumber ? parseFloat(e.target.value) : e.target.value })}
        className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-right text-sm text-white focus:border-purple-400/50 focus:outline-none"
      />
    </div>
  );
}

function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-300">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

// ===== Performance Page =====
export function PerformancePage() {
  const store = useStore();
  const positive = store.getPositiveCount();
  const neutral = store.getNeutralCount();
  const negative = store.getNegativeCount();
  const total = store.getTotalCHIs();
  const trend = store.monthlyTrend;

  const stats = [
    { label: "Positive", value: positive, color: "emerald" },
    { label: "Neutral", value: neutral, color: "amber" },
    { label: "Negative", value: negative, color: "pink" },
    { label: "Total", value: total, color: "purple" },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader title="My Performance" subtitle="Detailed view of your CHI performance metrics" />

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-xs uppercase tracking-wider text-ink-400">{s.label}</div>
            <div className={cn(
              "mt-2 text-3xl font-bold",
              s.color === "emerald" && "text-emerald-400",
              s.color === "amber" && "text-amber-400",
              s.color === "pink" && "text-pink-400",
              s.color === "purple" && "text-brand-400",
            )}>{s.value}</div>
            <div className="mt-1 text-xs text-ink-400">{((s.value/total)*100).toFixed(0)}% of total</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-bold text-white">CHI Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2252" />
                <XAxis dataKey="date" tick={{ fill: "#9498c4", fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fill: "#9498c4", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#14173b", border: "1px solid #1f2252", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={3} dot={{ fill: "#ffffff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Positive vs Negative</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2252" />
                <XAxis dataKey="date" tick={{ fill: "#9498c4", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9498c4", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#14173b", border: "1px solid #1f2252", borderRadius: 8 }} />
                <RLegend wrapperStyle={{ color: "#e3e5f2" }} />
                <Bar dataKey="positive" fill="#22c55e" name="Positive" />
                <Bar dataKey="negative" fill="#ec4899" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-bold text-white">Streak & Engagement</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="h-8 w-8" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{store.currentUser.streakDays}</div>
              <div className="text-xs text-ink-400">Current Streak (days)</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">+0.07</div>
              <div className="text-xs text-ink-400">Improvement vs last month</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <ChiPositive className="h-8 w-8" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-ink-400">CHIs this month</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===== CHIs Page =====
export function CHIsPage() {
  const store = useStore();
  const [filter, setFilter] = useState<ChiType | "all">("all");
  const filtered = filter === "all" ? store.chiEntries : store.chiEntries.filter((c) => c.type === filter);

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="CHI Entries"
        subtitle={`${filtered.length} entries this month`}
        actions={
          <div className="flex gap-2">
            {(["all", "positive", "neutral", "negative"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  filter === f ? "bg-white text-black" : "glass-btn text-zinc-300"
                )}
              >{f}</button>
            ))}
          </div>
        }
      />

      <Card>
        <div className="divide-y divide-ink-800">
          {filtered.map((chi) => (
            <div key={chi.id} className="flex items-center gap-4 py-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-xl",
                chi.type === "positive" && "bg-emerald-500/20",
                chi.type === "neutral" && "bg-amber-500/20",
                chi.type === "negative" && "bg-pink-500/20",
              )}>
                {chi.type === "positive" && <ChiPositive className="h-6 w-6" />}
                {chi.type === "neutral" && <ChiNeutral className="h-6 w-6" />}
                {chi.type === "negative" && <ChiNegative className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white capitalize">{chi.type} CHI</span>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-medium text-ink-300">{chi.category}</span>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-medium text-ink-400 capitalize">{chi.source}</span>
                </div>
                <div className="text-sm text-ink-300">{chi.notes}</div>
              </div>
              <div className="text-sm text-ink-400">{formatDate(chi.date)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===== Tasks Page =====
export function TasksPage() {
  const store = useStore();
  const [tab, setTab] = useState<"active" | "completed" | "all">("active");
  const filtered = tab === "all" ? store.tasks : store.tasks.filter((t) => t.status === tab);

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Tasks & Challenges"
        subtitle="Track your progress and earn rewards"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
            <Plus className="h-4 w-4" /> New Task
          </button>
        }
      />

      <div className="flex gap-2">
        {(["active", "completed", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-white text-black" : "glass-btn text-zinc-300"
            )}
          >{t}</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((task) => {
          const pct = Math.min(1, task.progress / task.target);
          const daysLeft = Math.ceil((new Date(task.endDate).getTime() - Date.now()) / 86400000);
          return (
            <Card key={task.id} className="animate-slideUp">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Star className="h-5 w-5 fill-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{task.title}</h3>
                    <p className="text-xs text-ink-400">{task.description}</p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-semibold uppercase",
                  task.status === "active" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                )}>{task.status}</span>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-300">Progress</span>
                  <span className="font-semibold text-white">{Math.round(task.progress)}/{task.target}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                  <div className="gradient-bar h-full rounded-full transition-all" style={{ width: `${pct * 100}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-ink-800 pt-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-ink-400"><Clock className="mr-1 inline h-3 w-3" />{daysLeft}d left</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Coin className="h-4 w-4" /> {task.rewardCoins}
                  </span>
                </div>
                {task.approvalRequired && (
                  <span className="text-ink-400">Requires approval</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===== Rewards Shop =====
export function RewardsShopPage() {
  const store = useStore();
  const [cat, setCat] = useState<string>("all");
  const categories = [
    { id: "all", label: "All" },
    { id: "gift_cards", label: "Gift Cards" },
    { id: "merch", label: "Merchandise" },
    { id: "perks", label: "Perks" },
    { id: "experiences", label: "Experiences" },
  ];
  const filtered = cat === "all" ? store.rewards : store.rewards.filter((r) => r.category === cat && r.active);
  const coins = store.getCurrentCoins();

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Rewards Shop"
        subtitle={
          <span className="inline-flex items-center gap-2">
            You have <Coin className="inline h-5 w-5" />{coins.toLocaleString()} Octo Coins
          </span>
        }
        actions={
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 ring-1 ring-amber-500/30">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-bold text-amber-400">{coins.toLocaleString()}</span>
          </div>
        }
      />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              cat === c.id ? "bg-white text-black" : "glass-btn text-zinc-300"
            )}
          >{c.label}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((reward) => {
          const canAfford = coins >= reward.coinPrice;
          return (
            <div key={reward.id} className="card overflow-hidden group">
              <div className="relative h-40 overflow-hidden bg-ink-800">
                <img src={reward.image} alt={reward.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-ink-900/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                  <Coin className="h-4 w-4" />{reward.coinPrice}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 text-[10px] uppercase tracking-wider text-ink-400">{reward.category.replace("_", " ")}</div>
                <h3 className="font-bold text-white">{reward.title}</h3>
                <p className="mt-1 text-xs text-ink-400 line-clamp-2">{reward.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-ink-400">{reward.stock} in stock</span>
                  <button
                    disabled={!canAfford}
                    onClick={() => store.redeemReward(reward.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      canAfford ? "bg-white text-black hover:bg-zinc-200" : "bg-white/5 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    {canAfford ? "Redeem" : "Not enough"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== My Rewards =====
export function MyRewardsPage() {
  const store = useStore();
  const myRedemptions = store.redemptions.filter((r) => r.userId === store.currentUser.id);

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader title="My Rewards" subtitle="Your reward redemptions and history" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Pending</div>
          <div className="mt-2 text-3xl font-bold text-amber-400">
            {myRedemptions.filter((r) => r.status === "pending").length}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Approved</div>
          <div className="mt-2 text-3xl font-bold text-brand-400">
            {myRedemptions.filter((r) => r.status === "approved").length}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Fulfilled</div>
          <div className="mt-2 text-3xl font-bold text-emerald-400">
            {myRedemptions.filter((r) => r.status === "fulfilled").length}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-bold text-white">Redemption History</h3>
        {myRedemptions.length === 0 ? (
          <div className="py-12 text-center text-ink-400">
            <Gift className="mx-auto mb-3 h-12 w-12 opacity-30" />
            <p>No redemptions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-800">
            {myRedemptions.map((r) => {
              const reward = store.rewards.find((rw) => rw.id === r.rewardId);
              return (
                <div key={r.id} className="flex items-center gap-4 py-3">
                  {reward && <img src={reward.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <div className="font-semibold text-white">{reward?.title || "Reward"}</div>
                    <div className="text-xs text-ink-400">{formatDate(r.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-amber-400">
                      -{r.coinsSpent} <Coin className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      r.status === "pending" && "bg-amber-500/20 text-amber-400",
                      r.status === "approved" && "bg-brand-500/20 text-brand-400",
                      r.status === "fulfilled" && "bg-emerald-500/20 text-emerald-400",
                    )}>{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ===== Leaderboards =====
export function LeaderboardsPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("monthly");
  const data = [
    { rank: 1, name: "Sarah Johnson", avatar: "https://i.pravatar.cc/120?img=47", score: 0.93, coins: 3250, positive: 58, tasks: 12 },
    { rank: 2, name: "Michael Chen", avatar: "https://i.pravatar.cc/120?img=33", score: 0.88, coins: 2890, positive: 52, tasks: 10 },
    { rank: 3, name: "Emily Davis", avatar: "https://i.pravatar.cc/120?img=23", score: 0.86, coins: 2680, positive: 48, tasks: 9 },
    { rank: 4, name: "John Doe (You)", avatar: "https://i.pravatar.cc/120?img=12", score: 0.82, coins: 2450, positive: 36, tasks: 7, isYou: true },
    { rank: 5, name: "Alex Martinez", avatar: "https://i.pravatar.cc/120?img=68", score: 0.79, coins: 2200, positive: 32, tasks: 6 },
    { rank: 6, name: "Priya Patel", avatar: "https://i.pravatar.cc/120?img=16", score: 0.76, coins: 1980, positive: 29, tasks: 5 },
    { rank: 7, name: "Liam O'Connor", avatar: "https://i.pravatar.cc/120?img=51", score: 0.72, coins: 1650, positive: 24, tasks: 4 },
    { rank: 8, name: "Sophie Williams", avatar: "https://i.pravatar.cc/120?img=29", score: 0.68, coins: 1420, positive: 20, tasks: 3 },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader title="Leaderboards" subtitle="Compete with your team and climb the ranks" />

      <div className="flex gap-2">
        {(["weekly", "monthly", "alltime"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              period === p ? "bg-white text-black" : "glass-btn text-zinc-300"
            )}
          >{p}</button>
        ))}
      </div>

      <Card>
        <div className="space-y-2">
          {data.map((p) => (
            <div
              key={p.rank}
              className={cn(
                "flex items-center gap-4 rounded-xl p-3 transition-colors",
                p.isYou ? "bg-white/5 ring-1 ring-white/20" : "hover:bg-white/5"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg font-bold",
                p.rank === 1 && "bg-amber-500/20 text-amber-400 text-lg",
                p.rank === 2 && "bg-slate-400/20 text-slate-300 text-lg",
                p.rank === 3 && "bg-orange-600/20 text-orange-400 text-lg",
                p.rank >= 4 && "bg-ink-800 text-ink-300",
              )}>
                <RankBadge rank={p.rank} className="h-6 w-6" />
              </div>
              <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-ink-800" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-xs text-ink-400">{p.positive} positive CHIs · {p.tasks} tasks</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{p.score.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                  {p.coins.toLocaleString()} <Coin className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===== Achievements =====
export function AchievementsPage() {
  const store = useStore();
  const unlocked = store.userAchievements.filter((ua) => ua.userId === store.currentUser.id);
  const totalCoins = unlocked.reduce((sum, ua) => {
    const ach = store.achievements.find((a) => a.id === ua.achievementId);
    return sum + (ach?.rewardCoins ?? 0);
  }, 0);

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader title="Achievements" subtitle="Unlock badges and earn rewards" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Unlocked</div>
          <div className="mt-2 text-3xl font-bold text-brand-400">{unlocked.length}</div>
          <div className="text-xs text-ink-400">of {store.achievements.length} total</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Coins Earned</div>
          <div className="mt-2 text-3xl font-bold text-amber-400">{totalCoins}</div>
          <div className="text-xs text-ink-400">from achievements</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Next Unlock</div>
          <div className="mt-2 text-lg font-bold text-white">30 Day Streak</div>
          <div className="text-xs text-ink-400">{store.currentUser.streakDays}/30 days</div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {store.achievements.map((ach) => {
          const isUnlocked = unlocked.some((ua) => ua.achievementId === ach.id);
          return (
            <Card key={ach.id} className="text-center">
                <div className={cn(
                "relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg",
                isUnlocked ? "ring-2 ring-emerald-400/50" : "grayscale opacity-60"
              )}>
                <AchievementIcon criteria={ach.criteria} className="h-20 w-20" />
                {isUnlocked && (
                  <CheckCircle2 className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white ring-4 ring-ink-900" />
                )}
              </div>
              <h3 className="mt-3 font-bold text-white">{ach.title}</h3>
              <p className="mt-1 text-xs text-ink-400">{ach.description}</p>
              <div className="mt-3 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 inline-block">
                🪙 {ach.rewardCoins} coins
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===== Notifications =====
export function NotificationsPage() {
  const store = useStore();
  const getIcon = (type: string) => {
    switch (type) {
      case "achievement": return <IconAchievement className="h-6 w-6" />;
      case "bonus": return <IconBonus className="h-6 w-6" />;
      case "task": return <IconTask className="h-6 w-6" />;
      case "redemption": return <IconRedemption className="h-6 w-6" />;
      case "chi_import": return <IconImport className="h-6 w-6" />;
      default: return <IconInfo className="h-6 w-6" />;
    }
  };
  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Notifications"
        subtitle={`${store.notifications.filter((n) => !n.read).length} unread`}
        actions={
          <button
            onClick={store.markAllRead}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
          >Mark all as read</button>
        }
      />

      <Card>
        <div className="divide-y divide-ink-800">
          {store.notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => store.markNotificationRead(n.id)}
              className={cn(
                "flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-ink-800/40 rounded-lg px-2 -mx-2",
                !n.read && "bg-white/5"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-xl">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{n.title}</span>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-300">{n.message}</p>
                <span className="mt-1 inline-block text-xs text-ink-400">
                  {new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===== Team Page =====
export function TeamPage() {
  const team = TEAMS.find((t) => t.id === "team-001")!;
  const members = USERS.filter((u) => team.memberIds.includes(u.id));

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Team: Customer Success Alpha"
        subtitle={`${members.length} members · Led by Sarah Johnson`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Team Avg Score</div>
          <div className="mt-2 text-3xl font-bold text-brand-400">0.87</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Total CHIs</div>
          <div className="mt-2 text-3xl font-bold text-white">198</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Level 1+ Members</div>
          <div className="mt-2 text-3xl font-bold text-emerald-400">3/4</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink-400">Team Coins</div>
          <div className="mt-2 text-3xl font-bold text-amber-400">11,270</div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-bold text-white">Team Members</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-xl bg-ink-800/40 p-3">
              <img src={m.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-ink-800" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                    m.role === "team_lead" && "bg-brand-500/20 text-brand-400",
                    m.role === "manager" && "bg-amber-500/20 text-amber-400",
                    m.role === "admin" && "bg-pink-500/20 text-pink-400",
                    m.role === "employee" && "bg-ink-700 text-ink-300",
                  )}>{m.role.replace("_", " ")}</span>
                </div>
                <div className="text-xs text-ink-400">{m.employeeId} · Joined {formatDate(m.joinedAt)}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-white">
                  <Flame className="h-4 w-4" /> {m.streakDays}d
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===== Analytics =====
export function AnalyticsPage() {
  const store = useStore();

  const pieData = [
    { name: "Positive", value: store.getPositiveCount(), fill: "#22c55e" },
    { name: "Neutral", value: store.getNeutralCount(), fill: "#eab308" },
    { name: "Negative", value: store.getNegativeCount(), fill: "#ec4899" },
  ];

  const coinData = [
    { month: "Jan", earned: 450, spent: 200 },
    { month: "Feb", earned: 580, spent: 350 },
    { month: "Mar", earned: 620, spent: 300 },
    { month: "Apr", earned: 540, spent: 500 },
    { month: "May", earned: 710, spent: 200 },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into your performance"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700">
            <Download className="h-4 w-4" /> Export
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-bold text-white">CHI Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#14173b", border: "1px solid #1f2252", borderRadius: 8 }} />
                <RLegend wrapperStyle={{ color: "#e3e5f2" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Coin Flow (Earned vs Spent)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coinData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2252" />
                <XAxis dataKey="month" tick={{ fill: "#9498c4", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9498c4", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#14173b", border: "1px solid #1f2252", borderRadius: 8 }} />
                <RLegend wrapperStyle={{ color: "#e3e5f2" }} />
                <Bar dataKey="earned" fill="#ffffff" name="Earned" radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" fill="#f43f5e" name="Spent" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={store.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2252" />
                <XAxis dataKey="date" tick={{ fill: "#9498c4", fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fill: "#9498c4", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#14173b", border: "1px solid #1f2252", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={3} dot={{ fill: "#ffffff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Key Metrics</h3>
          <div className="grid gap-3">
            {[
              { label: "Current CHI Score", value: store.getCurrentScore().toFixed(2), icon: <ChiPositive className="h-6 w-6" /> },
              { label: "Current Level", value: store.getCurrentLevel().toString(), icon: <Trophy className="h-6 w-6" /> },
              { label: "Total CHIs", value: store.getTotalCHIs().toString(), icon: <BarChart3 className="h-6 w-6" /> },
              { label: "Coins Balance", value: store.getCurrentCoins().toLocaleString(), icon: <Coin className="h-6 w-6" /> },
              { label: "Achievements", value: store.userAchievements.filter((u) => u.userId === store.currentUser.id).length.toString(), icon: <Star className="h-6 w-6" /> },
              { label: "Streak", value: `${store.currentUser.streakDays} days`, icon: <Flame className="h-6 w-6" /> },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between rounded-xl bg-ink-800/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-brand-400">{m.icon}</span>
                  <span className="text-sm text-ink-200">{m.label}</span>
                </div>
                <span className="text-lg font-bold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===== Import CHI =====
export function ImportPage() {
  const store = useStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    // Simulate parsing with dummy rows
    setRows([
      { employeeId: "OE-2847", email: "john.doe@anelyria.com", name: "John Doe", chiType: "positive", date: "2024-05-28", category: "Customer Feedback", notes: "Great service", status: "valid" as const },
      { employeeId: "OE-1023", email: "sarah.johnson@anelyria.com", name: "Sarah Johnson", chiType: "positive", date: "2024-05-28", category: "Resolution", notes: "Excellent", status: "valid" as const },
      { employeeId: "OE-1456", email: "michael.chen@anelyria.com", name: "Michael Chen", chiType: "neutral", date: "2024-05-28", category: "Call Quality", notes: "Average", status: "valid" as const },
      { employeeId: "OE-XXXX", email: "unknown@anelyria.com", name: "Unknown", chiType: "positive", date: "2024-05-28", category: "Feedback", notes: "No match", status: "invalid" as const },
      { employeeId: "OE-2847", email: "john.doe@anelyria.com", name: "John Doe", chiType: "positive", date: "2024-05-27", category: "Feedback", notes: "Duplicate row", status: "duplicate" as const },
      { employeeId: "OE-1789", email: "emily.davis@anelyria.com", name: "Emily Davis", chiType: "positive", date: "2024-05-28", category: "Upsell", notes: "Bundle sale", status: "valid" as const },
    ]);
    setStep("preview");
  };

  const confirmImport = () => {
    setStep("done");
    setTimeout(() => {
      setFileName(null);
      setRows([]);
      setStep("upload");
    }, 3000);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader title="Import CHI Records" subtitle="Upload CSV files to bulk-add CHI entries" />

      {step === "upload" && (
        <Card className="py-16">
          <label className="glass mx-auto flex max-w-md cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-colors hover:border-white/30">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Upload className="h-8 w-8" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">Click to upload CSV</div>
              <div className="mt-1 text-sm text-ink-400">Max 10MB · CSV format</div>
              <div className="mt-4 rounded-lg bg-ink-800 p-3 text-left text-[11px] font-mono text-ink-400">
                employee_id,email,employee_name,chi_type,date,category,notes
              </div>
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
        </Card>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white">{fileName}</h3>
                <p className="mt-1 text-sm text-ink-400">Review the parsed rows before importing</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                  ✓ {rows.filter((r) => r.status === "valid").length} valid
                </span>
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-400">
                  ✗ {rows.filter((r) => r.status === "invalid").length} invalid
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
                  ⟳ {rows.filter((r) => r.status === "duplicate").length} duplicate
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800 text-left text-xs uppercase text-ink-400">
                    <th className="pb-3 pr-4">Employee</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-white">{r.name}</div>
                        <div className="text-xs text-ink-400">{r.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                          r.chiType === "positive" && "bg-emerald-500/20 text-emerald-400",
                          r.chiType === "neutral" && "bg-amber-500/20 text-amber-400",
                          r.chiType === "negative" && "bg-pink-500/20 text-pink-400",
                        )}>{r.chiType}</span>
                      </td>
                      <td className="py-3 pr-4 text-ink-300">{r.date}</td>
                      <td className="py-3 pr-4 text-ink-300">{r.category}</td>
                      <td className="py-3">
                        {r.status === "valid" && <Check className="h-4 w-4 text-emerald-400" />}
                        {r.status === "invalid" && <X className="h-4 w-4 text-pink-400" />}
                        {r.status === "duplicate" && <AlertCircle className="h-4 w-4 text-amber-400" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <button onClick={() => { setFileName(null); setRows([]); setStep("upload"); }} className="rounded-lg bg-ink-800 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700">
              Cancel
            </button>
            <button onClick={confirmImport} className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-zinc-200">
              Confirm Import ({rows.filter((r) => r.status === "valid").length} rows)
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <Card className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">Import Successful!</h3>
          <p className="mt-2 text-ink-300">All valid rows have been processed. Scores and rewards recalculated.</p>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 text-base font-bold text-white">Import History</h3>
        <div className="divide-y divide-ink-800">
          {store.importBatches.map((b) => (
            <div key={b.id} className="flex items-center gap-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800">
                <Upload className="h-5 w-5 text-brand-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{b.fileName}</div>
                <div className="text-xs text-ink-400">
                  {b.totalRows} rows · {b.validRows} valid · {formatDate(b.createdAt)}
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 capitalize">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===== Admin Panel =====
export function AdminPage() {
  const store = useStore();
  const [tab, setTab] = useState<"settings" | "users" | "audit" | "rewards">("settings");

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fadeIn">
      <PageHeader
        title="Admin Panel"
        subtitle="System configuration and management"
        actions={
          <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-400">
            {store.currentUser.role.toUpperCase()}
          </span>
        }
      />

      <div className="flex gap-2">
        {[
          { id: "settings", label: "Settings", icon: SettingsIcon },
          { id: "users", label: "Users", icon: User },
          { id: "audit", label: "Audit Log", icon: Shield },
          { id: "rewards", label: "Rewards Mgmt", icon: Gift },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                tab === t.id ? "bg-white text-black" : "glass-btn text-zinc-300"
              )}
            >
              <Icon className="h-4 w-4" />{t.label}
            </button>
          );
        })}
      </div>

      {tab === "settings" && (
        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Bonus Threshold Configuration</h3>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-purple-300">CHI Score (0.00 - 1.00)</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Level 1 Threshold", key: "level1Threshold", value: store.settings.level1Threshold, step: 0.01 },
                { label: "Level 2 Threshold", key: "level2Threshold", value: store.settings.level2Threshold, step: 0.01 },
                { label: "Level 3 Threshold", key: "level3Threshold", value: store.settings.level3Threshold, step: 0.01 },
                { label: "Level 1 Reward", key: "level1Reward", value: store.settings.level1Reward, step: 1, suffix: " coins" },
                { label: "Level 2 Reward", key: "level2Reward", value: store.settings.level2Reward, step: 1, suffix: " coins" },
                { label: "Level 3 Reward", key: "level3Reward", value: store.settings.level3Reward, step: 1, suffix: " coins" },
              ].map((field) => (
                <SettingsField key={field.key} field={field} onUpdate={store.updateSettings} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-emerald-300">INK Score (0 - 100)</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Level 1 Threshold", key: "inkLevel1Threshold", value: store.settings.inkLevel1Threshold, step: 1 },
                { label: "Level 2 Threshold", key: "inkLevel2Threshold", value: store.settings.inkLevel2Threshold, step: 1 },
                { label: "Level 3 Threshold", key: "inkLevel3Threshold", value: store.settings.inkLevel3Threshold, step: 1 },
                { label: "Level 1 Reward", key: "inkLevel1Reward", value: store.settings.inkLevel1Reward, step: 1, suffix: " coins" },
                { label: "Level 2 Reward", key: "inkLevel2Reward", value: store.settings.inkLevel2Reward, step: 1, suffix: " coins" },
                { label: "Level 3 Reward", key: "inkLevel3Reward", value: store.settings.inkLevel3Reward, step: 1, suffix: " coins" },
              ].map((field) => (
                <SettingsField key={field.key} field={field} onUpdate={store.updateSettings} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-amber-300">Calls Per Hour</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Level 1 Threshold", key: "callsLevel1Threshold", value: store.settings.callsLevel1Threshold, step: 1 },
                { label: "Level 2 Threshold", key: "callsLevel2Threshold", value: store.settings.callsLevel2Threshold, step: 1 },
                { label: "Level 3 Threshold", key: "callsLevel3Threshold", value: store.settings.callsLevel3Threshold, step: 1 },
                { label: "Level 1 Reward", key: "callsLevel1Reward", value: store.settings.callsLevel1Reward, step: 1, suffix: " coins" },
                { label: "Level 2 Reward", key: "callsLevel2Reward", value: store.settings.callsLevel2Reward, step: 1, suffix: " coins" },
                { label: "Level 3 Reward", key: "callsLevel3Reward", value: store.settings.callsLevel3Reward, step: 1, suffix: " coins" },
              ].map((field) => (
                <SettingsField key={field.key} field={field} onUpdate={store.updateSettings} />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold text-white">General Settings</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Monthly Coin Bonus", key: "monthlyCoinBonus", value: store.settings.monthlyCoinBonus, step: 1 },
                { label: "Daily Streak Coin", key: "streakDailyCoin", value: store.settings.streakDailyCoin, step: 1 },
              ].map((field) => (
                <SettingsField key={field.key} field={field} onUpdate={store.updateSettings} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Metric Naming (Multi-Tenant)</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "CHI Metric Name", key: "chiMetricName", value: store.settings.chiMetricName ?? "CHI", step: null },
                { label: "INK Metric Name", key: "inkMetricName", value: store.settings.inkMetricName ?? "INK", step: null },
                { label: "Calls Metric Name", key: "callsMetricName", value: store.settings.callsMetricName ?? "Calls", step: null },
                { label: "Coin Name", key: "coinName", value: store.settings.coinName ?? "Coins", step: null },
              ].map((field) => (
                <SettingsField key={field.key} field={field} onUpdate={store.updateSettings} />
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-white/5 p-4 text-xs text-zinc-300 ring-1 ring-white/10">
            <span className="mr-1">💡</span> Changes are saved automatically and take effect immediately across the platform.
          </div>
        </Card>
      )}

      {tab === "users" && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Employee Directory</h3>
            <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black">
              <Plus className="mr-1 inline h-3 w-3" /> Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800 text-left text-xs uppercase text-ink-400">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Team</th>
                  <th className="pb-3">Streak</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800">
                {USERS.map((u) => {
                  const team = TEAMS.find((t) => t.id === u.teamId);
                  return (
                    <tr key={u.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <div>
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-xs text-ink-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs capitalize">{u.role.replace("_", " ")}</span>
                      </td>
                      <td className="py-3 text-ink-300">{team?.name || "-"}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-ink-300">
                          <Flame className="h-4 w-4" /> {u.streakDays}d
                        </span>
                      </td>
                      <td className="py-3"><span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">Active</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "audit" && (
        <Card>
          <h3 className="mb-4 text-base font-bold text-white">Audit Log</h3>
          <div className="divide-y divide-ink-800">
            {store.auditLogs.map((log) => {
              const user = store.getUserById(log.userId);
              return (
                <div key={log.id} className="flex items-center gap-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800 text-brand-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold text-white">{user?.name}</span>
                      <span className="text-ink-300"> {log.action.toLowerCase()}</span>
                    </div>
                    <div className="text-xs text-ink-400">{log.details}</div>
                  </div>
                  <div className="text-right text-xs text-ink-400">
                    {new Date(log.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "rewards" && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Reward Management</h3>
            <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black">
              <Plus className="mr-1 inline h-3 w-3" /> Create Reward
            </button>
          </div>
          <div className="space-y-3">
            {store.rewards.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-xl bg-ink-800/40 p-3">
                <div className="relative">
                  <img src={r.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="absolute -right-1 -bottom-1 rounded-md bg-ink-900/80 p-1">
                    <RewardCategoryIcon category={r.category} className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{r.title}</div>
                  <div className="text-xs text-ink-400">{r.stock} in stock · <span className="capitalize">{r.category.replace("_", " ")}</span></div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-400">🪙 {r.coinPrice}</div>
                  <span className={cn(
                    "text-[10px] font-semibold uppercase",
                    r.active ? "text-emerald-400" : "text-pink-400"
                  )}>{r.active ? "Active" : "Disabled"}</span>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg bg-ink-800 p-2 text-ink-300 hover:bg-ink-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg bg-ink-800 p-2 text-ink-300 hover:bg-ink-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
