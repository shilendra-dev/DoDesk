import prisma from '@/lib/prisma.js'

export default async function addUserToWorkspace(userId: string, teamId: string, role: string) {
    try {
        const user = await prisma.teamMember.create({
            data: {
                userId,
                teamId,
                role,
            },
        });
        return user;
    } catch (error) {
        console.error("Error adding user to workspace:", error);
        return null;
    }
}