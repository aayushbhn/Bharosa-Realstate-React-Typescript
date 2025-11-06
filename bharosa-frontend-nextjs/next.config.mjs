/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // allow Unsplash images if you ever use <Image>
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }]
  }
};
export default nextConfig;
