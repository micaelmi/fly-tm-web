/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Remove otimizações específicas de imagens
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "*",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
