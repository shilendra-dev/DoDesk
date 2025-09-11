import prisma from "@/lib/prisma";

export default async function getUserWorkspaces(userId: string) {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { teams: { some: { members: { some: { userId } } } } }
                ]
            },
            include: {
                teams: {
                    include: {
                        members: {
                            include: {
                                user: { select: { id: true, name: true, email: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return workspaces;
    } catch (error) {
        console.error("Error fetching user workspaces:", error);
        return null;
    }
}