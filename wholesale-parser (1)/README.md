# Wholesale Order Parser

Parses wholesale customer orders into Matrixify-ready CSV for Shopify draft order import.

## Deploy to Vercel (5 minutes)

### 1. Put it on GitHub
- Unzip the folder
- Create a new repo at github.com called `wholesale-parser`
- Upload the files (drag and drop works in the GitHub UI)

### 2. Deploy on Vercel
- Go to [vercel.com](https://vercel.com) and sign in (free account is fine)
- Click **Add New → Project**
- Import your `wholesale-parser` GitHub repository
- Click **Deploy** — Vercel will build it automatically

### 3. Add your environment variables
In Vercel: project → **Settings → Environment Variables** — add both:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your key from console.anthropic.com |
| `APP_PASSWORD` | Any password you choose for the team, e.g. `shelves2024` |

Then go to **Deployments → Redeploy** to apply them.

### 4. Share the URL
Vercel gives you a URL like `https://wholesale-parser-xyz.vercel.app`.
Share it with the team along with the password.

## How it works
- Team visits the URL, enters the password (stored as a cookie for 30 days)
- Paste one or more customer orders, separated by blank lines
- Click **Parse orders** — Claude matches each line to the correct SKU
- Any unmatched lines are flagged in orange
- Click **Download CSV** and import into Shopify via Matrixify

## Updating the SKU database
Edit `src/skuDatabase.js`, push to GitHub, and Vercel redeploys automatically.

## Changing the password
Update `APP_PASSWORD` in Vercel environment variables and redeploy.
