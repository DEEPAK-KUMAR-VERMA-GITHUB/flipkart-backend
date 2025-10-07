import * as bcrypt from 'bcryptjs';
import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@flipkart.com' },
        update: {},
        create: {
            email: 'admin@flipkart.com',
            passwordHash: adminPassword,
            fullName: 'Admin User',
            role: 'ADMIN',
            mobileNumber: '+919876543201',
        },
    });

    // Create test customer
    const customerPassword = await bcrypt.hash('Customer@123', 12);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            passwordHash: customerPassword,
            fullName: 'John Doe',
            role: 'CUSTOMER',
            mobileNumber: '+919876543210',
        },
    });

    // Create test vendor
    const vendorPassword = await bcrypt.hash('Vendor@123', 12);
    const vendor = await prisma.user.upsert({
        where: { email: 'vendor@example.com' },
        update: {},
        create: {
            email: 'vendor@example.com',
            passwordHash: vendorPassword,
            fullName: 'Vendor Shop',
            role: 'VENDOR',
            mobileNumber: '+919876543211',
        },
    });

    console.log('✅ Seeding completed!');
    console.log('👤 Admin:', admin.email);
    console.log('👤 Customer:', customer.email);
    console.log('👤 Vendor:', vendor.email);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
