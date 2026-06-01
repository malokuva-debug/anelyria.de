import { PrismaClient } from '@prisma/client';
import { PrismaClient as MasterPrismaClient } from '../generated/master-client';

const masterPrisma = new MasterPrismaClient();

const tenantClients: Map<string, PrismaClient> = new Map();

export const getMasterDb = () => masterPrisma;

export async function getTenantDb(tenantSlug: string): Promise<PrismaClient | null> {
  if (tenantClients.has(tenantSlug)) {
    return tenantClients.get(tenantSlug)!;
  }

  const tenant = await masterPrisma.tenant.findUnique({
    where: { slug: tenantSlug }
  });

  if (!tenant || !tenant.active) {
    return null;
  }

  // DATABASE_URL format: mysql://user:pass@host:port/dbname
  const databaseUrl = `mysql://${tenant.dbUser}:${tenant.dbPass}@${tenant.dbHost}:3306/${tenant.dbName}`;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  tenantClients.set(tenantSlug, prisma);
  return prisma;
}

export async function closeAllConnections() {
  await masterPrisma.$disconnect();
  for (const client of tenantClients.values()) {
    await client.$disconnect();
  }
  tenantClients.clear();
}
