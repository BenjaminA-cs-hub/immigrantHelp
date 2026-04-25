import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rememberMe?: boolean;
  }
}

const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_MAX_AGE = 24 * 60 * 60; // 24 hours

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          rememberMe: credentials.rememberMe === "true",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.name) {
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.name = user.name;
        token.rememberMe = user.rememberMe;
        if (!user.rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + DEFAULT_MAX_AGE;
        }
      }
      if (account?.provider === "google" && profile?.email) {
        token.name = profile.email.split("@")[0];
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_MAX_AGE,
  },
});

export { handler as GET, handler as POST };