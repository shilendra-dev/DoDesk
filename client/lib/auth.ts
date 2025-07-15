import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "./axios"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await api.post('/api/login', {
            email: credentials.email,
            password: credentials.password
          })

          const { status, token, user, workspaces } = response.data

          if (status === 200 && user && token) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken: token,
              default_workspace_id: user.default_workspace_id,
              workspaces: workspaces
            }
          }
          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.default_workspace_id = user.default_workspace_id
        token.workspaces = user.workspaces
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (session.user) {
        session.user.default_workspace_id = token.default_workspace_id
        session.user.workspaces = token.workspaces
      }
      return session
    },
  },
  
  pages: {
    signIn: '/signin',
  },
  
  session: {
    strategy: 'jwt'
  }
}