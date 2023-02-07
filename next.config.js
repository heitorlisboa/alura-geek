/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
};

module.exports = nextConfig;
