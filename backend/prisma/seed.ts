import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@odontox.com' },
    update: {},
    create: {
      email: 'admin@odontox.com',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create Doctor User
  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.silva@odontox.com' },
    update: {},
    create: {
      email: 'dr.silva@odontox.com',
      password: hashedPassword,
      name: 'Dr. João Silva',
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  // Create Doctor Profile
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      cro: 'CRO-SP-12345',
      specialty: 'Ortodontia',
      workSchedule: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '17:00' },
        saturday: { start: '08:00', end: '12:00' },
      },
      isActive: true,
    },
  });

  console.log('✅ Doctor created:', doctor.cro);

  // Create Receptionist User
  const receptionistUser = await prisma.user.upsert({
    where: { email: 'recepcao@odontox.com' },
    update: {},
    create: {
      email: 'recepcao@odontox.com',
      password: hashedPassword,
      name: 'Maria Santos',
      role: UserRole.RECEPTIONIST,
      isActive: true,
    },
  });

  console.log('✅ Receptionist created:', receptionistUser.email);

  // Create Sample Patients
  const patient1 = await prisma.patient.upsert({
    where: { cpf: '123.456.789-00' },
    update: {},
    create: {
      name: 'Carlos Mendes',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
      email: 'carlos@example.com',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      dentalHistory: 'Paciente com histórico de cáries. Última limpeza há 6 meses.',
      tags: ['REGULAR'],
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { cpf: '987.654.321-00' },
    update: {},
    create: {
      name: 'Ana Paula Oliveira',
      cpf: '987.654.321-00',
      phone: '(11) 91234-5678',
      email: 'ana.paula@example.com',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      dentalHistory: 'Tratamento de canal realizado em 2023.',
      tags: ['VIP', 'RETURN'],
    },
  });

  console.log('✅ Sample patients created');

  // Create Sample Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor.id,
      scheduledAt: tomorrow,
      duration: 60,
      status: 'SCHEDULED',
      notes: 'Consulta de rotina - limpeza',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor.id,
      scheduledAt: nextWeek,
      duration: 90,
      status: 'SCHEDULED',
      notes: 'Retorno - avaliação de tratamento',
    },
  });

  console.log('✅ Sample appointments created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@odontox.com / admin123');
  console.log('   Doctor: dr.silva@odontox.com / admin123');
  console.log('   Receptionist: recepcao@odontox.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
