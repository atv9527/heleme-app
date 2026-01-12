import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 关键：添加一个空的 turbopack 配置来消除警告
    experimental: {
        turbopack: {},
    },
    // 如果还是报错，可以尝试关闭 SWC 压缩
    swcMinify: false,
};

export default withPWA(nextConfig);