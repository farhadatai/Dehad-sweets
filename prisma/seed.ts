
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const managementEmail = process.env.SEED_ADMIN_EMAIL || 'info@dehatsweets.com';
  const managementPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'dehatadmin123', 10);
  await prisma.user.upsert({
    where: { email: managementEmail },
    update: {
      password: managementPassword,
      name: 'Management',
      role: 'ADMIN',
    },
    create: {
      email: managementEmail,
      password: managementPassword,
      name: 'Management',
      role: 'ADMIN',
    },
  });

  const storePassword = await bcrypt.hash('store1351', 10);
  await prisma.user.upsert({
    where: { email: 'store@dehatsweets.com' },
    update: {
      name: 'Store Tablet',
      role: 'OPERATIONAL',
    },
    create: {
      email: 'store@dehatsweets.com',
      password: storePassword,
      name: 'Store Tablet',
      role: 'OPERATIONAL',
    },
  });

  const employeesData = [
    {
      email: 'ahmad.zai@dehatsweets.com',
      name: 'Ahmad Zai',
      role: 'Baker',
      hourlyRate: 22.50,
      pin: '1234'
    },
    {
      email: 'fatima.khan@dehatsweets.com',
      name: 'Fatima Khan',
      role: 'Packager',
      hourlyRate: 18.00,
      pin: '5678'
    },
        {
      email: 'samir.sharma@dehatsweets.com',
      name: 'Samir Sharma',
      role: 'Driver',
      hourlyRate: 20.00,
      pin: '9876'
    }
  ];

  for (const emp of employeesData) {
    const employeePassword = await bcrypt.hash('password123', 10);
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: emp,
      create: { ...emp, password: employeePassword },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
