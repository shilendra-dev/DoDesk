import prisma from '@/lib/prisma.js'

export default async function createUser(email: string, password: string, name: string) {
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                name,
            }
        })
        return newUser;
    }catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}