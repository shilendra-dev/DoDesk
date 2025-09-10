import prisma from "@/lib/prisma";

export default async function getDefaultWorkspaceTeam(workspaceId: string) {
    try {
        const team = await prisma.team.findFirst({
            where: {
                workspaceId,
                key: 'GEN'
            }
        })
        return team;
    } catch (error) {
        console.error("Error fetching default workspace team:", error);
        return null;
    }
}