
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const upsertProduct = async (data: {
  name: string;
  category: string;
  boxSize: string;
  unitsPerCase: number;
  costPerBox: number;
  wholesalePricePerBox: number;
  inventory: number;
}) => {
  const existing = await prisma.product.findFirst({ where: { name: data.name } });

  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: { ...data, isActive: true },
    });
  }

  return prisma.product.create({
    data: { ...data, isActive: true },
  });
};

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

  const products = await Promise.all([
    upsertProduct({
      name: 'Cream Rolls',
      category: 'Bakery',
      boxSize: '12 pieces',
      unitsPerCase: 12,
      costPerBox: 14,
      wholesalePricePerBox: 28,
      inventory: 96,
    }),
    upsertProduct({
      name: 'Root',
      category: 'Bakery',
      boxSize: '24 pieces',
      unitsPerCase: 24,
      costPerBox: 18,
      wholesalePricePerBox: 36,
      inventory: 84,
    }),
    upsertProduct({
      name: 'Malida',
      category: 'Bakery',
      boxSize: '5 lb',
      unitsPerCase: 6,
      costPerBox: 20,
      wholesalePricePerBox: 42,
      inventory: 60,
    }),
    upsertProduct({
      name: 'Khajoor',
      category: 'Bakery',
      boxSize: '24 pieces',
      unitsPerCase: 24,
      costPerBox: 16,
      wholesalePricePerBox: 34,
      inventory: 72,
    }),
    upsertProduct({
      name: 'Afghan Torshi',
      category: 'Savory',
      boxSize: '32oz',
      unitsPerCase: 24,
      costPerBox: 6.5,
      wholesalePricePerBox: 12,
      inventory: 144,
    }),
    upsertProduct({
      name: 'Afghan Chatni Green / Red',
      category: 'Savory',
      boxSize: '32oz',
      unitsPerCase: 24,
      costPerBox: 5.75,
      wholesalePricePerBox: 11,
      inventory: 120,
    }),
    upsertProduct({
      name: 'Masali Deg',
      category: 'Savory',
      boxSize: '16oz',
      unitsPerCase: 24,
      costPerBox: 4.5,
      wholesalePricePerBox: 9,
      inventory: 132,
    }),
    upsertProduct({
      name: 'Masala Dar Pepper',
      category: 'Savory',
      boxSize: '16oz',
      unitsPerCase: 24,
      costPerBox: 4.75,
      wholesalePricePerBox: 9.5,
      inventory: 132,
    }),
  ]);

  const storePasswordForCustomers = await bcrypt.hash('partner123', 10);
  const storeSeeds = [
    {
      name: 'Kabul Market',
      owner: 'Naseer Ahmad',
      phone: '(510) 555-0124',
      address: '3120 Mission Blvd, Fremont, CA',
      email: 'kabul.market@example.com',
      notes: 'Weekly wholesale delivery',
    },
    {
      name: 'Pamiry Foods',
      owner: 'Farzana Rahimi',
      phone: '(925) 555-0198',
      address: '205 Main St, Concord, CA',
      email: 'pamiry.foods@example.com',
      notes: 'Prefers Friday delivery',
    },
    {
      name: 'Aryana Grocery',
      owner: 'Hameed Wali',
      phone: '(408) 555-0176',
      address: '880 Story Rd, San Jose, CA',
      email: 'aryana.grocery@example.com',
      notes: 'Needs monthly invoice summary',
    },
  ];

  const stores = [];
  for (const storeData of storeSeeds) {
    const store = await prisma.store.upsert({
      where: { email: storeData.email },
      update: { ...storeData, isActive: true },
      create: { ...storeData, isActive: true },
    });

    await prisma.user.upsert({
      where: { email: storeData.email },
      update: {
        name: storeData.owner,
        storeName: storeData.name,
        storeId: store.id,
        address: storeData.address,
        phone: storeData.phone,
        role: 'CUSTOMER',
        accountStatus: 'APPROVED',
      },
      create: {
        email: storeData.email,
        password: storePasswordForCustomers,
        name: storeData.owner,
        storeName: storeData.name,
        storeId: store.id,
        address: storeData.address,
        phone: storeData.phone,
        role: 'CUSTOMER',
        accountStatus: 'APPROVED',
      },
    });

    stores.push(store);
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  await prisma.productionGoal.upsert({
    where: { month_year: { month: currentMonth, year: currentYear } },
    update: { goal: 850 },
    create: { month: currentMonth, year: currentYear, goal: 850 },
  });

  if ((await prisma.expense.count()) === 0) {
    await prisma.expense.createMany({
      data: [
        { item: 'Flour and pastry supplies', category: 'Ingredients', amount: 1240, date: new Date(currentYear, currentMonth - 1, 3) },
        { item: 'Packaging boxes', category: 'Packaging', amount: 680, date: new Date(currentYear, currentMonth - 1, 8) },
        { item: 'Delivery fuel', category: 'Delivery', amount: 315, date: new Date(currentYear, currentMonth - 1, 12) },
      ],
    });
  }

  if ((await prisma.order.count()) === 0) {
    const orderSeeds = [
      { store: stores[0], product: products[0], quantity: 18, status: 'delivered', paid: 'paid', day: 6 },
      { store: stores[0], product: products[4], quantity: 24, status: 'delivered', paid: 'paid', day: 7 },
      { store: stores[1], product: products[2], quantity: 14, status: 'ready', paid: 'unpaid', day: 14 },
      { store: stores[1], product: products[6], quantity: 20, status: 'in_production', paid: 'unpaid', day: 16 },
      { store: stores[2], product: products[1], quantity: 16, status: 'pending', paid: 'unpaid', day: 21 },
      { store: stores[2], product: products[7], quantity: 22, status: 'delivered', paid: 'paid', day: 18 },
    ];

    for (const seed of orderSeeds) {
      await prisma.order.create({
        data: {
          storeId: seed.store.id,
          productId: seed.product.id,
          quantity: seed.quantity,
          pricePerBox: seed.product.wholesalePricePerBox,
          totalPrice: seed.quantity * seed.product.wholesalePricePerBox,
          deliveryDate: new Date(currentYear, currentMonth - 1, seed.day),
          paymentStatus: seed.paid,
          orderStatus: seed.status,
          deliveredBy: seed.status === 'delivered' ? 'Samir Sharma' : undefined,
          receiverName: seed.status === 'delivered' ? seed.store.owner : undefined,
          notes: 'Seeded production data',
        },
      });
    }
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
