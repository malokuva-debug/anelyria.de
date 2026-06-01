import { Router, Response } from 'express';
import { getTenantDb } from '../db/connectionManager';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;

  if (!tenantSlug) {
    return res.status(400).json({ message: 'Tenant context required' });
  }

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const userCount = await db.user.count({ where: { active: true } });
    const teamCount = await db.team.count();

    // Calculate actual CHI stats from MetricEntry
    const metricEntries: any[] = await db.metricEntry.findMany();
    const positive = metricEntries.filter((e: any) => e.chi === 'positive').length;
    const neutral = metricEntries.filter((e: any) => e.chi === 'neutral').length;
    const negative = metricEntries.filter((e: any) => e.chi === 'negative').length;
    const total = positive + neutral + negative;
    const averageChi = total > 0 ? (positive - negative) / total : 0;

    // INK/Calls averages
    const inkEntries = metricEntries.filter((e: any) => e.ink > 0);
    const averageInk = inkEntries.length > 0
      ? inkEntries.reduce((sum: number, e: any) => sum + e.ink, 0) / inkEntries.length
      : 0;

    const callsEntries = metricEntries.filter((e: any) => e.callsPerHour > 0);
    const averageCalls = callsEntries.length > 0
      ? callsEntries.reduce((sum: number, e: any) => sum + e.callsPerHour, 0) / callsEntries.length
      : 0;

    res.json({
      userCount,
      teamCount,
      averageChi: Math.round(averageChi * 100) / 100,
      averageInk: Math.round(averageInk),
      averageCalls: Math.round(averageCalls * 10) / 10,
      chiBreakdown: { positive, neutral, negative, total }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Get all metric entries for the tenant
router.get('/metrics', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const entries = await db.metricEntry.findMany({
      include: { User: true },
      orderBy: { date: 'desc' },
      take: 100,
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics' });
  }
});

// Get all users for the tenant
router.get('/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const users = await db.user.findMany({
      include: { team: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all tasks for the tenant
router.get('/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const tasks = await db.task.findMany({
      include: { assignments: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get all rewards for the tenant
router.get('/rewards', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const rewards = await db.reward.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards' });
  }
});

// Get achievements for the tenant
router.get('/achievements', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const achievements = await db.achievement.findMany({
      where: { active: true },
    });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements' });
  }
});

// Get leaderboard for the tenant
router.get('/leaderboard', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    // Aggregate metric entries per user for leaderboard
    const users = await db.user.findMany({
      where: { active: true },
      include: {
        metrics: true,
        transactions: { orderBy: { createdAt: 'desc' }, take: 1 },
      }
    });

    const leaderboard = (users as any[]).map((user: any) => {
      const entries = user.metrics || [];
      const pos = entries.filter((e: any) => e.chi === 'positive').length;
      const neg = entries.filter((e: any) => e.chi === 'negative').length;
      const total = entries.length;
      const score = total > 0 ? (pos - neg) / total : 0;
      const coins = user.transactions && user.transactions.length > 0 ? user.transactions[0].balanceAfter : 0;
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        score: Math.round(score * 100) / 100,
        coins,
        department: user.department,
      };
    });

    leaderboard.sort((a: any, b: any) => b.score - a.score || b.coins - a.coins);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Get coin transactions for the tenant
router.get('/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const transactions = await db.coinTransaction.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get audit logs for the tenant
router.get('/audit-logs', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const logs = await db.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

// Get notifications for current user
router.get('/notifications', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug, userId } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get teams for the tenant
router.get('/teams', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const teams = await db.team.findMany({
      include: {
        members: true,
        lead: true,
      },
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams' });
  }
});

// Get tenant settings
router.get('/settings', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { tenantSlug } = req.user!;
  if (!tenantSlug) return res.status(400).json({ message: 'Tenant context required' });

  const db = await getTenantDb(tenantSlug);
  if (!db) return res.status(404).json({ message: 'Tenant not found' });

  try {
    const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug } });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

export default router;