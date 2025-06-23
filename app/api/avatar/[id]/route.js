import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
    const userId = await parseInt(params.id);

    if (isNaN(userId)) {
        return new Response('Invalid ID', { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarImage: true },
        });

        if (!user || !user.avatarImage) {
            return new Response('Avatar not found', { status: 404 });
        }

        return new Response(user.avatarImage, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
