/** @type {import('next').NextConfig} */
// const nextConfig = {
//   transpilePackages: ["@acme/ui", "lodash-es"],
// };

// module.exports = nextConfig;
const dotenv = require("dotenv");

const configuration = dotenv.config({ silent: true });

module.exports = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  // ...other config
  env: configuration.parsed,

  images: {
    domains: ["storage.googleapis.com", "tailwindui.com", "png.pngtree.com"],
  },
};
