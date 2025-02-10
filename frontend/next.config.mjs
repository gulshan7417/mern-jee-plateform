/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["researchleap.com"], // Allow external images from this domain
  },
};

export default nextConfig;
