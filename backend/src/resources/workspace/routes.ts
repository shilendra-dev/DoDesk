import { createApi } from "@/utils/router";
import { createWorkspaceAPI } from "./api/create-workspace.api";
import { getUserWorkspacesAPI } from "./api/get-user-workspaces.api";

createApi().post("/workspace").authSecure(createWorkspaceAPI);
createApi().get("/workspaces").authSecure(getUserWorkspacesAPI);
