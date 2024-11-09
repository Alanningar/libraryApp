import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Email and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await prisma.account.findFirst({
    where: { name: email },
  });

  if (user && user.password === password) {
    return new Response(JSON.stringify({ success: true, userId: user.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ success: false, message: 'Invalid credentials.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}