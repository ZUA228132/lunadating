# Telegram Dating Web App

This repository contains the source code for a Telegram‑enabled dating web application.  The app allows users to register via Telegram, set up a personal profile, swipe through potential matches, send likes/super‑likes, and subscribe to premium membership.  Administrators can manage users, verify identities, assign special badges, and moderate the platform.  A support panel provides tooling for handling user tickets.  The project is designed to be deployed on **Vercel** with a **Supabase** backend for data storage and authentication.

> **Important:** This project is a starter kit showcasing the overall architecture and basic pages/components required for a fully featured dating platform.  It intentionally omits sensitive keys and production‑ready business logic.  You must supply your own Supabase keys, Telegram bot credentials, payment processing integration, and perform thorough security audits before going live.

## Features

### User Profile & On‑Boarding

* Authentication via Telegram with optional Supabase email login fallback.
* Users can upload 2–3 profile photos to a Supabase storage bucket.
* Profile metadata fields include name, hobbies/interests, bad habits, height, eye colour, etc.  Usernames are pulled from Telegram on first login.
* Optional identity verification via photo + passport upload.  Verification requests are sent to an admin for manual approval or rejection.  Verified users have a check‑mark displayed next to their name.
* In‑app support ticket creation to contact the moderation team.

### Swipe Menu

* Tinder‑style swipe interface built with basic React state.  Users can like or dislike profiles presented to them.
* Usernames remain hidden until there is a mutual match.  Only the first two photos are shown to non‑premium users.
* Premium users can view all photos and send up to five super‑likes per day; free users can send one super‑like per day.
* Reporting mechanism for flagging users.  Reports are saved to the database along with a reason.

### Administration & Support

* Admin dashboard to view user statistics, assign verification or badge statuses (e.g. **Media**, **Blogger**, **Developer**), and ban accounts.
* Support panel for handling tickets: view, reply, change status, close, and ban abusive users.
* Support and admin roles are determined by the `role` column in the `users` table.

### Settings & Preferences

* Theme selection (light/dark), preferred language (Russian, English, Ukrainian), and notification preferences.
* Gender preferences for swipe suggestions.

### Premium Subscription

* Subscription pricing tiers: **299 ₽ per month**, **666 ₽ for 3 months**, **999 ₽ annually**.
* Premium users receive profile highlights, extra super‑likes, and the ability to request exclusive statuses via support.
* Payment integration is left as an exercise for the implementer; you can connect Stripe, YooMoney, or any other provider.

## Getting Started

### 1. Install dependencies

This project uses [Next.js](https://nextjs.org/) with React and TypeScript.  Clone the repository and install the dependencies:

```bash
git clone https://github.com/your‑org/telegram‑dating‑app.git
cd telegram‑dating‑app
npm install
```

> If you cannot access the public npm registry from your development environment, consider setting up a local npm proxy or using a package manager that is permitted in your network.

### 2. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com/).  Note down your **Project URL**, **Anon Public Key**, and **Service Role Key**.
2. In your project settings under **Database** → **Tables** create the following tables (you can adjust according to your needs):

   | Table      | Purpose                                                    |
   |-----------|-------------------------------------------------------------|
   | `users`   | Stores user profiles, Telegram ID, display name, bio, photos, height, eye colour, habits, hobbies, gender, preferred gender, isVerified, role, createdAt |
   | `likes`   | Records swipe actions (liker, liked, isSuper, createdAt)    |
   | `matches` | Records mutual likes (matchId, user1, user2, createdAt)     |
   | `reports` | User reports with reporter, reportedUser, reason, createdAt |
   | `tickets` | Support tickets with author, title, description, status     |
   | `badges`  | Special badges assigned by admins (userId, name, createdAt) |

3. Create a **storage bucket** (e.g. `avatars`) for storing profile photos.  Enable **public access** if you plan to deliver images directly via URL; otherwise you must sign URLs in your code.
4. Configure **Row Level Security (RLS)** for each table.  A basic example for the `users` table:

   ```sql
   -- Enable RLS
   alter table public.users enable row level security;

   -- Allow a user to select/update their own row
   create policy "Users can view or update their own profile" on public.users
   for select using (auth.uid() = id)
   with check (auth.uid() = id);

   -- Admins can view/update all rows
   create policy "Admins can manage users" on public.users
   for select using (exists(select 1 from auth.roles r where r.role = 'admin' and r.user_id = auth.uid()));
   ```

   Adjust the policies to suit your security model.  Repeat similar policies for the other tables.

5. Populate the `.env.local` file with your Supabase credentials and Telegram bot information (see `.env.example`).

### 3. Register a Telegram Bot

Use [@BotFather](https://t.me/BotFather) to create a new bot.  Save the bot token and username.  You will embed the [Telegram Login Widget](https://core.telegram.org/widgets/login) on the login page.  The widget will provide user information (ID, username, first name, last name) signed with your bot token.  On login, verify the signature server‑side and upsert the user into Supabase.

### 4. Running Locally

Once you have configured the `.env.local` file and set up your database, you can start a development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.  Changes to files will hot‑reload the page.

### 5. Deployment on Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel dashboard](https://vercel.com/dashboard), create a new project and import your repository.
3. During setup, add the environment variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_BOT_USERNAME` to the project settings.
4. Choose the **Next.js** framework preset.  Vercel will automatically detect the build command (`npm run build`) and output directory (`.next`).
5. Deploy your app.  Vercel will build and host the site at a unique URL (e.g. `https://your-app.vercel.app`).

## Project Structure

```
telegram-dating-app/
│   .env.example       # Sample environment variables (rename to .env.local)
│   next.config.js     # Next.js configuration
│   package.json       # Project metadata and scripts
│   tsconfig.json      # TypeScript configuration
│   README.md          # This file
│   supabase/
│     schema.sql       # Optional SQL schema definitions
└───src/
    ├── app/           # Next.js app router pages and API routes
    │   ├── layout.tsx # Shared HTML wrapper for all pages
    │   ├── page.tsx   # Landing page
    │   ├── dashboard/
    │   │   └── page.tsx        # User profile page
    │   ├── swipe/
    │   │   └── page.tsx        # Swipe interface
    │   ├── admin/
    │   │   └── page.tsx        # Admin dashboard
    │   ├── support/
    │   │   └── page.tsx        # Support panel
    │   ├── settings/
    │   │   └── page.tsx        # User settings page
    │   └── api/        # Serverless API routes for Supabase interaction
    │       ├── auth/route.ts   # Telegram authentication webhook
    │       ├── profile/route.ts
    │       ├── like/route.ts
    │       ├── ticket/route.ts
    │       ├── report/route.ts
    │       └── ...
    ├── components/     # Reusable UI components
    │   ├── Layout.tsx
    │   ├── Navbar.tsx
    │   ├── SwipeCard.tsx
    │   ├── UserProfileForm.tsx
    │   ├── TicketForm.tsx
    │   └── TicketList.tsx
    └── lib/            # Helper libraries
        ├── supabaseClient.ts  # Supabase client initialization
        └── auth.ts            # Telegram login verification helpers
```

## Disclaimer

This repository is provided for educational purposes.  It does **not** include production‑ready authentication or payment flows.  You are responsible for securing user data, complying with privacy laws, and integrating a proper payment gateway.  Always test thoroughly in a staging environment before releasing a dating platform to real users.