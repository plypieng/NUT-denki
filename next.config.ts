import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudinary画像アップロード設定
  images: {
    domains: ["res.cloudinary.com"],
  },
  
  // ビルド出力の圧縮設定
  compress: true,
  
  // 環境変数
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
