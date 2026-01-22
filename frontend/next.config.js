/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // hot reload
  webpack: (config) => {
    config.watchOptions = {
      poll: 1200, //チェック時間
      aggregateTimeout: 500, // 遅延時間
      ignored: ["node_modules"],
    };

    return config;
  },

  redirects: async () => {
    return [
      {
        source: "/signup",
        has: [
          {
            type: "cookie",
            key: "access_token",
          },
        ],
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
