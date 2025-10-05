/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import * as bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user.id.toString(), email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists in database
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for OAuth providers
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                password: "", // OAuth users don't need password
              },
            });
          }
          
          // Set the database user ID for OAuth users
          user.id = existingUser.id.toString();
        } catch (error) {
          console.error("Error creating OAuth user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      // For OAuth users, get the database user ID if not already set
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.id = dbUser.id.toString();
          }
        } catch (error) {
          console.error("Error fetching user ID in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
        if(session.user){
            session.user.id = token.id as string;
        }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
