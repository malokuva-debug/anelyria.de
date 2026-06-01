import { create } from "zustand";
import { authApi } from "../api/auth";
import type {
  User, ChiEntry, MonthlySnapshot, Task, Achievement,
  UserAchievement, CoinTransaction, Reward, RewardRedemption,
  Notification, ImportBatch, AuditLog, AppSettings, Role
} from "../types";
import {
  USERS, TEAMS, CHI_ENTRIES, CURRENT_MONTH_SNAPSHOT,
  MONTHLY_TREND, TASKS, ACHIEVEMENTS, USER_ACHIEVEMENTS,
  COIN_TRANSACTIONS, REWARDS, NOTIFICATIONS, IMPORT_BATCHES, AUDIT_LOGS,
  SETTINGS, CURRENT_USER_ID,
  calculateCHIScore, getLevelForScore,
  calculateNeededPositives
} from "../data/mockData";

export type Page =
  | "dashboard" | "performance" | "chis" | "tasks"
  | "rewards-shop" | "my-rewards" | "leaderboards" | "achievements"
  | "notifications" | "team" | "analytics" | "import" | "admin" | "builder";

export type View = "landing" | "app";

interface AppState {
  // Auth
  isLoggedIn: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => boolean;
  currentView: View;
  setCurrentView: (view: View) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showForgotPasswordModal: boolean;
  setShowForgotPasswordModal: (show: boolean) => void;

  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // User
  currentUser: User;
  users: User[];
  addUser: (u: Omit<User, "id">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // CHI
  chiEntries: ChiEntry[];
  monthlySnapshot: MonthlySnapshot;
  monthlyTrend: typeof MONTHLY_TREND;
  addCHIEntry: (entry: ChiEntry) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (taskId: string) => void;

  // Achievements
  achievements: Achievement[];
  userAchievements: UserAchievement[];

  // Coins
  coinTransactions: CoinTransaction[];

  // Rewards
  rewards: Reward[];
  redemptions: RewardRedemption[];
  redeemReward: (rewardId: string) => void;
  addReward: (r: Omit<Reward, "id">) => void;
  deleteReward: (id: string) => void;
  approveRedemption: (id: string) => void;
  rejectRedemption: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Imports
  importBatches: ImportBatch[];
  processImport: (batch: ImportBatch) => void;

  // Audit
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entityType: string, entityId: string, details: string) => void;

  // Settings (multi-tenant naming)
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Computed
  getCurrentScore: () => number;
  getPositiveCount: () => number;
  getNeutralCount: () => number;
  getNegativeCount: () => number;
  getTotalCHIs: () => number;
  getCurrentLevel: () => number;
  getCurrentCoins: () => number;
  getNextLevelInfo: () => { threshold: number; neededPositives: number; progress: number } | null;
  getMonthlyCoinsEarned: () => number;
  getUserById: (id: string) => User | undefined;
  // INK
  getInkAverage: () => number;
  getInkLevel: () => number;
  getInkNextLevelInfo: () => { threshold: number; progress: number } | null;
  // Calls
  getCallsAverage: () => number;
  getCallsLevel: () => number;
  getCallsNextLevelInfo: () => { threshold: number; progress: number } | null;

  // RBAC
  canAccessFeature: (feature: "import" | "admin" | "user_management" | "team_management") => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  isLoggedIn: !!localStorage.getItem("token"),
  token: localStorage.getItem("token"),
  currentView: "landing",
  setCurrentView: (view) => set({ currentView: view }),
  showLoginModal: false,
  setShowLoginModal: (show) => set({ showLoginModal: show }),
  showForgotPasswordModal: false,
  setShowForgotPasswordModal: (show) => set({ showForgotPasswordModal: show }),

  login: async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      set({
        isLoggedIn: true,
        token: response.token,
        currentView: "app",
        showLoginModal: false,
        showForgotPasswordModal: false,
        currentUser: response.user as any,
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      isLoggedIn: false,
      token: null,
      currentView: "landing",
      currentPage: "dashboard",
    });
  },

  requestPasswordReset: (email) => {
    const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    set({ showForgotPasswordModal: false });
    // In production: calls POST /api/auth/forgot-password which sends email
    alert(`Password reset link sent to ${email}\n\n(In production, a secure email would be dispatched via your MariaDB-backed auth service.)`);
    return true;
  },

  // Navigation
  currentPage: "dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // User
  currentUser: USERS.find((u) => u.id === CURRENT_USER_ID)!,
  users: USERS,
  addUser: (u) => {
    const newUser = { ...u, id: `user-${Date.now()}` };
    set((state) => ({ users: [...state.users, newUser] }));
    get().addAuditLog("USER_CREATED", "user", newUser.id, `Added: ${newUser.name} (${newUser.role})`);
  },
  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
    get().addAuditLog("USER_UPDATED", "user", id, JSON.stringify(updates));
  },
  deleteUser: (id) => {
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
    get().addAuditLog("USER_DELETED", "user", id, "User removed");
  },

  // CHI
  chiEntries: CHI_ENTRIES,
  monthlySnapshot: CURRENT_MONTH_SNAPSHOT,
  monthlyTrend: MONTHLY_TREND,
  addCHIEntry: (entry) =>
    set((state) => {
      const newEntries = [entry, ...state.chiEntries];
      const positive = newEntries.filter((e) => e.type === "positive").length;
      const neutral = newEntries.filter((e) => e.type === "neutral").length;
      const negative = newEntries.filter((e) => e.type === "negative").length;
      const total = positive + neutral + negative;
      const score = calculateCHIScore(positive, neutral, negative);
      const level = getLevelForScore(score);
      return {
        chiEntries: newEntries,
        monthlySnapshot: {
          ...state.monthlySnapshot,
          positive, neutral, negative, total, score,
          levelAchieved: level,
        },
      };
    }),

  // Tasks
  tasks: TASKS,
  addTask: (t) => {
    const newTask = { ...t, id: `task-${Date.now()}` };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    get().addAuditLog("TASK_CREATED", "task", newTask.id, newTask.title);
  },
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    get().addAuditLog("TASK_DELETED", "task", id, "Task removed");
  },
  toggleTaskCompletion: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, progress: t.progress >= t.target ? 0 : t.target, status: (t.progress >= t.target ? "active" : "completed") as Task["status"] }
          : t
      ),
    })),

  // Achievements
  achievements: ACHIEVEMENTS,
  userAchievements: USER_ACHIEVEMENTS,

  // Coins
  coinTransactions: COIN_TRANSACTIONS,

  // Rewards
  rewards: REWARDS,
  redemptions: [],
  redeemReward: (rewardId) => {
    const state = get();
    const reward = state.rewards.find((r) => r.id === rewardId);
    if (!reward) return;
    const currentCoins = state.getCurrentCoins();
    if (currentCoins < reward.coinPrice) return;
    const redemption: RewardRedemption = {
      id: `rr-${Date.now()}`,
      userId: state.currentUser.id,
      rewardId,
      coinsSpent: reward.coinPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}`,
      userId: state.currentUser.id,
      amount: -reward.coinPrice,
      reason: `Redeemed: ${reward.title}`,
      type: "redemption",
      balanceAfter: currentCoins - reward.coinPrice,
      createdAt: new Date().toISOString(),
    };
    const notif: Notification = {
      id: `n-${Date.now()}`,
      userId: state.currentUser.id,
      title: "Reward Redeemed",
      message: `You've redeemed "${reward.title}". It will be processed within 24h.`,
      type: "redemption",
      read: false,
      createdAt: new Date().toISOString(),
    };
    set({
      redemptions: [redemption, ...state.redemptions],
      coinTransactions: [newTx, ...state.coinTransactions],
      notifications: [notif, ...state.notifications],
    });
    state.addAuditLog("REWARD_REDEEMED", "redemption", redemption.id, `${state.currentUser.name} redeemed ${reward.title}`);
  },
  addReward: (r) => {
    const newReward = { ...r, id: `rwd-${Date.now()}` };
    set((state) => ({ rewards: [...state.rewards, newReward] }));
    get().addAuditLog("REWARD_CREATED", "reward", newReward.id, newReward.title);
  },
  deleteReward: (id) => {
    set((state) => ({ rewards: state.rewards.filter((r) => r.id !== id) }));
  },
  approveRedemption: (id) => {
    set((state) => ({
      redemptions: state.redemptions.map((r) => r.id === id ? { ...r, status: "approved" as const } : r),
    }));
  },
  rejectRedemption: (id) => {
    set((state) => ({
      redemptions: state.redemptions.map((r) => r.id === id ? { ...r, status: "rejected" as const } : r),
    }));
  },

  // Notifications
  notifications: NOTIFICATIONS,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Imports
  importBatches: IMPORT_BATCHES,
  processImport: (batch) => {
    set((state) => ({
      importBatches: [{ ...batch, status: "completed" as const }, ...state.importBatches],
    }));
    get().addAuditLog("CSV_IMPORT", "import_batch", batch.id, `Processed ${batch.fileName}`);
  },

  // Audit
  auditLogs: AUDIT_LOGS,
  addAuditLog: (action, entityType, entityId, details) =>
    set((state) => ({
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          userId: state.currentUser.id,
          action, entityType, entityId, details,
          createdAt: new Date().toISOString(),
        },
        ...state.auditLogs,
      ].slice(0, 500),
    })),

  // Settings
  settings: SETTINGS,
  updateSettings: (updates) =>
    set((state) => ({ settings: { ...state.settings, ...updates } })),

  // Computed
  getCurrentScore: () => get().monthlySnapshot.score,
  getPositiveCount: () => get().monthlySnapshot.positive,
  getNeutralCount: () => get().monthlySnapshot.neutral,
  getNegativeCount: () => get().monthlySnapshot.negative,
  getTotalCHIs: () => get().monthlySnapshot.total,
  getCurrentLevel: () => getLevelForScore(get().monthlySnapshot.score),
  getCurrentCoins: () => {
    const txs = get().coinTransactions;
    if (txs.length === 0) return 0;
    return txs[0].balanceAfter;
  },
  getNextLevelInfo: () => {
    const state = get();
    const score = state.monthlySnapshot.score;
    const { level1Threshold, level2Threshold, level3Threshold } = state.settings;
    let threshold: number | null = null;
    if (score < level1Threshold) threshold = level1Threshold;
    else if (score < level2Threshold) threshold = level2Threshold;
    else if (score < level3Threshold) threshold = level3Threshold;
    if (threshold === null) return null;
    const { positive, neutral, negative } = state.monthlySnapshot;
    const needed = calculateNeededPositives(threshold, positive, neutral, negative);
    const progress = Math.min(1, score / threshold);
    return { threshold, neededPositives: needed, progress };
  },
  getMonthlyCoinsEarned: () => {
    const txs = get().coinTransactions.filter((t) => t.type !== "redemption" && t.type !== "manual_adjustment");
    return txs.reduce((sum, t) => sum + t.amount, 0);
  },
  getUserById: (id) => USERS.find((u) => u.id === id),

  // INK getters
  getInkAverage: () => {
    const snap = get().monthlySnapshot;
    return snap.inkAverage ?? 0;
  },
  getInkLevel: () => {
    const ink = get().getInkAverage();
    const { inkLevel1Threshold, inkLevel2Threshold, inkLevel3Threshold } = get().settings;
    if (ink >= inkLevel3Threshold) return 3;
    if (ink >= inkLevel2Threshold) return 2;
    if (ink >= inkLevel1Threshold) return 1;
    return 0;
  },
  getInkNextLevelInfo: () => {
    const ink = get().getInkAverage();
    const { inkLevel1Threshold, inkLevel2Threshold, inkLevel3Threshold } = get().settings;
    let threshold: number | null = null;
    if (ink < inkLevel1Threshold) threshold = inkLevel1Threshold;
    else if (ink < inkLevel2Threshold) threshold = inkLevel2Threshold;
    else if (ink < inkLevel3Threshold) threshold = inkLevel3Threshold;
    if (threshold === null) return null;
    return { threshold, progress: Math.min(1, ink / threshold) };
  },

  // Calls getters
  getCallsAverage: () => {
    const snap = get().monthlySnapshot;
    return snap.callsPerHourAverage ?? 0;
  },
  getCallsLevel: () => {
    const calls = get().getCallsAverage();
    const { callsLevel1Threshold, callsLevel2Threshold, callsLevel3Threshold } = get().settings;
    if (calls >= callsLevel3Threshold) return 3;
    if (calls >= callsLevel2Threshold) return 2;
    if (calls >= callsLevel1Threshold) return 1;
    return 0;
  },
  getCallsNextLevelInfo: () => {
    const calls = get().getCallsAverage();
    const { callsLevel1Threshold, callsLevel2Threshold, callsLevel3Threshold } = get().settings;
    let threshold: number | null = null;
    if (calls < callsLevel1Threshold) threshold = callsLevel1Threshold;
    else if (calls < callsLevel2Threshold) threshold = callsLevel2Threshold;
    else if (calls < callsLevel3Threshold) threshold = callsLevel3Threshold;
    if (threshold === null) return null;
    return { threshold, progress: Math.min(1, calls / threshold) };
  },

  // RBAC
  canAccessFeature: (feature) => {
    const user = get().currentUser;
    if (!user) return false;
    const level: Record<Role, number> = { employee: 1, team_lead: 2, manager: 3, admin: 4 };
    const userLevel = level[user.role];
    switch (feature) {
      case "import": return userLevel >= 2; // team_lead+
      case "admin": return userLevel >= 3;  // manager+
      case "user_management": return userLevel >= 3;
      case "team_management": return userLevel >= 2;
      default: return true;
    }
  },
}));

export { TEAMS };
