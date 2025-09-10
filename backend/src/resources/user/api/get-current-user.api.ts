import { ControllerFunction, GetCurrentUserResponse } from "@/types";
import { AuthenticatedRequest } from "@/types/controllers/base.types";
import { respondError, respondOk } from "@/utils/response";
import getUserWithWorkspaceDetails from "../queries/getUserWithWorkspaceDetails";

export const getCurrentUserAPI: ControllerFunction<GetCurrentUserResponse> = async (req) => {

    const userId = (req as AuthenticatedRequest).user.id;
    try {
        // Get user and last active workspace
        const user = await getUserWithWorkspaceDetails(userId);
        if (!user) {
            return respondError(404, "User not found");
        }
        const currentUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            lastActiveWorkspaceId: user.lastActiveWorkspaceId,
            lastActiveWorkspace: user.lastActiveWorkspace,
        }
        return respondOk(currentUser, "User fetched successfully");
    }catch(error){
        console.error("Error fetching user:", error);
        return respondError(500, "Server error");
    }
}