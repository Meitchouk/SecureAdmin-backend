import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password', 10);

    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@example.com' },
        update: {},
        create: {
            username: 'superadmin',
            email: 'superadmin@example.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: {
                create: {
                    description: 'super_admin',
                    status: true,
                },
            },
        },
    });
    console.log({ superAdmin });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin',
            role: {
                create: {
                    description: 'admin',
                    status: true,
                },
            },
        },
    });
    console.log({ admin });

    const guest = await prisma.user.upsert({
        where: { email: 'guest@example.com' },
        update: {},
        create: {
            username: 'guest',
            email: 'guest@example.com',
            password: hashedPassword,
            name: 'Guest',
            role: {
                create: {
                    description: 'guest',
                    status: true,
                },
            },
        },
    });
    console.log({ guest });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
