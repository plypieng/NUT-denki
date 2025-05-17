import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from '@vercel/analytics/next';

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "学生名鑑アプリ - 長岡技術科学大学 電気電子情報工学専攻",
  description: "長岡技術科学大学の電気電子情報工学専攻向けの学生名鑑アプリです",
  keywords: ["長岡技術科学大学", "学生名鑑", "電気電子情報工学"],
  authors: [{ name: "長岡技術科学大学 電気電子情報工学専攻" }],
};

export const viewport: Viewport = {
  themeColor: "#0064B6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
