import NextAuth from "next-auth"
import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !(user as any).password) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          (user as any).password
        )

        if (!isValid) return null

        return user
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
      }
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken
      }
      return session
    },
  },
}

export default NextAuth(authOptions)

// Helper para usar en server components
export async function auth() {
  return getServerSession(authOptions)
}