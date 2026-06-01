import { PrismaClient, Role, ChiType, ChiSource, CoinTxType, RewardCategory, RedemptionStatus, NotificationType, TaskRecurrence, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hash(p: string): Promise<string> {
  return bcrypt.hash(p, 10);
}

async function main() {
  console.log('🐙 Seeding Octopus Energy CHI Platform...');

  // Clean
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.coinTransaction.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.csvImportRow.deleteMany();
  await prisma.importBatch.deleteMany();
  await prisma.monthlySnapshot.deleteMany();
  await prisma.chiEntry.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.appSetting.deleteMany();

  // ---------- USERS ----------
  const pw = await hash('password123');
  const uJohn = await prisma.user.create({
    data: {
      employeeId: 'OE-2847', email: 'john.doe@octopus.energy', name: 'John Doe',
      passwordHash: pw, role: 'employee' as Role, department: 'Customer Service',
      avatar: 'https://i.pravatar.cc/120?img=12', streakDays: 18,
    },
  });
  const uSarah = await prisma.user.create({
    data: {
      employeeId: 'OE-1023', email: 'sarah.johnson@octopus.energy', name: 'Sarah Johnson',
      passwordHash: pw, role: 'team_lead' as Role, department: 'Customer Service',
      avatar: 'https://i.pravatar.cc/120?img=47', streakDays: 42,
    },
  });
  const uMichael = await prisma.user.create({
    data: {
      employeeId: 'OE-1456', email: 'michael.chen@octopus.energy', name: 'Michael Chen',
      passwordHash: pw, role: 'employee' as Role, department: 'Customer Service',
      avatar: 'https://i.pravatar.cc/120?img=33', streakDays: 31,
    },
  });
  const uEmily = await prisma.user.create({
    data: {
      employeeId: 'OE-1789', email: 'emily.davis@octopus.energy', name: 'Emily Davis',
      passwordHash: pw, role: 'employee' as Role, department: 'Customer Service',
      avatar: 'https://i.pravatar.cc/120?img=23', streakDays: 27,
    },
  });
  const uAlex = await prisma.user.create({
    data: {
      employeeId: 'OE-0012', email: 'alex.martinez@octopus.energy', name: 'Alex Martinez',
      passwordHash: pw, role: 'manager' as Role, department: 'Customer Service',
      avatar: 'https://i.pravatar.cc/120?img=68', streakDays: 89,
    },
  });
  const uPriya = await prisma.user.create({
    data: {
      employeeId: 'OE-0003', email: 'priya.patel@octopus.energy', name: 'Priya Patel',
      passwordHash: pw, role: 'admin' as Role, department: 'Operations',
      avatar: 'https://i.pravatar.cc/120?img=16', streakDays: 156,
    },
  });

  // ---------- TEAMS ----------
  const team = await prisma.team.create({
    data: {
      name: 'Customer Success Alpha', department: 'Customer Service', leadId: uSarah.id,
    },
  });
  await prisma.team.create({
    data: { name: 'Operations Central', department: 'Operations', leadId: uPriya.id },
  });
  await prisma.team.create({
    data: { name: 'Sales Tigers', department: 'Sales' },
  });
  await prisma.user.update({ where: { id: uJohn.id }, data: { teamId: team.id } });
  await prisma.user.update({ where: { id: uSarah.id }, data: { teamId: team.id } });
  await prisma.user.update({ where: { id: uMichael.id }, data: { teamId: team.id } });
  await prisma.user.update({ where: { id: uEmily.id }, data: { teamId: team.id } });
  await prisma.user.update({ where: { id: uAlex.id }, data: { teamId: team.id } });

  // ---------- CHI ENTRIES (John Doe - May 2024) ----------
  const entries = [
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Great customer feedback', daysAgo: 0 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'Average call quality', daysAgo: 1 },
    { type: 'positive' as ChiType, category: 'Resolution', notes: 'Excellent resolution', daysAgo: 2 },
    { type: 'negative' as ChiType, category: 'Follow-up', notes: 'Missed follow up', daysAgo: 3 },
    { type: 'positive' as ChiType, category: 'Upsell', notes: 'Successful upgrade', daysAgo: 4 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Loved the service', daysAgo: 5 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'On target', daysAgo: 6 },
    { type: 'positive' as ChiType, category: 'Feedback', notes: 'Brilliant support', daysAgo: 7 },
    { type: 'negative' as ChiType, category: 'Response Time', notes: 'Slow response', daysAgo: 8 },
    { type: 'positive' as ChiType, category: 'Complaint Resolution', notes: 'Resolved escalated case', daysAgo: 9 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: '5-star review', daysAgo: 10 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'Met expectations', daysAgo: 11 },
    { type: 'positive' as ChiType, category: 'Upsell', notes: 'Converted customer', daysAgo: 12 },
    { type: 'positive' as ChiType, category: 'Resolution', notes: 'Fast turnaround', daysAgo: 13 },
    { type: 'negative' as ChiType, category: 'Follow-up', notes: 'Forgot callback', daysAgo: 14 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Fantastic service', daysAgo: 15 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'Decent call', daysAgo: 16 },
    { type: 'positive' as ChiType, category: 'Complaint', notes: 'De-escalated well', daysAgo: 17 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Highly praised', daysAgo: 18 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'Average', daysAgo: 19 },
    { type: 'positive' as ChiType, category: 'Resolution', notes: 'Creative solution', daysAgo: 20 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Warm and friendly', daysAgo: 21 },
    { type: 'negative' as ChiType, category: 'Compliance', notes: 'Forgot disclosure', daysAgo: 22 },
    { type: 'positive' as ChiType, category: 'Upsell', notes: 'Bundle sale', daysAgo: 23 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'On script', daysAgo: 24 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Repeat customer happy', daysAgo: 25 },
    { type: 'positive' as ChiType, category: 'Resolution', notes: 'Same-day fix', daysAgo: 26 },
    { type: 'neutral' as ChiType, category: 'Call Quality', notes: 'Standard', daysAgo: 27 },
    { type: 'positive' as ChiType, category: 'Customer Feedback', notes: 'Excellent call', daysAgo: 28 },
    { type: 'positive' as ChiType, category: 'Resolution', notes: 'Quick resolution', daysAgo: 29 },
  ];

  for (const e of entries) {
    const date = new Date();
    date.setDate(date.getDate() - e.daysAgo);
    await prisma.chiEntry.create({
      data: {
        employeeId: uJohn.id,
        type: e.type,
        category: e.category,
        notes: e.notes,
        date,
        source: 'feedback' as ChiSource,
      },
    });
  }

  // ---------- MONTHLY SNAPSHOT ----------
  await prisma.monthlySnapshot.create({
    data: {
      employeeId: uJohn.id,
      month: '2024-05',
      positive: 22, neutral: 6, negative: 2, total: 30,
      score: 0.67, levelAchieved: 0,
    },
  });

  // ---------- ACHIEVEMENTS ----------
  const ach1 = await prisma.achievement.create({
    data: { title: '5 Positive CHIs', description: 'Earn your first 5 positive CHIs', icon: '🏆', rewardCoins: 50, criteria: '5_positive_chis', color: 'from-purple-500 to-violet-600' },
  });
  const ach2 = await prisma.achievement.create({
    data: { title: '30 Day Streak', description: 'Maintain activity for 30 days', icon: '🔥', rewardCoins: 200, criteria: '30_day_streak', color: 'from-pink-500 to-rose-600' },
  });
  const ach3 = await prisma.achievement.create({
    data: { title: 'Top Performer', description: 'Rank #1 on monthly leaderboard', icon: '👑', rewardCoins: 500, criteria: 'top_performer', color: 'from-amber-500 to-orange-600' },
  });
  const ach4 = await prisma.achievement.create({
    data: { title: 'Perfect Month', description: 'No negative CHIs for an entire month', icon: '⭐', rewardCoins: 300, criteria: 'perfect_month', color: 'from-emerald-500 to-teal-600' },
  });
  const ach5 = await prisma.achievement.create({
    data: { title: 'Elite Score', description: 'Reach a CHI score of 0.95+', icon: '💎', rewardCoins: 1000, criteria: 'elite_score', color: 'from-cyan-500 to-blue-600' },
  });

  await prisma.userAchievement.createMany({
    data: [
      { userId: uJohn.id, achievementId: ach1.id },
      { userId: uJohn.id, achievementId: ach3.id },
      { userId: uSarah.id, achievementId: ach1.id },
      { userId: uSarah.id, achievementId: ach2.id },
    ],
  });

  // ---------- COIN TRANSACTIONS ----------
  await prisma.coinTransaction.createMany({
    data: [
      { userId: uJohn.id, amount: 100, reason: 'Level 1 Bonus - May 2024', type: 'bonus' as CoinTxType, balanceAfter: 2450 },
      { userId: uJohn.id, amount: 50, reason: 'Achievement: 5 Positive CHIs', type: 'achievement' as CoinTxType, balanceAfter: 2350 },
      { userId: uJohn.id, amount: -200, reason: 'Redeemed: Amazon Gift Card £20', type: 'redemption' as CoinTxType, balanceAfter: 2300 },
      { userId: uJohn.id, amount: 100, reason: 'Task: Receive 5 Positive CHIs', type: 'task' as CoinTxType, balanceAfter: 2500 },
      { userId: uJohn.id, amount: 15, reason: '3 Day Streak', type: 'streak' as CoinTxType, balanceAfter: 2400 },
    ],
  });

  // ---------- REWARDS ----------
  const rewards = [
    { title: 'Amazon Gift Card £20', description: 'Digital gift card delivered to your email within 24 hours', coinPrice: 200, category: 'gift_cards' as RewardCategory, stock: 50 },
    { title: 'Octopus Energy Hoodie', description: 'Limited edition Octopus Energy branded hoodie', coinPrice: 500, category: 'merch' as RewardCategory, stock: 30 },
    { title: 'Extra Day Off', description: 'Add one extra day of paid leave to your annual allowance', coinPrice: 1500, category: 'perks' as RewardCategory, stock: 20 },
    { title: 'Starbucks Gift Card £10', description: 'Treat yourself to coffee on us', coinPrice: 100, category: 'gift_cards' as RewardCategory, stock: 100 },
    { title: 'Lunch with the CEO', description: 'Exclusive lunch with Octopus Energy CEO', coinPrice: 2000, category: 'experiences' as RewardCategory, stock: 5 },
  ];
  for (const r of rewards) {
    await prisma.reward.create({ data: r });
  }

  // ---------- TASKS ----------
  const task = await prisma.task.create({
    data: {
      title: 'Receive 5 Positive CHIs', description: 'Earn 5 positive CHI entries this week',
      rewardCoins: 100, startDate: new Date(), endDate: new Date(Date.now() + 14*86400000),
      recurring: true, recurrence: 'weekly' as TaskRecurrence, category: 'Weekly Challenge',
      target: 5, approvalRequired: false, status: 'active' as TaskStatus,
      createdBy: uAlex.id, teamId: team.id,
    },
  });
  await prisma.task.create({
    data: {
      title: 'Maintain 0.85 CHI Score', description: 'Keep your CHI score at or above 0.85 for the full month',
      rewardCoins: 150, startDate: new Date(), endDate: new Date(Date.now() + 30*86400000),
      recurring: false, recurrence: 'none' as TaskRecurrence, category: 'Monthly Goal',
      target: 1, approvalRequired: false, status: 'active' as TaskStatus,
      createdBy: uAlex.id, teamId: team.id,
    },
  });
  await prisma.taskAssignment.create({
    data: { taskId: task.id, userId: uJohn.id, progress: 3 },
  });

  // ---------- NOTIFICATIONS ----------
  await prisma.notification.createMany({
    data: [
      { userId: uJohn.id, title: 'Level 1 Bonus Achieved!', message: 'Congratulations! You reached Level 1. +100 Octo Coins', type: 'bonus' as NotificationType, read: false },
      { userId: uJohn.id, title: 'New Task Assigned', message: 'You have been assigned: Receive 5 Positive CHIs', type: 'task' as NotificationType, read: false },
      { userId: uJohn.id, title: 'Achievement Unlocked!', message: 'You earned: Top Performer 🏆 +500 coins', type: 'achievement' as NotificationType, read: true },
    ],
  });

  // ---------- SETTINGS ----------
  const settings = [
    { key: 'level1Threshold', value: '0.80' },
    { key: 'level2Threshold', value: '0.85' },
    { key: 'level3Threshold', value: '0.90' },
    { key: 'level1Reward', value: '100' },
    { key: 'level2Reward', value: '150' },
    { key: 'level3Reward', value: '250' },
    { key: 'monthlyCoinBonus', value: '50' },
    { key: 'streakDailyCoin', value: '5' },
  ];
  await prisma.appSetting.createMany({ data: settings });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Test accounts (password: password123):');
  console.log('  Employee:  john.doe@octopus.energy');
  console.log('  Team Lead: sarah.johnson@octopus.energy');
  console.log('  Manager:   alex.martinez@octopus.energy');
  console.log('  Admin:     priya.patel@octopus.energy');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
