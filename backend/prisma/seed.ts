import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');

  // 1. Create Roles
  const superadminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: { name: 'SUPERADMIN', description: 'Full platform super administrator access' }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator access to manage clients and analytics' }
  });

  const clientRole = await prisma.role.upsert({
    where: { name: 'CLIENT' },
    update: {},
    create: { name: 'CLIENT', description: 'Client access to dashboard and reports' }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER', description: 'Regular end user access' }
  });

  console.log('Roles created/upserted successfully.');

  // 2. Create Default Client
  const defaultClient = await prisma.client.upsert({
    where: { id: 'client-default' },
    update: {},
    create: {
      id: 'client-default',
      companyName: 'Default Client Corp',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '1234567890',
      plan: 'GROWTH',
      status: 'ACTIVE'
    }
  });

  console.log('Default client created/upserted successfully.');

  // 3. Create Users
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);

  // Superadmin
  const superadminUser = await prisma.user.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: { passwordHash, roleId: superadminRole.id },
    create: {
      id: 'user-superadmin',
      email: 'superadmin@gmail.com',
      name: 'Super Administrator',
      passwordHash,
      roleId: superadminRole.id
    }
  });

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { passwordHash, roleId: adminRole.id, clientId: defaultClient.id },
    create: {
      id: 'user-admin',
      email: 'admin@gmail.com',
      name: 'Administrator',
      passwordHash,
      roleId: adminRole.id,
      clientId: defaultClient.id
    }
  });

  // Legacy Admin (for backward compatibility)
  await prisma.user.upsert({
    where: { email: 'admin@aigrowthsystems.com' },
    update: { passwordHash, roleId: adminRole.id, clientId: defaultClient.id },
    create: {
      email: 'admin@aigrowthsystems.com',
      name: 'Admin User',
      passwordHash,
      roleId: adminRole.id,
      clientId: defaultClient.id
    }
  });

  console.log('Users created/upserted successfully.');

  // 4. Create Mock Leads
  const lead1 = await prisma.lead.upsert({
    where: { id: 'lead-1' },
    update: {},
    create: {
      id: 'lead-1',
      name: 'Sarah Connor',
      email: 'sarah@skynet.com',
      phone: '555-0199',
      business: 'Tech Corp',
      status: 'NEW',
      source: 'Web Form',
      clientId: defaultClient.id
    }
  });

  const lead2 = await prisma.lead.upsert({
    where: { id: 'lead-2' },
    update: {},
    create: {
      id: 'lead-2',
      name: 'John Connor',
      email: 'john@resistance.net',
      phone: '555-0122',
      business: 'Security Inc',
      status: 'CONTACTED',
      source: 'Missed Call',
      clientId: defaultClient.id
    }
  });

  console.log('Mock leads created/upserted successfully.');

  // 5. Create Mock Appointments
  await prisma.appointment.upsert({
    where: { id: 'appt-1' },
    update: {},
    create: {
      id: 'appt-1',
      clientId: defaultClient.id,
      leadId: lead1.id,
      title: 'AI Receptionist Onboarding Consultation',
      scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days in future
      status: 'PENDING',
      notes: 'Wants custom script for tech support agency.',
      createdById: adminUser.id
    }
  });

  await prisma.appointment.upsert({
    where: { id: 'appt-2' },
    update: {},
    create: {
      id: 'appt-2',
      clientId: defaultClient.id,
      leadId: lead2.id,
      title: 'Missed Call Recovery Deep Dive',
      scheduledAt: new Date(Date.now() + 86400000 * 4), // 4 days in future
      status: 'CONFIRMED',
      notes: 'Interested in GHL integration.',
      createdById: adminUser.id
    }
  });

  console.log('Mock appointments created/upserted successfully.');

  // Delete existing chatbot logs to prevent duplication on reseed
  await prisma.chatbotLog.deleteMany({ where: { sessionId: 'sess-123' } });

  // 6. Create Chatbot Logs
  await prisma.chatbotLog.createMany({
    data: [
      {
        id: 'chatlog-1',
        sessionId: 'sess-123',
        role: 'user',
        message: 'Hello, what are your pricing packages?',
        metadata: JSON.stringify({ source: 'simulation' }),
        createdAt: new Date(Date.now() - 300000)
      },
      {
        id: 'chatlog-2',
        sessionId: 'sess-123',
        role: 'assistant',
        message: 'We have three packages designed for real ROI. The Starter at $1,497/mo, Growth at $2,997/mo, and Dominance at $5,997/mo. Which of these sounds like the right fit for your business?',
        metadata: JSON.stringify({ source: 'simulation' }),
        createdAt: new Date(Date.now() - 280000)
      }
    ]
  });

  console.log('Mock chatbot logs created successfully.');

  // Delete existing seed audit logs to prevent duplication
  await prisma.auditLog.deleteMany({
    where: {
      action: { in: ['SYSTEM_BOOT', 'USER_LOGIN'] },
      actor: { in: ['system', 'superadmin@gmail.com'] }
    }
  });

  // 7. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        id: 'audit-1',
        action: 'SYSTEM_BOOT',
        actor: 'system',
        target: 'system',
        details: 'Express Server bootstrapped with SQLite database configuration',
        ipAddress: '127.0.0.1',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        userId: superadminUser.id
      },
      {
        id: 'audit-2',
        action: 'USER_LOGIN',
        actor: 'superadmin@gmail.com',
        target: 'superadmin@gmail.com',
        details: 'Super administrator logged in successfully',
        ipAddress: '127.0.0.1',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        userId: superadminUser.id
      }
    ]
  });

  console.log('Mock audit logs created successfully.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
