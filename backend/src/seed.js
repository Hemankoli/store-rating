require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);
  const user = await prisma.profile.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@example.com',
      password: hash,
      address: '1 Admin Plaza, Admin City',
      role: 'admin',
    },
  });
  console.log('Seed complete. Admin user:', user.email);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
