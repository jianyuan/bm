/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: ["raw-loader"],
    });
    return config;
  },
};

export default nextConfig;
