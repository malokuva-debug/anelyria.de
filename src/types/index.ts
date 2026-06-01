// =============================================================================
// Anelyria Platform — Type Definitions
// Multi-tenant ready (tenantId fields optional for dev/demo)
// =============================================================================

export type Role = "employee" | "team_lead" | "manager" | "admin";

export type ChiType = "positive" | "neutral" | "negative";

export type TaskStatus = "active" | "completed" | "expired";

export interface BonusLevel {
  level: number;
  threshold: number;
  reward: number;
  label: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
  department: string;
  teamId: string;
  employeeId: string;
  joinedAt: string;
  streakDays: number;
  // Multi-tenant (optional for dev)
  tenantId?: string;
  active?: boolean;
}

export interface Team {
  id: string;
  name: string;
  leadId: string;
  memberIds: string[];
  department: string;
  tenantId?: string;
}

export interface ChiEntry {
  id: string;
  employeeId: string;
  type: ChiType;
  category: string;
  notes: string;
  date: string;
  source: "manual" | "csv_import" | "feedback";
  importBatchId?: string;
  tenantId?: string;
  // New metrics (optional)
  ink?: number;
  callsPerHour?: number;
}

export interface MonthlySnapshot {
  id: string;
  employeeId: string;
  month: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  score: number;
  levelAchieved: number | null;
  tenantId?: string;
  // INK metrics
  inkAverage?: number;
  inkLevelAchieved?: number | null;
  // Calls metrics
  callsPerHourAverage?: number;
  callsLevelAchieved?: number | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  startDate: string;
  endDate: string;
  recurring: boolean;
  recurrence?: "daily" | "weekly" | "monthly";
  assignedTo: string[];
  teamId?: string;
  category: string;
  target: number;
  progress: number;
  approvalRequired: boolean;
  createdBy: string;
  status: TaskStatus;
  tenantId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  criteria: string;
  color: string;
  tenantId?: string;
  active?: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  type: "bonus" | "task" | "achievement" | "streak" | "redemption" | "manual_adjustment";
  balanceAfter: number;
  createdAt: string;
  tenantId?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  coinPrice: number;
  category: "gift_cards" | "merch" | "perks" | "experiences";
  image: string;
  stock: number;
  active: boolean;
  createdAt: string;
  tenantId?: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  coinsSpent: number;
  status: "pending" | "approved" | "fulfilled" | "rejected";
  createdAt: string;
  tenantId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "achievement" | "bonus" | "task" | "redemption" | "chi_import" | "info";
  read: boolean;
  createdAt: string;
  tenantId?: string;
}

export interface ImportBatch {
  id: string;
  uploadedBy: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  status: "preview" | "confirmed" | "completed" | "failed" | "rolled_back";
  createdAt: string;
  tenantId?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ip?: string;
  createdAt: string;
  tenantId?: string;
}

export interface AppSettings {
  // CHI thresholds & rewards
  level1Threshold: number;
  level2Threshold: number;
  level3Threshold: number;
  level1Reward: number;
  level2Reward: number;
  level3Reward: number;
  // INK thresholds & rewards (0-100 scale)
  inkLevel1Threshold: number;
  inkLevel2Threshold: number;
  inkLevel3Threshold: number;
  inkLevel1Reward: number;
  inkLevel2Reward: number;
  inkLevel3Reward: number;
  // Calls thresholds & rewards (calls per hour)
  callsLevel1Threshold: number;
  callsLevel2Threshold: number;
  callsLevel3Threshold: number;
  callsLevel1Reward: number;
  callsLevel2Reward: number;
  callsLevel3Reward: number;
  // General
  monthlyCoinBonus: number;
  streakDailyCoin: number;
  // Multi-tenant naming
  chiMetricName?: string;
  inkMetricName?: string;
  callsMetricName?: string;
  coinName?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  chiMetricName: string;
  inkMetricName: string;
  callsMetricName: string;
  coinName: string;
  billingInterval: { startDay: number; endDay: number };
}
