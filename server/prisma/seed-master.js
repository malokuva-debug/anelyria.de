// Pre-compiled seed script for Plesk Node.js 25 compatibility
// Equivalent to seed-master.ts but runs with plain node (no tsx needed)
const { PrismaClient } = require('../generated/master-client');
const bcrypt = require('bcryptjs');

async function main() {
  const masterPrisma = new PrismaClient();

  try {
    console.log('🌱 Seeding Master Database...');

    const email = process.env.SUPER_ADMIN_EMAIL || 'valmir.malooku@icloud.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'Lenoxvm123.';

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
    console.log('You can now log in at https://app.anelyria.de/lyriabuilder/login');
  } finally {
    await masterPrisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Master seed failed:', e);
  process.exit(1);
});