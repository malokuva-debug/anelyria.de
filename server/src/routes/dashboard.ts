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
    // Basic stats for dashboard
    const userCount = await db.user.count({ where: { active: true } });
    const teamCount = await db.team.count();
    
    // In a real app, you'd calculate CHI, INK, etc. here
    // For now, let's return some mock aggregates based on what's in DB
    
    res.json({
      userCount,
      teamCount,
      averageChi: 0.85, // Mocked for now
      averageInk: 75,   // Mocked for now
      averageCalls: 12.5 // Mocked for now
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
