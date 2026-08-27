import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Panchangam Database...');

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const userPasswordHash = await bcrypt.hash('user123', salt);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      name: 'Panchangam Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  });
  console.log('Admin user ready:', admin.phone, '(Password: admin123)');

  // 2. Demo User
  const user = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210',
      name: 'R. Govindarajan',
      passwordHash: userPasswordHash,
      role: 'USER'
    }
  });
  console.log('Demo user ready:', user.phone, '(Password: user123)');

  // 3. Sample Ancestor Shraddha Records
  await prisma.shraddhaProfile.deleteMany({ where: { userId: user.id } });

  await prisma.shraddhaProfile.createMany({
    data: [
      {
        userId: user.id,
        personName: 'Late K. Ramaswamy (Father)',
        relationship: 'FATHER',
        gotra: 'Kashyapa',
        tradition: 'ADVAITA_SMARTHA',
        system: 'LUNAR',
        chandraMasa: 'Bhadrapada',
        paksha: 'Krishna',
        tithiNumber: 8,
        city: 'Chennai',
        latitude: 13.0827,
        longitude: 80.2707,
        timezone: 'Asia/Kolkata',
        notes: 'Annual Shraddha with Hiranya/Brahmana bhojana'
      },
      {
        userId: user.id,
        personName: 'Late Kalyani Ammal (Mother)',
        relationship: 'MOTHER',
        gotra: 'Kashyapa',
        tradition: 'ADVAITA_SMARTHA',
        system: 'LUNAR',
        chandraMasa: 'Karttika',
        paksha: 'Shukla',
        tithiNumber: 11,
        city: 'Chennai',
        latitude: 13.0827,
        longitude: 80.2707,
        timezone: 'Asia/Kolkata',
        notes: 'Fasting and Pitru Tarpanam'
      }
    ]
  });

  console.log('Sample Ancestor Shraddha records created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
