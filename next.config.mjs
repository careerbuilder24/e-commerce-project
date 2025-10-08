import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

    async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: false,
      },
    ];
  },


  images: {
    unoptimized: true,
    domains: [
      "i.ibb.co",
      "i.ibb.co.com",
      "lh3.googleusercontent.com",
      "ibb.co",
      "img.freepik.com",
      "i.postimg.cc",
      "postimg.cc"
    ],
  },

  reactStrictMode: false,

  devIndicators: {
    buildActivity: false,
  },


};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
