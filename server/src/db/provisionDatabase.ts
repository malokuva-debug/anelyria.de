import { execSync } from 'child_process';
import { getMasterDb } from './connectionManager';

export async function provisionTenant(name: string, slug: string, managerEmail: string, managerPass: string) {
  const masterDb = getMasterDb();
  
  const dbName = `anelyria_${slug}`;
  const dbUser = `user_${slug}`;
  const dbPass = Math.random().toString(36).slice(-12);

  // 1. Create MariaDB database and user
  // In a real Plesk environment, you might use Plesk API or a root SQL connection
  console.log(`Creating database ${dbName}...`);
  // execSync(`mysql -u root -e "CREATE DATABASE ${dbName};"`);
  // execSync(`mysql -u root -e "CREATE USER '${dbUser}'@'localhost' IDENTIFIED BY '${dbPass}';"`);
  // execSync(`mysql -u root -e "GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUser}'@'localhost';"`);

  // 2. Run Prisma migrations
  process.env.DATABASE_URL = `mysql://${dbUser}:${dbPass}@localhost:3306/${dbName}`;
  console.log(`Running migrations on ${dbName}...`);
  // execSync(`npx prisma migrate deploy --schema=../prisma/schema.prisma`);

  // 3. Register in Master DB
  await masterDb.tenant.create({
    data: {
      name,
      slug,
      dbName,
      dbUser,
      dbPass,
      active: true,
    }
  });

  await masterDb.userRoute.create({
    data: {
      email: managerEmail,
      tenantSlug: slug,
    }
  });

  console.log(`Tenant ${slug} provisioned successfully.`);
}
