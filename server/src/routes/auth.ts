import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getMasterDb, getTenantDb } from '../db/connectionManager';
import { sendPasswordResetEmail } from '../services/email';

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

router.post('/register-first-admin', async (req, res) => {
  const { email, password, name, setupKey } = req.body;

  // The setup key must match the environment variable
  if (setupKey !== process.env.SETUP_KEY) {
    return res.status(403).json({ message: 'Invalid setup key' });
  }

  try {
    const masterDb = getMasterDb();

    // Check if any super admin already exists
    const existing = await masterDb.superAdmin.findFirst();
    if (existing) {
      return res.status(400).json({ message: 'Super admin already exists. Use builder-login instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await masterDb.superAdmin.create({
      data: { email, passwordHash, name }
    });

    const token = jwt.sign(
      { userId: admin.id, isSuperAdmin: true, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin', isSuperAdmin: true }
    });
  } catch (error) {
    console.error('Register admin error:', error);
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

    // Connect to tenant DB
    const tenantDb = await getTenantDb(route.tenantSlug);
    if (!tenantDb) {
      return res.status(401).json({ message: 'Tenant not found or inactive' });
    }

    // Find user in tenant DB
    const user = await tenantDb.user.findFirst({
      where: { email },
      include: { tenant: true }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
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
        tenantName: (user.tenant as any)?.name || user.tenantId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const masterDb = getMasterDb();

    // Check if it's a super admin
    const superAdmin = await masterDb.superAdmin.findUnique({ where: { email } });
    if (superAdmin) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      // Store reset token in master DB super admin record or a separate mechanism
      // For now, send it via email
      await sendPasswordResetEmail(email, resetToken);
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Check UserRoute for tenant users
    const route = await masterDb.userRoute.findUnique({ where: { email } });
    if (!route) {
      // Don't reveal whether the email exists
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const tenantDb = await getTenantDb(route.tenantSlug);
    if (!tenantDb) {
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const user = await tenantDb.user.findFirst({ where: { email } });
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Create password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);

    await tenantDb.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      }
    });

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  try {
    const masterDb = getMasterDb();

    // Check all tenants for a matching reset token
    const tenants = await masterDb.tenant.findMany({ where: { active: true } });

    for (const tenant of tenants) {
      const tenantDb = await getTenantDb(tenant.slug);
      if (!tenantDb) continue;

      const resetTokens = await tenantDb.passwordResetToken.findMany({
        where: {
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      for (const storedToken of resetTokens) {
        if (await bcrypt.compare(token, storedToken.token)) {
          const passwordHash = await bcrypt.hash(password, 10);
          await tenantDb.user.update({
            where: { id: storedToken.userId },
            data: { passwordHash }
          });
          await tenantDb.passwordResetToken.update({
            where: { id: storedToken.id },
            data: { usedAt: new Date() }
          });
          return res.json({ message: 'Password has been reset successfully.' });
        }
      }
    }

    res.status(400).json({ message: 'Invalid or expired reset token.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;