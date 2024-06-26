/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  pageExtensions: (() => {
    const { NEXT_PUBLIC_BUILDTYPE } = process.env;
    switch (NEXT_PUBLIC_BUILDTYPE) {
      case "zuzalu":
        console.log("zuzalu build");
        return ["zuzalu.tsx"];
      default:
        return ["tsx", "ts", "jsx", "js"];
    }
  })(),
  async headers() {
    return [
      {
        source: "/fonts/Director-Regular.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/Director-Variable.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
