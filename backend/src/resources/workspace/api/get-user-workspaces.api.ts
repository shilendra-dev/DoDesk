import { GetUserWorkspacesResponse } from "@/resources/workspace/types/workspaceResponse";
import { ControllerFunction } from "@/types/controllers/base.types";
import { respondError, respondOk } from "@/utils/response";
import getUserWorkspaces from "@/resources/workspace/queries/getUserWorkspaces.js";
import { AuthenticatedRequest } from "@/types/controllers/base.types";

export const getUserWorkspacesAPI: ControllerFunction<GetUserWorkspacesResponse> = async (req) => {
    try{
        const userId = (req as AuthenticatedRequest).user.id;
        const workspaces = await getUserWorkspaces(userId);
        
        if(!workspaces || workspaces.length === 0){
            return respondOk(workspaces, "No workspaces found for this user");
        }
        return respondOk(workspaces, "User workspaces fetched successfully");
    }catch(error){
        console.error("Error fetching user workspaces:", error);
        return respondError(500, "Server error");
    }
}