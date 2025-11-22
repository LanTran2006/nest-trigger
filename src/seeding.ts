import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();


async function main() {
  console.log('Starting seed...');

  const user1 = await prisma.user.upsert({
    where: { email: 'lantrancute2006@gmail.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'lantrancute2006@gmail.com',
      totalSpent: 1500.0,
      lastPurchaseDate: new Date('2024-11-01'),
      isActive: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@test.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'user2@test.com',
      totalSpent: 800.0,
      lastPurchaseDate: new Date('2024-10-15'),
      isActive: true,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user3@test.com' },
    update: {},
    create: {
      name: 'Bob Wilson',
      email: 'user3@test.com',
      totalSpent: 350.0,
      lastPurchaseDate: new Date('2024-11-10'),
      isActive: true,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'user4@test.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'user4@test.com',
      totalSpent: 2500.0,
      lastPurchaseDate: new Date('2024-11-15'),
      isActive: false, // Inactive user
    },
  });

  console.log('Created users:', { user1, user2, user3, user4 });

  // Create test promotions
  const promotion1 = await prisma.promotion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: '🎉 Black Friday Special - 30% Off',
      description:
        'Exclusive Black Friday deal! Get 30% off on all purchases over $1000. Limited time offer for our valued customers.',
      minSpent: 1000.0,
      isActive: true,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  const promotion2 = await prisma.promotion.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: '💎 VIP Member Reward - Free Shipping',
      description:
        'Thank you for being a loyal customer! Enjoy free shipping on all orders for the next 30 days.',
      minSpent: 500.0,
      isActive: true,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  const promotion3 = await prisma.promotion.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: '🌟 New Customer Welcome - 15% Off',
      description:
        'Welcome to our store! Get 15% off on your first purchase. Start shopping now!',
      minSpent: 200.0,
      isActive: true,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  const promotion4 = await prisma.promotion.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: '❄️ Winter Sale - Expired',
      description: 'This promotion has expired.',
      minSpent: 100.0,
      isActive: true,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'), // Expired
    },
  });

  const promotion5 = await prisma.promotion.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: '🚀 Future Promotion',
      description: 'This promotion starts in the future.',
      minSpent: 100.0,
      isActive: true,
      startDate: new Date('2026-01-01'), // Future
      endDate: new Date('2026-12-31'),
    },
  });

  console.log('Created promotions:', {
    promotion1,
    promotion2,
    promotion3,
    promotion4,
    promotion5,
  });

  console.log('Seed completed successfully!');
  console.log('\n=== Test Scenarios ===');
  console.log(
    '1. user1@test.com (totalSpent: $1500) - Eligible for promotions 1, 2, 3',
  );
  console.log(
    '2. user2@test.com (totalSpent: $800) - Eligible for promotions 2, 3',
  );
  console.log(
    '3. user3@test.com (totalSpent: $350) - Eligible for promotion 3 only',
  );
  console.log(
    '4. user4@test.com (totalSpent: $2500, isActive: false) - Should NOT receive emails (inactive)',
  );
  console.log('5. Promotion 4 - Should NOT be processed (expired)');
  console.log('6. Promotion 5 - Should NOT be processed (future start date)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
