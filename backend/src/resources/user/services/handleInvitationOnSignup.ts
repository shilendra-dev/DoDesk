import checkInvitationStatus from "@/resources/user/queries/checkInvitationStatus.js";
import getDefaultWorkspaceTeam from "@/resources/user/queries/getDefaultWorkspaceTeam.js";
import addUserToWorkspace from "@/resources/user/queries/addUserToWorkspace.js";
import updateInvitationStatus from "@/resources/user/queries/updateInvitationStatus.js";


export default async function handleInvitationOnSignup(userId: string, email: string) {

    const invitation = await checkInvitationStatus(email);

    if (!invitation || invitation.status !== "pending") {
        return null
    }

    //Add user to that workspace
    const defaultTeam = await getDefaultWorkspaceTeam(invitation.workspaceId);
    if (!defaultTeam) {
        throw new Error("Failed to fetch default team")
    }

    //Add user to workspace's default team
    await addUserToWorkspace(userId, defaultTeam.id, invitation.role);

    //mark invitation as accepted
    await updateInvitationStatus(invitation.id, "accepted");

    return invitation.workspaceId
}
