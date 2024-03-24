/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node$/,
      use: ["raw-loader"],
    });
    return config;
  },
};

export default nextConfig;
