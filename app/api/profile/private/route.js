import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const token = cookies().get('auth_token')?.value;
  const user = await verifyToken(token);

  if (!user) return new Response('Unauthorized', { status: 401 });

  // Cek role, misalnya hanya PELAPOR boleh
  if (user.role !== 'PELAPOR') {
    return new Response('Forbidden', { status: 403 });
  }

  const result = await prisma.user.findUnique({
    where: { id: user.id },
    select: { nikNumber: true, contactNumber: true },
  });

  return Response.json(result);
}
