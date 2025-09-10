import prisma from '@/lib/prisma.js'

export default async function fetchUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}