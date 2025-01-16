/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cdn.noitatnemucod.net"
      },
      {
        protocol: 'https',
        hostname: "avatar.vercel.sh"
      },
      {
        protocol: 'https',
        hostname: "github.com"
      },
      {
        protocol: 'https',
        hostname: "uploads.mangadex.org"
      },
      {
        protocol: 'https',
        hostname: "proxy.josumaru.my.id"
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
