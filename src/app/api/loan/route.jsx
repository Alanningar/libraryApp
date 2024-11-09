import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId, bookId } = await req.json();

  if (!userId || !bookId) {
    return new Response(JSON.stringify({ success: false, message: 'User ID and Book ID are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        return: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Set return date 1 month from now
      },
    });

    return new Response(JSON.stringify({ success: true, loan }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to create loan.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const bookId = url.searchParams.get('bookId');

  if (!userId || !bookId) {
    return new Response(JSON.stringify({ success: false, message: 'User ID and Book ID are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.loan.deleteMany({
      where: {
        userId: userId,
        bookId: bookId,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error returning loan:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to return loan.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
