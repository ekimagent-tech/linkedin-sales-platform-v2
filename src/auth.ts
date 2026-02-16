import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For MVP: check for demo user or create one
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        // Create demo user if doesn't exist
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: 'Demo User',
              password: credentials.password as string, // In production, hash this!
            },
          })
        }

        // For demo purposes, accept any password for existing users
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
})
