/** @type {import('next').NextConfig} */
const nextConfig = {
  // for image loading
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org"
      }
    ]
  },

  // for svg loading
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@svgr/webpack",
          options: { babel: false }
        }
      ]
    });
    return config;
  }
};

export default nextConfig;
