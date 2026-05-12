# Wholesale Order Parser

Parses wholesale customer orders into Matrixify-ready CSV for Shopify draft order import.

## Deploy to Vercel (5 minutes)

### 1. Get the code onto GitHub
- Go to [github.com](https://github.com) and create a new repository called `wholesale-parser`
- Upload all these files, or use GitHub Desktop to push the folder

### 2. Deploy on Vercel
- Go to [vercel.com](https://vercel.com) and sign in (free account is fine)
- Click **Add New → Project**
- Import your `wholesale-parser` GitHub repository
- Click **Deploy** — Vercel will build it automatically

### 3. Add your Anthropic API key
- In Vercel, go to your project → **Settings → Environment Variables**
- Add a new variable:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your API key from [console.anthropic.com](https://console.anthropic.com)
- Go to **Deployments** and click **Redeploy** to apply the key

### 4. Share the URL
Vercel gives you a URL like `https://wholesale-parser-xyz.vercel.app` — share that with your team.

## How to use
1. Paste one or more customer orders into the text box (separate multiple orders with a blank line)
2. Click **Parse orders**
3. Review the matched lines — any unmatched items are flagged
4. Click **Download CSV**
5. Import the CSV into Shopify via Matrixify

## Updating the SKU database
Edit `src/skuDatabase.js` and redeploy.
