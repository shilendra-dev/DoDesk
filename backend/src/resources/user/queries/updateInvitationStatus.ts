import prisma from "@/lib/prisma";

export default async function updateInvitationStatus(invitationId: string, status: string) {
    try {
        const invitation = await prisma.workspaceInvitation.update({
            where: {
                id: invitationId,
            },
            data: {
                status,
            }
        })
        return invitation;
    } catch (error) {
        console.error("Error updating invitation status:", error);
        return null;
    }
}