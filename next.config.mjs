/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "cdn.noitatnemucod.net"
      },
      {
        hostname: "avatar.vercel.sh"
      },
      {
        hostname: "github.com"
      },
      {
        hostname: "uploads.mangadex.org"
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
