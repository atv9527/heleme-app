import type { NextConfig } from "next";

// 引入 PWA 插件
const withPWA = require("next-pwa")({
  dest: "public",         // 服务工作线程（Service Worker）生成的目录
  register: true,        // 自动注册服务工作线程
  skipWaiting: true,     // 更新时立即激活
  disable: process.env.NODE_ENV === "development", // 开发模式下禁用 PWA（方便调试）
});

const nextConfig: NextConfig = {
  /* 在这里可以添加你原有的其他配置 */
  reactStrictMode: true,
};

// 使用 withPWA 包装你的配置并导出
module.exports = withPWA(nextConfig);