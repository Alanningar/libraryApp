import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const books = await prisma.book.findMany();
        return new Response(JSON.stringify(books), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch books' }), { status: 500 });
    }
}