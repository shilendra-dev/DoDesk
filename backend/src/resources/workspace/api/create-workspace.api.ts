import { ControllerFunction, AuthenticatedRequest } from "@/types/controllers/base.types"
import { CreateWorkspaceResponse } from "@/resources/workspace/types/workspaceResponse.js"
import { respondError, respondOk } from "@/utils/response.js"
import { z } from "zod"
import getWorkspaceDetailsBySlug from "../queries/getWorkspaceDetailsBySlug"
import createWorkspace from "../queries/createWorkspace"
import updateLastActiveWorkspace from "../queries/updateLastActiveWorkspace"

const createWorkspaceSchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
})

export const createWorkspaceAPI: ControllerFunction<CreateWorkspaceResponse> = async (req) => {
    const parsed = createWorkspaceSchema.safeParse(req.body);
    if(!parsed.success){
        const errorMessage = parsed.error.issues[0].message;
        return respondError(400, errorMessage);
    }

    const { name, slug } = parsed.data;
    const userId = (req as AuthenticatedRequest).user.id;
    
    const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '');

    if(cleanSlug !== slug.toLowerCase().trim()){
        return respondError(400, "Workspace URL can only contain letters, numbers, and hyphens");
    }

    try {
        //Check if workspace already exists with the same slug name
        const existingWorkspace = await getWorkspaceDetailsBySlug(cleanSlug);
        if(existingWorkspace){
            return respondError(409, "This workspace URL is already taken. Please choose a different one.");
        }
        
        //Create workspace
        const newWorkspace = await createWorkspace(name, cleanSlug, userId);
        if(!newWorkspace){
            return respondError(500, "Failed to create workspace");
        }

        //Update user's last active workspace to the newly created workspace
        await updateLastActiveWorkspace(userId, newWorkspace.id);

        return respondOk({workspace: newWorkspace}, "Workspace successfully created");
    } catch (error) {
        console.error("Error creating workspace:", error);
        return respondError(500, "Failed to create workspace");
    }
}