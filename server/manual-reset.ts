import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const managementPassword = await bcrypt.hash('dehatadmin123', 10);
  await prisma.user.update({
    where: { email: 'info@dehatsweets.com' },
    data: { password: managementPassword },
  });
  console.log('Password for info@dehatsweets.com has been reset.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
