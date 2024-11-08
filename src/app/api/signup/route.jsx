import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response
            (JSON.stringify({ success: false, message: 'Email and password are required.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    }

    try {
        const existingUser = await prisma.account.findFirst({
            where: { name: email },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ success: false, message: 'Email already in use' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const newUser = await prisma.account.create({
            data: {
                name: email,
                password: password,
            },
        });

        return new Response(
            JSON.stringify({ success: true, userId: newUser.id }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ success: false, message: 'An error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}