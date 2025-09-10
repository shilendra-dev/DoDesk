import prisma from '@/lib/prisma.js'

export default async function checkInvitationStatus(email: string) {
    try {
        const invitation = await prisma.workspaceInvitation.findFirst({
            where: {
                email,
                status: "pending",
            },
        });
        return invitation;
    } catch (error) {
        console.error("Error checking invitation status:", error);
        return null;
    }
}