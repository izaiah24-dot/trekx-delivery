# TrekX Delivery

## Run locally
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your Supabase and Paystack keys.
4. Run `npm run dev`.

## Supabase
Create a Supabase project, open SQL Editor, and run `supabase.sql`. In Authentication, enable Email login and add your Netlify URL to the redirect URLs.

## Payment
This starter is prepared for Paystack configuration. For secure live payments, add a server-side Netlify Function that initializes and verifies transactions using your Paystack secret key. Never put the secret key in the frontend.

## Deploy to Netlify
1. Upload this ZIP to GitHub and push it to a repository.
2. In Netlify, choose **Add new site → Import from Git**.
3. Build command: `npm run build`; publish directory: `dist`.
4. Add the environment variables from `.env`.
5. Set the site name to `trekxdelivery` if available. Your URL will be `trekxdelivery.netlify.app`.

## Important
Real accounts and the delivery database work after Supabase is configured. Payment requires a Paystack business account and server-side secret-key setup before going live.
