import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma-client";
import { findTestUser } from "@/app/api/auth/[...nextauth]/test-auth-helper";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials provider for development testing only
    ...(process.env.NODE_ENV === "development" ? [
      CredentialsProvider({
        name: "Development Testing",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          name: { label: "Name", type: "text" }
        },
        async authorize(credentials) {
          if (!credentials?.email) return null;
          
          // In development, accept any email
          if (process.env.NODE_ENV === "development") {
            // Check if it's one of our predefined test users
            const testUser = findTestUser(credentials.email);
            if (testUser) {
              return {
                id: testUser.id,
                email: testUser.email,
                name: testUser.name,
                role: testUser.role,
              };
            }
            
            // For custom emails - generate a random ID
            const randomId = Math.random().toString(36).substring(2, 15);
            return {
              id: `dev-user-${randomId}`,
              email: credentials.email,
              name: credentials.name || 'Test User',
              // Default to regular user role
              role: 'USER',
            };
          }
          
          return null;
        }
      })
    ] : []),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // 開発環境では全てのメールアドレスを許可
      if (process.env.NODE_ENV === "development") {
        return true;
      }
      
      // 本番環境では長岡技術科学大学のメールアドレスのみを許可
      return user.email?.endsWith("@stn.nagaokaut.ac.jp") ?? false;
    },
    async session({ session, token }) {
      // セッションにユーザーIDを追加
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // 開発環境での特別な処理
        if (process.env.NODE_ENV === "development") {
          // テスト管理者の場合
          if (session.user.email === "admin@g.nagaoka.ac.jp") {
            session.user.isAdmin = true;
          }
          // その他の開発用アカウントの場合
          else if (token.sub.startsWith("dev-user-")) {
            // デフォルトは一般ユーザー
            session.user.isAdmin = false;
          }
          // 実際のメールアドレスの場合
          else if (process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            session.user.isAdmin = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          }
        }
        // 本番環境
        else if (process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          session.user.isAdmin = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
