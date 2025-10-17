/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@sparticuz/chromium');
    }
    return config;
  },
};

export default nextConfig;




// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
