# Danstack

## Background

- Template for Tanstack projects

## Resources

- https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
- https://ui.shadcn.com/docs/installation/tanstack


## Steps to use template

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
- [ ] Copy .env.example → .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- [ ] Enable Email and Magic Link providers in Supabase Authentication >
- [ ] Add in Google OAuth
  - Authentication > Sign in / Providers > Auth Providers > Google
  - Paste in Google Client ID and OAuth Secret
- [ ] Add Supabase allowed redirect URLs = Authentication > URL Configuration
  - http://localhost:1337/auth/callback
  - http://localhost:1337/auth/reset-password
  - https://dantan-1.vercel.app/auth/callback
  - https://dantan-1.vercel.app/auth/reset-password


### Branding
- [ ] Rename the app — it's called "Danstack" in package.json (name field), __root.tsx (<title>), the login page heading, and the sidebar header in app-sidebar.tsx
- [ ] Replace /hero.png (home page background)
- [ ] Replace favicons and site.webmanifest

### Content
- [ ] Replace placeholder nav items in src/lib/sidebar-data.tsx (currently Dashboard + Two)
- [ ] Replace /dashboard and /two routes with real pages
- [ ] Wire up the non-functional sidebar menu items (Account, Billing, Notifications in nav-user.tsx)

### Deployment