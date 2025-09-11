import prisma from "@/lib/prisma";

export default async function createWorkspace(name: string, slug: string, userId: string) {
    try {
        const newWorkspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                creatorId: userId,
                teams: {
                    create: {
                        name: 'General',
                        key: 'GEN',
                        color: '#6B7280',
                        members: {
                            create: { userId, role: 'admin' }
                        }
                    }
                }
            },
            include: {
                teams: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return newWorkspace;
    } catch (error) {
        console.error("Error creating workspace:", error);
        return null;
    }
}   