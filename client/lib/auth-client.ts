import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5033"
})

export const { signIn, signUp, signOut, useSession, sendVerificationEmail } = authClient