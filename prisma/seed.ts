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
                    description: 'Super Admin',
                    status: true,
                },
            },
        },
    });

    console.log({ superAdmin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
