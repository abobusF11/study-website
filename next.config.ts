import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
    eslint: {
        ignoreDuringBuilds: true, // Отключает ESLint при сборке
    },
};



export default nextConfig;
