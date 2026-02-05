const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const subscriptions = await prisma.pushSubscription.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    role: true
                }
            }
        }
    });
    console.log('--- Push Subscriptions ---');
    console.log(JSON.stringify(subscriptions, null, 2));
    await prisma.$disconnect();
}

main();
