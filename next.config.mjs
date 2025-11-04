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
    // Expose the Telegram bot username to the client.  Prefer a var prefixed with NEXT_PUBLIC
    // when available, falling back to TELEGRAM_BOT_USERNAME for backwards compatibility.
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || process.env.TELEGRAM_BOT_USERNAME,
  },
};

export default nextConfig;