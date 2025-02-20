module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*", // السماح بجميع API Routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              "https://alitech-7sexcrwyd-ali-hasan-sss-projects.vercel.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
