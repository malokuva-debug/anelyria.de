import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getMasterDb, getTenantDb } from '../db/connectionManager';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/builder-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const masterDb = getMasterDb();

    // Check if Super Admin
    const superAdmin = await masterDb.superAdmin.findUnique({ where: { email } });
    if (superAdmin && await bcrypt.compare(password, superAdmin.passwordHash)) {
      const token = jwt.sign(
        { userId: superAdmin.id, isSuperAdmin: true, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );
      return res.json({
        token,
        user: { id: superAdmin.id, name: superAdmin.name, email: superAdmin.email, role: 'admin', isSuperAdmin: true }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Builder login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const masterDb = getMasterDb();

    // Check UserRoute to find tenant
    const route = await masterDb.userRoute.findUnique({ where: { email } });
    if (!route) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Connect to tenant DB
    const tenantDb = await getTenantDb(route.tenantSlug);
    if (!tenantDb) {
      return res.status(401).json({ message: 'Tenant not found or inactive' });
    }

    // 4. Find user in tenant DB
    const user = await tenantDb.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 5. Generate token
    const token = jwt.sign(
      { userId: user.id, tenantSlug: route.tenantSlug, role: user.role, isSuperAdmin: false },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantSlug: route.tenantSlug,
        tenantName: user.tenant.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
