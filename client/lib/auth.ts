// lib/auth.ts - Fix line 1
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

          const { user, token } = response.data

          if (user && token) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken: token
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
  
  // Add these callbacks to handle accessToken
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
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