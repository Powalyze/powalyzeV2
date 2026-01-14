/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['app.powerbi.com'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    POWERBI_CLIENT_ID: process.env.POWERBI_CLIENT_ID,
    POWERBI_CLIENT_SECRET: process.env.POWERBI_CLIENT_SECRET,
    POWERBI_TENANT_ID: process.env.POWERBI_TENANT_ID,
    POWERBI_WORKSPACE_ID: process.env.POWERBI_WORKSPACE_ID,
  },
};

module.exports = nextConfig;
