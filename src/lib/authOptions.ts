import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
    provider?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rememberMe?: boolean;
    id?: string;
    image?: string | null;
    provider?: string;
  }
}

const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60;
const DEFAULT_MAX_AGE = 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
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

        if (!user) throw new Error("No account found with that email. Please sign up first.");

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) throw new Error("Incorrect password. Please try again.");

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.avatar_url ?? null,
          rememberMe: credentials.rememberMe === "true",
          provider: "credentials",
        };
      },
    }),
  ],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (!data) {
          await supabase.from("users").insert({
            email: user.email,
            username: user.name ?? user.email.split("@")[0],
            password: null,
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.image = token.image ?? session.user.image;
        session.user.provider = token.provider;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
        token.rememberMe = user.rememberMe;
        token.provider = user.provider;
        if (!user.rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + DEFAULT_MAX_AGE;
        }
      }
      if (account?.provider === "google" && profile) {
        token.provider = "google";
        token.name = (profile as { name?: string }).name ?? profile.email?.split("@")[0];
        token.image = (profile as { picture?: string }).picture ?? null;
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.image !== undefined) token.image = session.image;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_MAX_AGE,
  },
};
