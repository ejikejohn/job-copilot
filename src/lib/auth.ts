import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // We're using our own email+password form, not Google/GitHub login (yet),
  // so we use the "Credentials" provider and write the logic ourselves.
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        // Compare the typed password's hash against the stored hash
        const passwordMatches = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordMatches) return null;

        // Only return the safe, public fields - never the password hash
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    // JWT sessions are stored in an encrypted cookie in the browser,
    // no server-side session table needed - simple and fast for our app.
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Whatever we return here gets attached to the session object
    // that our app can read on both server and client.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
