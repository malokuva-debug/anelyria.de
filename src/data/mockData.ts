// =============================================================================
// Anelyria Platform — Mock Data (Development Seeding)
// In production, this comes from MariaDB via the backend API.
// All data is multi-tenant ready.
// =============================================================================

import type {
  User, ChiEntry, MonthlySnapshot, Task, Achievement,
  UserAchievement, CoinTransaction, Reward,
  Notification, ImportBatch, AuditLog, AppSettings, Role
} from "../types";

// Backwards-compatible type aliases for new metric names
export type { ChiEntry, MonthlySnapshot, AppSettings };

export const TENANT_ID = "tenant-default";
export const CURRENT_USER_ID = "user-001";

export const SETTINGS: AppSettings = {
  // CHI
  level1Threshold: 0.80,
  level2Threshold: 0.85,
  level3Threshold: 0.90,
  level1Reward: 100,
  level2Reward: 150,
  level3Reward: 250,
  // INK (0-100 scale)
  inkLevel1Threshold: 70,
  inkLevel2Threshold: 80,
  inkLevel3Threshold: 90,
  inkLevel1Reward: 75,
  inkLevel2Reward: 125,
  inkLevel3Reward: 200,
  // Calls per hour
  callsLevel1Threshold: 30,
  callsLevel2Threshold: 40,
  callsLevel3Threshold: 50,
  callsLevel1Reward: 50,
  callsLevel2Reward: 100,
  callsLevel3Reward: 175,
  // General
  monthlyCoinBonus: 50,
  streakDailyCoin: 5,
};

export const USERS: User[] = [
  { id: "user-001", email: "john.doe@anelyria.com", name: "John Doe", role: "employee" as Role, avatar: "https://i.pravatar.cc/120?img=12", department: "Customer Success", teamId: "team-001", employeeId: "AN-2847", joinedAt: "2024-03-15", streakDays: 18 },
  { id: "user-002", email: "sarah.johnson@anelyria.com", name: "Sarah Johnson", role: "team_lead" as Role, avatar: "https://i.pravatar.cc/120?img=47", department: "Customer Success", teamId: "team-001", employeeId: "AN-1023", joinedAt: "2024-01-08", streakDays: 42 },
  { id: "user-003", email: "michael.chen@anelyria.com", name: "Michael Chen", role: "employee" as Role, avatar: "https://i.pravatar.cc/120?img=33", department: "Customer Success", teamId: "team-001", employeeId: "AN-1456", joinedAt: "2024-02-20", streakDays: 31 },
  { id: "user-004", email: "emily.davis@anelyria.com", name: "Emily Davis", role: "employee" as Role, avatar: "https://i.pravatar.cc/120?img=23", department: "Customer Success", teamId: "team-001", employeeId: "AN-1789", joinedAt: "2024-06-01", streakDays: 27 },
  { id: "user-005", email: "alex.martinez@anelyria.com", name: "Alex Martinez", role: "manager" as Role, avatar: "https://i.pravatar.cc/120?img=68", department: "Operations", teamId: "team-002", employeeId: "AN-0012", joinedAt: "2023-04-12", streakDays: 89 },
  { id: "user-006", email: "priya.patel@anelyria.com", name: "Priya Patel", role: "admin" as Role, avatar: "https://i.pravatar.cc/120?img=16", department: "Administration", teamId: "team-002", employeeId: "AN-0003", joinedAt: "2023-09-01", streakDays: 156 },
  { id: "user-007", email: "liam.oconnor@anelyria.com", name: "Liam O'Connor", role: "employee" as Role, avatar: "https://i.pravatar.cc/120?img=51", department: "Sales", teamId: "team-003", employeeId: "AN-3421", joinedAt: "2024-08-22", streakDays: 14 },
  { id: "user-008", email: "sophie.williams@anelyria.com", name: "Sophie Williams", role: "employee" as Role, avatar: "https://i.pravatar.cc/120?img=29", department: "Sales", teamId: "team-003", employeeId: "AN-2134", joinedAt: "2024-02-10", streakDays: 22 },
];

export const TEAMS = [
  { id: "team-001", name: "Customer Success Alpha", leadId: "user-002", memberIds: ["user-001","user-002","user-003","user-004"], department: "Customer Success" },
  { id: "team-002", name: "Operations Central", leadId: "user-005", memberIds: ["user-005","user-006"], department: "Operations" },
  { id: "team-003", name: "Sales Tigers", leadId: "user-007", memberIds: ["user-007","user-008"], department: "Sales" },
];

// CHI entries for current user
export const CHI_ENTRIES: ChiEntry[] = [
  { id: "chi-001", employeeId: "user-001", type: "positive", category: "Customer Feedback", notes: "Great customer feedback", date: "2024-05-28", source: "feedback" },
  { id: "chi-002", employeeId: "user-001", type: "neutral", category: "Call Quality", notes: "Average call quality", date: "2024-05-27", source: "feedback" },
  { id: "chi-003", employeeId: "user-001", type: "positive", category: "Resolution", notes: "Excellent resolution", date: "2024-05-26", source: "feedback" },
  { id: "chi-004", employeeId: "user-001", type: "negative", category: "Follow-up", notes: "Missed follow up", date: "2024-05-25", source: "manual" },
  { id: "chi-005", employeeId: "user-001", type: "positive", category: "Upsell", notes: "Successful upgrade", date: "2024-05-24", source: "feedback" },
  { id: "chi-006", employeeId: "user-001", type: "positive", category: "Customer Feedback", notes: "Loved the service", date: "2024-05-23", source: "feedback" },
  { id: "chi-007", employeeId: "user-001", type: "neutral", category: "Call Quality", notes: "On target", date: "2024-05-22", source: "feedback" },
  { id: "chi-008", employeeId: "user-001", type: "positive", category: "Feedback", notes: "Brilliant support", date: "2024-05-21", source: "feedback" },
  { id: "chi-009", employeeId: "user-001", type: "negative", category: "Response Time", notes: "Slow response", date: "2024-05-20", source: "manual" },
  { id: "chi-010", employeeId: "user-001", type: "positive", category: "Complaint Resolution", notes: "Resolved escalated case", date: "2024-05-19", source: "feedback" },
  { id: "chi-011", employeeId: "user-001", type: "positive", category: "Customer Feedback", notes: "5-star review", date: "2024-05-18", source: "feedback" },
  { id: "chi-012", employeeId: "user-001", type: "neutral", category: "Call Quality", notes: "Met expectations", date: "2024-05-17", source: "feedback" },
  { id: "chi-013", employeeId: "user-001", type: "positive", category: "Upsell", notes: "Converted customer", date: "2024-05-16", source: "feedback" },
  { id: "chi-014", employeeId: "user-001", type: "positive", category: "Resolution", notes: "Fast turnaround", date: "2024-05-15", source: "feedback" },
  { id: "chi-015", employeeId: "user-001", type: "negative", category: "Follow-up", notes: "Forgot callback", date: "2024-05-14", source: "manual" },
  { id: "chi-016", employeeId: "user-001", type: "positive", category: "Customer Feedback", notes: "Fantastic service", date: "2024-05-13", source: "feedback" },
  { id: "chi-017", employeeId: "user-001", type: "neutral", category: "Call Quality", notes: "Decent call", date: "2024-05-12", source: "feedback" },
  { id: "chi-018", employeeId: "user-001", type: "positive", category: "Complaint", notes: "De-escalated well", date: "2024-05-11", source: "feedback" },
  { id: "chi-019", employeeId: "user-001", type: "positive", category: "Customer Feedback", notes: "Highly praised", date: "2024-05-10", source: "feedback" },
  { id: "chi-020", employeeId: "user-001", type: "neutral", category: "Call Quality", notes: "Average", date: "2024-05-09", source: "feedback" },
];

export const CURRENT_MONTH_SNAPSHOT: MonthlySnapshot = {
  id: "snap-001", employeeId: "user-001", month: "2024-05",
  positive: 36, neutral: 10, negative: 4, total: 50,
  score: 0.82, levelAchieved: 1,
  inkAverage: 76, inkLevelAchieved: 1,
  callsPerHourAverage: 32, callsLevelAchieved: 1,
};

export const MONTHLY_TREND = [
  { date: "May 1", score: 0.42, positive: 5, negative: 2 },
  { date: "May 7", score: 0.58, positive: 12, negative: 4 },
  { date: "May 14", score: 0.69, positive: 18, negative: 6 },
  { date: "May 21", score: 0.78, positive: 27, negative: 6 },
  { date: "May 28", score: 0.82, positive: 36, negative: 4 },
  { date: "Today", score: 0.82, positive: 36, negative: 4 },
];

export const TASKS: Task[] = [
  { id: "task-001", title: "Receive 5 Positive CHIs", description: "Earn 5 positive CHI entries this week", rewardCoins: 100, startDate: "2024-05-20", endDate: "2024-06-03", recurring: true, recurrence: "weekly", assignedTo: ["team-001"], teamId: "team-001", category: "Weekly Challenge", target: 5, progress: 3, approvalRequired: false, createdBy: "user-002", status: "active" as const },
  { id: "task-002", title: "Maintain 0.85 CHI Score", description: "Keep your CHI score at or above 0.85 for the full month", rewardCoins: 150, startDate: "2024-05-01", endDate: "2024-05-31", recurring: false, assignedTo: ["team-001"], teamId: "team-001", category: "Monthly Goal", target: 1, progress: 0.82, approvalRequired: false, createdBy: "user-005", status: "active" as const },
  { id: "task-003", title: "Complete Training Module", description: "Complete the new customer service training module", rewardCoins: 50, startDate: "2024-05-15", endDate: "2024-06-15", recurring: false, assignedTo: ["user-001"], category: "Learning", target: 1, progress: 0, approvalRequired: true, createdBy: "user-005", status: "active" as const },
  { id: "task-004", title: "Zero Negative CHIs This Week", description: "No negative CHIs for the full week", rewardCoins: 75, startDate: "2024-05-27", endDate: "2024-06-02", recurring: true, recurrence: "weekly", assignedTo: ["team-001"], teamId: "team-001", category: "Weekly Challenge", target: 7, progress: 4, approvalRequired: false, createdBy: "user-002", status: "active" as const },
  { id: "task-005", title: "10 Positive CHIs in a Day", description: "Achieve 10 positive CHIs in a single day", rewardCoins: 200, startDate: "2024-05-01", endDate: "2024-06-30", recurring: false, assignedTo: ["team-001"], teamId: "team-001", category: "Stretch Goal", target: 10, progress: 7, approvalRequired: false, createdBy: "user-005", status: "active" as const },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "ach-001", title: "5 Positive CHIs", description: "Earn your first 5 positive CHIs", icon: "badge-5chi", rewardCoins: 50, criteria: "5_positive_chis", color: "from-purple-500 to-violet-600" },
  { id: "ach-002", title: "30 Day Streak", description: "Maintain activity for 30 days", icon: "badge-streak", rewardCoins: 200, criteria: "30_day_streak", color: "from-pink-500 to-rose-600" },
  { id: "ach-003", title: "Top Performer", description: "Rank #1 on monthly leaderboard", icon: "badge-top", rewardCoins: 500, criteria: "top_performer", color: "from-amber-500 to-orange-600" },
  { id: "ach-004", title: "Perfect Month", description: "No negative CHIs for an entire month", icon: "badge-perfect", rewardCoins: 300, criteria: "perfect_month", color: "from-emerald-500 to-teal-600" },
  { id: "ach-005", title: "Elite Score", description: "Reach a CHI score of 0.95+", icon: "badge-elite", rewardCoins: 1000, criteria: "elite_score", color: "from-cyan-500 to-blue-600" },
  { id: "ach-006", title: "Century Club", description: "Accumulate 100 positive CHIs", icon: "badge-century", rewardCoins: 400, criteria: "century_club", color: "from-red-500 to-rose-600" },
];

export const USER_ACHIEVEMENTS: UserAchievement[] = [
  { id: "ua-001", userId: "user-001", achievementId: "ach-001", unlockedAt: "2024-04-15" },
  { id: "ua-002", userId: "user-001", achievementId: "ach-003", unlockedAt: "2024-03-20" },
  { id: "ua-003", userId: "user-002", achievementId: "ach-001", unlockedAt: "2024-04-10" },
  { id: "ua-004", userId: "user-002", achievementId: "ach-002", unlockedAt: "2024-04-01" },
];

export const COIN_TRANSACTIONS: CoinTransaction[] = [
  { id: "tx-001", userId: "user-001", amount: 100, reason: "Level 1 Bonus - May 2024", type: "bonus", balanceAfter: 2450, createdAt: "2024-05-28" },
  { id: "tx-002", userId: "user-001", amount: 50, reason: "Achievement: 5 Positive CHIs", type: "achievement", balanceAfter: 2350, createdAt: "2024-05-15" },
  { id: "tx-003", userId: "user-001", amount: -200, reason: "Redeemed: Amazon Gift Card", type: "redemption", balanceAfter: 2300, createdAt: "2024-05-12" },
  { id: "tx-004", userId: "user-001", amount: 100, reason: "Task: Receive 5 Positive CHIs", type: "task", balanceAfter: 2500, createdAt: "2024-05-10" },
  { id: "tx-005", userId: "user-001", amount: 15, reason: "3 Day Streak", type: "streak", balanceAfter: 2400, createdAt: "2024-05-08" },
];

export const REWARDS: Reward[] = [
  { id: "reward-001", title: "Amazon Gift Card $20", description: "Digital gift card delivered within 24 hours", coinPrice: 200, category: "gift_cards", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop", stock: 50, active: true, createdAt: "2024-01-15" },
  { id: "reward-002", title: "Branded Hoodie", description: "Premium company hoodie", coinPrice: 500, category: "merch", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop", stock: 30, active: true, createdAt: "2024-02-01" },
  { id: "reward-003", title: "Extra Day Off", description: "Add one extra day of paid leave", coinPrice: 1500, category: "perks", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=400&h=300&fit=crop", stock: 20, active: true, createdAt: "2024-02-15" },
  { id: "reward-004", title: "Starbucks Gift Card $10", description: "Coffee on us", coinPrice: 100, category: "gift_cards", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop", stock: 100, active: true, createdAt: "2024-03-01" },
  { id: "reward-005", title: "Noise-Canceling Headphones", description: "Premium over-ear headphones", coinPrice: 1200, category: "merch", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", stock: 15, active: true, createdAt: "2024-04-15" },
  { id: "reward-006", title: "Lunch with Leadership", description: "Exclusive lunch with the executive team", coinPrice: 2000, category: "experiences", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop", stock: 5, active: true, createdAt: "2024-04-01" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n-001", userId: "user-001", title: "Level 1 Bonus Achieved!", message: "Congratulations! You reached Level 1 with a CHI score of 0.82. +100 Coins", type: "bonus", read: false, createdAt: "2024-05-28T10:30:00Z" },
  { id: "n-002", userId: "user-001", title: "New Task Assigned", message: "You have been assigned: Complete Training Module", type: "task", read: false, createdAt: "2024-05-27T14:00:00Z" },
  { id: "n-003", userId: "user-001", title: "Achievement Unlocked!", message: "You earned: Top Performer +500 Coins", type: "achievement", read: true, createdAt: "2024-05-20T09:15:00Z" },
  { id: "n-004", userId: "user-001", title: "Reward Approved", message: "Your redemption of Branded Hoodie has been approved", type: "redemption", read: true, createdAt: "2024-05-21T11:00:00Z" },
];

export const IMPORT_BATCHES: ImportBatch[] = [
  { id: "imp-001", uploadedBy: "user-002", fileName: "may-metrics.csv", totalRows: 120, validRows: 118, invalidRows: 1, duplicateRows: 1, status: "completed", createdAt: "2024-05-28T08:00:00Z" },
  { id: "imp-002", uploadedBy: "user-005", fileName: "q1-metrics.csv", totalRows: 350, validRows: 345, invalidRows: 3, duplicateRows: 2, status: "completed", createdAt: "2024-04-01T14:20:00Z" },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "log-001", userId: "user-002", action: "CSV_UPLOAD", entityType: "import_batch", entityId: "imp-001", details: "Uploaded may-metrics.csv (120 rows)", createdAt: "2024-05-28T08:00:00Z" },
  { id: "log-002", userId: "user-005", action: "TASK_CREATED", entityType: "task", entityId: "task-003", details: "Created task: Complete Training Module", createdAt: "2024-05-15T10:00:00Z" },
  { id: "log-003", userId: "user-006", action: "USER_CREATED", entityType: "user", entityId: "user-007", details: "Added user: Liam O'Connor (employee)", createdAt: "2024-08-22T09:00:00Z" },
  { id: "log-004", userId: "user-006", action: "SETTINGS_UPDATE", entityType: "settings", entityId: "app", details: "Updated Level 2 threshold to 0.85", createdAt: "2024-02-01T15:30:00Z" },
];

export const TEAM_LEADERBOARD = [
  { rank: 1, userId: "user-002", name: "Sarah Johnson", avatar: "https://i.pravatar.cc/120?img=47", score: 0.93, coins: 3250, trend: "up" as const },
  { rank: 2, userId: "user-003", name: "Michael Chen", avatar: "https://i.pravatar.cc/120?img=33", score: 0.88, coins: 2890, trend: "up" as const },
  { rank: 3, userId: "user-004", name: "Emily Davis", avatar: "https://i.pravatar.cc/120?img=23", score: 0.86, coins: 2680, trend: "up" as const },
  { rank: 4, userId: "user-001", name: "John Doe (You)", avatar: "https://i.pravatar.cc/120?img=12", score: 0.82, coins: 2450, trend: "up" as const },
];

// ===== Helpers =====
export function calculateCHIScore(positive: number, neutral: number, negative: number): number {
  const total = positive + neutral + negative;
  if (total === 0) return 0;
  return Math.round(((positive - negative) / total) * 100) / 100;
}

export function getLevelForScore(score: number): number {
  if (score >= SETTINGS.level3Threshold) return 3;
  if (score >= SETTINGS.level2Threshold) return 2;
  if (score >= SETTINGS.level1Threshold) return 1;
  return 0;
}

export function getNextLevelThreshold(score: number): number | null {
  if (score < SETTINGS.level1Threshold) return SETTINGS.level1Threshold;
  if (score < SETTINGS.level2Threshold) return SETTINGS.level2Threshold;
  if (score < SETTINGS.level3Threshold) return SETTINGS.level3Threshold;
  return null;
}

export function calculateNeededPositives(targetScore: number, positive: number, neutral: number, negative: number): number {
  const total = positive + neutral + negative;
  if (targetScore >= 1) return 0;
  const needed = Math.ceil((targetScore * total - positive + negative) / (1 - targetScore));
  return Math.max(0, needed);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
