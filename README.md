# 🚀 InstaAudit AI
InstaAudit AI delivers a quick Instagram profile audit for a flat **$9**. Authenticate with Supabase, submit your handle and goals, pay once with Stripe and receive actionable AI-powered recommendations.

## 🎯 Overview

This repo demonstrates a minimal Next.js app with one‑time payments. Users create an audit request, complete checkout and a background worker generates the result using OpenRouter.

### 🎥 Demo Video

https://github.com/user-attachments/assets/0c7ab869-6042-490d-9064-f3988b57c8d2

### 🌍 Live Demo

https://next-stripe-supabase-tailwind-typescript.vercel.app/

## ✨ Key Features

- Supabase authentication
- One-time $9 payment with Stripe
- Redis queue for audit jobs
- Worker processes audits via OpenRouter

## 🛠️ Tech Stack

- Next.js 14 & React 18
- Tailwind CSS & TypeScript
- Supabase & Stripe

## 🚀 Getting Started

### 📋 Clone the repository

```
git clone https://github.com/mustafacagri/next-stripe-supabase-tailwind.git
cd next-stripe-supabase-tailwind
```

### 📦 Install dependencies

```bash
corepack enable
corepack prepare yarn@4.5.1 --activate
yarn install
```

### 🔑 Set up environment variables

```
cp .env.example .env.local
```

Fill in your environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_SITE_URL=
STRIPE_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OPENROUTER_API_KEY=
APIFY_TOKEN=
```

### 🏃‍♂️ Run the development server

```bash
yarn dev
```

### 🔧 Start the audit worker

```bash
yarn ts-node src/jobs/auditWorker.ts # or `yarn worker` after building
```

## 🔄 Database Schema

The application relies on two main tables:

- **audit_requests** – stores the handle, niche and goal submitted by a user.
- **audit_results** – created by the worker with the AI recommendations.

When a checkout session completes, its `audit_request_id` is pushed to the `audit-queue` list in Upstash Redis. The worker reads from this list and stores the generated results in `audit_results`.

## Database Triggers and Functions

### Function: `handle_new_user`

This function is triggered when a new user is created via authentication. It inserts a record into the `profiles` table with the relevant user details.

#### Function Definition

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email, picture, name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        NEW.raw_user_meta_data ->> 'email',
        COALESCE(NEW.raw_user_meta_data ->> 'picture', NEW.raw_user_meta_data ->> 'avatar_url'),
        NEW.raw_user_meta_data ->> 'name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

```

### 👾 How can I contribute?

- ⭐ Star the repository
- 🛠️ Submit pull requests, report bugs, or suggest features

### 📬 Get in Touch

Feel free to reach out if you have any questions or need help:

- **GitHub:** https://github.com/mustafacagri
- **Linkedin:** [@MustafaCagri](https://www.linkedin.com/in/mustafacagri/)

Made with ❤️ in 📍 Istanbul, using React.js 18 ⚛️ Next.js 14 🌐 Stripe 💳 TailwindCSS 🎨 TypeScript 🔧 React Query / Tanstack 🔄 and Lodash 🛠️!

## Testing & CI

Run `yarn test` to execute the Vitest suite locally.

[![CI](https://github.com/<USER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<USER>/<REPO>/actions/workflows/ci.yml)

## Deploying on Vercel

Create a new Vercel project and copy the variables from `.env.example` into the dashboard. Deploy with the provided `vercel.json` and run the worker on your preferred host using `node dist/jobs/auditWorker.js`.
