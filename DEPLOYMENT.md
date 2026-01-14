# Deployment Guide for Vercel

This guide will help you deploy VelocityHunt to Vercel.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. A Supabase account with a project set up ([sign up here](https://supabase.com))
3. (Optional) A GitHub Personal Access Token for higher API rate limits

## Step 1: Set Up Supabase Database

### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### Run Database Migrations

You need to run the migrations to create the required tables. You have two options:

#### Option A: Using the Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `lib/db/migrations/0000_petite_dragon_lord.sql`
4. Paste and run the SQL in the editor

#### Option B: Using Drizzle CLI locally

1. Set up your `.env.local` file with the database URL (see step 2 below)
2. Run the migration:
   ```bash
   bun run db:push
   ```

## Step 2: Configure Environment Variables

### Get Your Supabase Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon/Public Key (this is safe to expose in the browser)

3. In Settings > Database, find your connection string:
   - Look for "Connection Pooling" (recommended for serverless)
   - Use the "Transaction" mode connection string
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

### Create Environment Variables in Vercel

You'll need to set these environment variables in Vercel:

| Variable Name | Description | Required |
|--------------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Your Supabase anon/public key | Yes |
| `DATABASE_URL` | Your Supabase connection string (use pooler) | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token (for higher rate limits) | No |

**Note:** The app will work without `GITHUB_TOKEN`, but you'll be limited to 60 requests/hour. With a token, you get 5,000 requests/hour.

### (Optional) Create a GitHub Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token
3. You don't need any special scopes for read-only public repository access
4. Copy the token value

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `bun run build` (or leave default)
   - **Output Directory:** `.next` (default)
4. Add all environment variables from Step 2
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run deployment:
   ```bash
   vercel
   ```

3. Follow the prompts and add environment variables when asked

## Step 4: Verify Deployment

1. Once deployed, visit your Vercel URL
2. Check that:
   - The page loads correctly
   - Search works for different topics
   - GitHub avatars load (if you see broken images, check the Next.js config)
   - No errors in the browser console

3. Check Vercel logs if you encounter issues:
   - Go to your project in Vercel Dashboard
   - Click on "Deployments" > Select your deployment
   - View the "Functions" logs

## Troubleshooting

### Database Connection Issues

If you see database errors:

1. Verify your `DATABASE_URL` is correct
2. Ensure you're using the **connection pooling** URL (with `.pooler.supabase.com`)
3. Check that migrations ran successfully (the `repo_cache` table should exist)
4. Verify your Supabase project is not paused

### GitHub API Rate Limiting

If you see "API rate limit exceeded" errors:

1. Add a `GITHUB_TOKEN` environment variable
2. Verify the token is valid and hasn't expired
3. Check GitHub API status: https://www.githubstatus.com/

### Build Failures

If the build fails on Vercel:

1. Check that all dependencies are in `package.json`
2. Ensure TypeScript has no errors by running `bun run build` locally
3. Check the Vercel build logs for specific error messages

### Images Not Loading

If GitHub avatars don't load:

1. Check that `next.config.ts` includes the GitHub avatars domain in `remotePatterns`
2. Clear Vercel cache and redeploy if needed

## Performance Optimization

The app is configured with:

- **ISR (Incremental Static Regeneration):** Pages revalidate every hour
- **Stale-While-Revalidate:** Returns cached data while fetching fresh data in the background
- **Multi-layer caching:** In-memory cache + database cache
- **Package import optimization:** Reduces bundle size for lucide-react and framer-motion

## Updating Environment Variables

To update environment variables after deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Update the values
4. Redeploy (or wait for the next deployment)

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add your domain and follow DNS configuration instructions

## Monitoring

Vercel provides built-in monitoring:

- **Analytics:** Track page views and performance
- **Speed Insights:** Monitor Core Web Vitals
- **Logs:** View function logs and errors

Access these in your project dashboard under the respective tabs.
