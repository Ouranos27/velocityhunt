# Product Requirements Document (PRD)

**Product Name:** GitHub Spark Generator  
**Repo Name:** velocityhunt  
**Version:** 1.0 (MVP – Final)  
**Author:** Philippe  
**Date:** January 15, 2026  
**Status:** Final

## 1. Overview

**Tagline**  
Discover exploding GitHub repositories before they go viral — instant insights, velocity-based ranking, and ready-to-share X posts.

**Problem Statement**  
GitHub's trending page is cluttered and daily-focused, lacking topic-specific filtering, growth velocity emphasis, quick summaries, or easy sharing. Makers and devs spend too much time hunting inspiration/tools. Existing tools are often outdated, ad-filled, or miss shareability. This tool simplifies discovery with a modern, tweet-friendly twist.

**Solution**  
A fast web app where users enter a topic (e.g., "AI agents", "Next.js starters") and get a curated list of high-velocity "spark" repos with stats, visuals, and one-click X post drafts.

## 2. Key Terminology

**Spark** 🔥  
A "spark" is a GitHub repository experiencing rapid, explosive growth — the kind that's about to "catch fire" and go viral. Unlike established popular repos with thousands of stars, sparks are newer projects (typically < 6 months old) that are gaining traction *fast*. These are the hidden gems and emerging tools that early adopters discover before the broader community.

**Velocity** 📈  
Velocity measures the *rate of growth* rather than absolute popularity. A repo with 500 stars gained in 2 weeks has higher velocity than one with 5,000 stars gained over 2 years. We calculate velocity by looking at:
- **Stars per day**: How quickly the community is discovering and endorsing the project
- **Fork activity**: Indicates developers actively experimenting with and building upon the code
- **Recency factor**: Recent activity is weighted more heavily than old statistics

By focusing on velocity, we surface repositories that are currently trending *upward*, not just those that became popular long ago.

**Why This Fits the Test**  
- Data-driven: Aggregates real GitHub API data + custom velocity scoring  
- Viral/Shareable: Built-in X draft generation with "wow" factor for maker Twitter  
- Resilient: Cached results handle viral spikes  
- Gorgeous: Clean, modern UI with animations and dark mode

## 3. Target Users

- Indie makers & founders seeking product ideas/tools  
- #buildinpublic creators needing shareable content  
- Developers scanning for emerging libraries/frameworks  

**Primary Persona**  
Alex, 28, indie hacker in Paris — browses GitHub daily but wants faster trend spotting and easy X shares to build audience.

## 4. Key Value Proposition

Input topic → Output curated "sparks" (repos with rapid star/fork growth) + stats + copyable X drafts.  
Saves time, uncovers hidden gems, boosts sharing in the maker community.

## 5. MVP Features & Requirements

### 5.1 Core User Flow
1. Landing page with hero input field + topic suggestions  
2. Submit → fetch & rank repos  
3. Display results as card grid  
4. Per repo / batch: generate & copy X post draft  
5. One-click "Share on X" link

### 5.2 Functional Requirements

- **Search Input**  
  - Text field (autocomplete with 10–15 hardcoded popular topics)  
  - Submit button

- **Data Fetch & Processing**  
  - Use GitHub Search API: `/search/repositories` with query params (topic + created/updated filters for recency)  
  - Fetch up to 30–50 results, sorted by stars  
  - Compute **Spark Score**: `(recent stars gained × 2 + forks) / days since relevant activity`  
    - This formula prioritizes *velocity* (growth rate) over absolute popularity
    - Stars are weighted 2× to reflect community interest
    - Division by days normalizes for repo age
    - Result: Higher scores indicate faster-growing repositories (sparks)
  - Filter: min stars > 50, exclude very old repos (keeps focus on emerging projects)

- **Results Display**  
  - Grid of repo cards (responsive: 1–4 columns)  
  - Each card shows:  
    - Repo name & owner  
    - Language badge  
    - Stars / forks / watchers  
    - Growth % (e.g., "↑ 420% this week")  
    - Short description snippet  
    - Simple spark meter (CSS progress bar or icon scale)

- **X Share Generation**  
  - Per-repo draft example:  
   ```
   Just spotted this 🔥 GitHub spark: [repo-name] by @[owner]
   Gained [X] stars this week – [quick why it's cool]
   → [link]
   Via velocityhunt [your-url] #indiemaker
   ```
   - Batch summary draft for top 5  
   - Copy button + twitter.com/intent/tweet pre-filled link

### 5.3 Non-Functional Requirements

- **Performance** — Page load < 2s, results < 5s (cached)  
- **Resilience** — Cache API results in Supabase (refresh every 4–6h); fallback to stale data on rate limit  
- **Scalability** — Handle 1k+ concurrent users via Vercel edge + Supabase serverless  
- **Design** — Dark mode default, Tailwind + Framer Motion (fade-ins, hover effects), fully responsive  
- **Accessibility** — Basic ARIA labels, keyboard nav

## 6. Tech Stack

- **Framework**: Next.js 14+ (App Router, SSR)  
- **Styling**: Tailwind CSS  
- **Data/Cache**: Supabase (Postgres + serverless functions for API proxy)  
- **Deployment**: Vercel  
- **Visuals**: Recharts or pure CSS for spark meters  
- **Other**: No external paid APIs

## 7. Out of Scope (for MVP)

- User authentication / saved searches  
- Advanced AI summaries (data-only for purity)  
- Export beyond X  
- Mobile native app

## 8. Success Criteria (for Test)

- Functional live URL with real data  
- "Wow" moment: Generate & copy a shareable post in <30s  
- Viral hook: Tool promotes itself via drafts  
- Resilience: Cached mode survives simulated spike

## 9. Risks & Mitigations

- GitHub API rate limits (~60/hour unauth) → Aggressive caching + warning for stale data  
- Noisy/irrelevant results → Tight filters + min thresholds  
- Time crunch → Leverage Cursor/Claude for boilerplate

## 10. Timeline (rapid Build)

- 0–8h: Next.js setup, Supabase init, GitHub API integration  
- 8–20h: Spark score logic, results UI/cards  
- 20–30h: X draft generation + share buttons  
- 30–40h: Design polish, animations, mobile testing  
- 40–rapid: Final tests, deploy, README + launch post

**Live URL:** https://velocityhunt.vercel.app  
**Repo:** https://github.com/Ouranos27/velocityhunt  

Built for VelocityHunt test — let's ship! 🚀