import prisma from "@/lib/prisma";

export default async function updateLastActiveWorkspace(userId: string, workspaceId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { lastActiveWorkspaceId: workspaceId }
        })
        return;
    } catch (error) {
        console.error("Error updating last active workspace:", error);
        return null;
    }
}