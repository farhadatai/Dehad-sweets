import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany();

  for (const employee of employees) {
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        email: `employee${employee.id}@example.com`,
        password: 'password123',
        hourlyRate: 15.0,
      },
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
