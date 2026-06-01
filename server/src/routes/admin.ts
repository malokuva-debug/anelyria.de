import { Router } from 'express';
import { getMasterDb } from '../db/connectionManager';
import { authMiddleware, superAdminMiddleware } from '../middleware/auth';
import { provisionTenant } from '../db/provisionDatabase';

const router = Router();

// All routes here require super admin
router.use(authMiddleware);
router.use(superAdminMiddleware);

// Get all tenants
router.get('/tenants', async (req, res) => {
  try {
    const masterDb = getMasterDb();
    const tenants = await masterDb.tenant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenants' });
  }
});

// Create tenant
router.post('/tenants', async (req, res) => {
  const { name, slug, managerEmail, managerPassword } = req.body;
  try {
    await provisionTenant(name, slug, managerEmail, managerPassword);
    res.status(201).json({ message: 'Tenant created and provisioned successfully' });
  } catch (error: any) {
    console.error('Provisioning error:', error);
    res.status(500).json({ message: error.message || 'Error creating tenant' });
  }
});

// Update tenant
router.patch('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;
  try {
    const masterDb = getMasterDb();
    const tenant = await masterDb.tenant.update({
      where: { id },
      data: { name, active }
    });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tenant' });
  }
});

// Delete (deactivate) tenant
router.delete('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const masterDb = getMasterDb();
    await masterDb.tenant.update({
      where: { id },
      data: { active: false }
    });
    res.json({ message: 'Tenant deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating tenant' });
  }
});

export default router;
