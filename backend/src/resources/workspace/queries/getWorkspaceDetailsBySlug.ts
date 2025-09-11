import prisma from "@/lib/prisma";

export default async function getWorkspaceDetailsBySlug(slug: string) {
    try{
        const workspace = await prisma.workspace.findUnique({ where: { slug } }); //only takes a clean lower cased slug
        return workspace;
    }catch(error){
        console.error("Error fetching workspace details:", error);
        return null;
    }
}
