import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
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
  title: "学生図鑑アプリ - 長岡技術科学大学 電気電子情報工学専攻",
  description: "長岡技術科学大学の電気電子情報工学専攻向けの学生図鑑アプリです",
  keywords: ["長岡技術科学大学", "学生図鑑", "電気電子情報工学"],
  authors: [{ name: "長岡技術科学大学 電気電子情報工学専攻" }],
  // AdSense verification
  other: {
    "google-adsense-account": "ca-pub-5078297896099202",
  },
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
      <head>
        {/* This is the AdSense verification script that will be visible in the source HTML */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5078297896099202';
                script.async = true;
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              })();
            `
          }}
        />
      </head>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
        {/* Google AdSense Banner */}
        <div className="flex justify-center py-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <ins className="adsbygoogle"
            style={{ display: 'block', width: '320px', height: '100px' }}
            data-ad-client="ca-pub-5078297896099202"
            data-ad-slot="YOUR_AD_SLOT_ID"
            data-ad-format="auto" />
          <Script id="ads-init" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
