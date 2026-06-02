import { PrismaClient as MasterPrismaClient } from '../src/generated/master-client';
import * as bcrypt from 'bcryptjs';

const masterPrisma = new MasterPrismaClient();

async function main() {
  console.log('🌱 Seeding Master Database...');

  const email = 'valmir.malooku@icloud.com';
  const password = 'Lenoxvm123.';

  // Check if super admin already exists
  const existing = await masterPrisma.superAdmin.findFirst();
  if (existing) {
    console.log('⚠️  Super admin already exists. Skipping seed.');
    console.log(`   Existing admin: ${existing.email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await masterPrisma.superAdmin.create({
    data: {
      email,
      passwordHash,
      name: 'Super Admin',
    },
  });

  console.log('✅ Super admin created successfully!');
  console.log('');
  console.log('   Email:    ' + email);
  console.log('   Password: ' + password);
  console.log('');
  console.log('You can now log in at https://anelyria.de/lyriabuilder/login');
}

main()
  .catch((e) => {
    console.error('❌ Master seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await masterPrisma.$disconnect();
  });