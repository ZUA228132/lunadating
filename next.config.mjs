/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    domains: ['images.unsplash.com', 'your-supabase-bucket-url.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME,
  },
};

export default nextConfig;