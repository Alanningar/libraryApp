import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const bookId = url.searchParams.get('bookId');

  if (!bookId) {
    return new Response(JSON.stringify({ success: false, message: 'Book ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const loans = await prisma.loan.findMany({
      where: { bookId },
      select: { userId: true, return: true },
    });

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { stock: true }
    });

    return new Response(JSON.stringify({ loans, stock: book.stock }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to fetch loans.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  const { userId, bookId } = await req.json();

  if (!userId || !bookId) {
    return new Response(JSON.stringify({ success: false, message: 'User ID and Book ID are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { stock: true }
    });

    if (!book || book.stock <= 0) {
      return new Response(JSON.stringify({ success: false, message: 'Book is out of stock.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        return: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { stock: { decrement: 1 } }
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

    await prisma.book.update({
      where: { id: bookId },
      data: { stock: { increment: 1 } }
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
