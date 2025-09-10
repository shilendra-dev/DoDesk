import prisma from '@/lib/prisma.js'

export default async function getUserWithWorkspaceDetails(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                lastActiveWorkspace: true,
            },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}