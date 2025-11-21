import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (user.role !== 'PELAPOR') {
    return new Response('Forbidden', { status: 403 });
  }

  const result = await prisma.user.findUnique({
    where: { id: user.id },
    select: { nikNumber: true, contactNumber: true },
  });

  return Response.json(result);
}
