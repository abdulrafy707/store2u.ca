import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
    }

    const tokenExpiresAt = new Date(user.verificationTokenExpires);
    if (new Date() > tokenExpiresAt) {
      return new Response(JSON.stringify({ error: 'Token has expired' }), { status: 400 });
    }

    // Invalidate the token before doing anything else
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null, // Invalidate token immediately
        verificationTokenExpires: null,
      },
    });

    return new Response(JSON.stringify({ message: 'Email verified successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
