import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      default_workspace_id?: string | null
      workspaces?: Array<{
        id: string
        name: string
        slug?: string
        created_by: string
        created_at: string
        updated_at: string
      }>
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string
    accessToken?: string
    default_workspace_id?: string | null
    workspaces?: Array<{
      id: string
      name: string
      slug?: string
      created_by: string
      created_at: string
      updated_at: string
    }>
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    default_workspace_id?: string | null
    workspaces?: Array<{
      id: string
      name: string
      slug?: string
      created_by: string
      created_at: string
      updated_at: string
    }>
  }
}