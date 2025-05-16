import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma-client";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // 長岡技術科学大学のメールアドレスのみを許可
      return user.email?.endsWith("@stn.nagaokaut.ac.jp") ?? false;
    },
    async session({ session, token }) {
      // セッションにユーザーIDを追加
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // 管理者権限の確認
        if (process.env.ADMIN_EMAIL) {
          session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
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
});

export { handler as GET, handler as POST };
