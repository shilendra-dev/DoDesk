import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      email: string
      name: string
      default_workspace_id?: string | null
      workspaces: Workspace[]
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    userId?: string
  }
}