import { execSync } from 'child_process';
import mysql from 'mysql2/promise';
import { getMasterDb } from './connectionManager';
import bcrypt from 'bcryptjs';

export async function provisionTenant(name: string, slug: string, managerEmail: string, managerPass: string) {
  const masterDb = getMasterDb();
  
  const dbName = `anelyria_${slug.replace(/-/g, '_')}`;
  const dbUser = `user_${slug.replace(/-/g, '_')}`;
  const dbPass = Math.random().toString(36).slice(-12);
  const dbHost = process.env.TENANT_DB_HOST || 'localhost';

  // 1. Create MariaDB database and user using mysql2
  console.log(`Creating database ${dbName} on ${dbHost}...`);
  
  const connection = await mysql.createConnection({
    host: dbHost,
    user: process.env.MASTER_DB_USER || 'root',
    password: process.env.MASTER_DB_PASSWORD,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`CREATE USER IF NOT EXISTS '${dbUser}'@'%' IDENTIFIED BY '${dbPass}';`);
    await connection.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${dbUser}'@'%';`);
    await connection.query(`FLUSH PRIVILEGES;`);
  } finally {
    await connection.end();
  }

  // 2. Run Prisma migrations on the new tenant DB
  // We use execSync to run the prisma CLI
  const tenantDbUrl = `mysql://${dbUser}:${dbPass}@${dbHost}:3306/${dbName}`;
  console.log(`Running migrations on ${dbName}...`);
  
  try {
    execSync(`DATABASE_URL="${tenantDbUrl}" npx prisma migrate deploy --schema=../prisma/schema.prisma`, {
      cwd: __dirname,
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Migration failed:', error);
    throw new Error('Database migration failed');
  }

  // 3. Register in Master DB
  const tenant = await masterDb.tenant.create({
    data: {
      name,
      slug,
      dbName,
      dbUser,
      dbPass,
      dbHost,
      active: true,
    }
  });

  await masterDb.userRoute.create({
    data: {
      email: managerEmail,
      tenantSlug: slug,
    }
  });

  // 4. Create initial admin user in the tenant DB
  const { PrismaClient } = await import('@prisma/client');
  const tenantPrisma = new PrismaClient({
    datasources: { db: { url: tenantDbUrl } }
  });

  try {
    const passwordHash = await bcrypt.hash(managerPass, 10);
    
    // Create the tenant record inside the tenant DB as well
    await tenantPrisma.tenant.create({
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      }
    });

    await tenantPrisma.user.create({
      data: {
        email: managerEmail,
        passwordHash,
        name: 'Admin',
        role: 'admin',
        employeeId: 'ADMIN-001',
        tenantId: tenant.id,
      }
    });
  } finally {
    await tenantPrisma.$disconnect();
  }

  console.log(`Tenant ${slug} provisioned successfully.`);
}
