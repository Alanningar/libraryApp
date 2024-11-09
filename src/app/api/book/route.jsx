import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const genre = url.searchParams.get('genre');
        const inStockOnly = url.searchParams.get('inStockOnly') === 'true';
        const id = url.searchParams.get('id');

        if (id) {
            const book = await prisma.book.findUnique({
                where: { id: new ObjectId(id) },
            });

            if (!book) {
                return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
            }

            return new Response(JSON.stringify(book), { status: 200 });
        }

        let books;
        if (genre && genre !== 'None') {
            books = await prisma.book.findMany({
                where: {
                    subgenre: {
                        contains: genre,
                    },
                    ...(inStockOnly && { stock: { gt: 0 } }), 
                },
            });
        } else {
            books = await prisma.book.findMany({
                where: {
                    ...(inStockOnly && { stock: { gt: 0 } }), 
                },
            });
        }

        return new Response(JSON.stringify(books), { status: 200 });
    } catch (error) {
        console.error('Error fetching books:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch books' }), { status: 500 });
    }
}