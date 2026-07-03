# Danstack

## Background

- Template for Tanstack projects

## Resources

- https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
- https://ui.shadcn.com/docs/installation/tanstack


## Steps to use template

### Branding
- [ ] Rename the app — it's called "Danstack" in package.json (name field), __root.tsx (<title>), the login page heading, and the sidebar header in app-sidebar.tsx
- [ ] Replace /hero.png (home page background)
- [ ] Replace favicons and site.webmanifest

## Deploy setup
- [ ] This project is set up for Vercel deployment
- [ ] Add env variables

## Google OAuth setup
- [ ] Set up new Google Cloud project https://console.cloud.google.com/
- [ ] API & Services > OAuth consent screen
  - [ ] Select External users
  - [ ] Add URLs
  - Redirect URI = https://project-name.supabase.co/auth/v1/callback

### Supabase setup
- [ ] Create a Supabase project
- [ ] Copy .env.example → .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY
- [ ] Enable Email and Magic Link providers in Supabase Authentication >
- [ ] Add in Google OAuth
  - Authentication > Sign in / Providers > Auth Providers > Google
  - Paste in Google Client ID and OAuth Secret
- [ ] Add Supabase allowed redirect URLs = Authentication > URL Configuration
  - http://localhost:1337/auth/callback
  - http://localhost:1337/auth/reset-password
  - https://dantan-1.vercel.app/auth/callback
  - https://dantan-1.vercel.app/auth/reset-password


### Email
- [ ] Obtain Resend API Key
- [ ] Set email address for FROM email



### Stripe
- [ ] Add VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY to .env.local (no VITE_ prefix on the secret key — it must stay server-only)
- [ ] Run `npm run stripe:setup` to create the Product/Price for each paid tier in src/lib/constants.ts (TIER_DATA) and write src/lib/stripe-prices.generated.json — re-run any time TIER_DATA pricing changes
- [ ] Add a webhook endpoint in the Stripe Dashboard pointing to `<your-domain>/api/stripe/webhook`, subscribed to customer.subscription.created/updated/deleted, and copy its signing secret into STRIPE_WEBHOOK_SECRET
- [ ] Activate the Customer Portal (Dashboard > Settings > Billing > Customer Portal) — required once before createPortalSession will work
- [ ] For local webhook testing, use the Stripe CLI: `stripe listen --forward-to localhost:1337/api/stripe/webhook`

### Content
- [ ] Replace placeholder nav items in src/lib/sidebar-data.tsx (currently Dashboard + Two)
- [ ] Replace /dashboard and /two routes with real pages
- [ ] Wire up the non-functional sidebar menu items (Account, Billing, Notifications in nav-user.tsx)

### Deployment