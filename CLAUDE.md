# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Danstack** — a TanStack Start + React template with a shadcn/ui sidebar, dark mode, and Netlify deployment target.

## Commands

```bash
npm run dev    # start dev server on port 3000
npm run build  # production build (Netlify target)
```

No test or lint scripts are configured. TypeScript is checked implicitly via Vite's build.

## Architecture

### Routing

Routes live in `src/routes/` and use TanStack Router's file-based routing. `routeTree.gen.ts` is auto-generated — do not edit it manually. Add new routes by creating files in `src/routes/` and the tree will regenerate on next dev server start.

The root route (`src/routes/__root.tsx`) wraps every page in `ThemeProvider > SidebarProvider > AppSidebar + SidebarInset > Header + Body`.

### Sidebar Navigation

`src/lib/sidebar-data.tsx` is the single source of truth for sidebar nav items, teams, and the user profile. When adding a new route, add its entry here so it appears in the nav.

### Component Structure

- `src/components/ui/` — shadcn/ui primitives (auto-generated via `npx shadcn add`; treat as vendored)
- `src/components/` — app-level components composing the layout (sidebar, header, body, theme toggle)

### Path Aliases

Both `@/` and `~/` resolve to `src/`. Either works; the codebase uses `@/` in most files.

### Styling

Tailwind v4 via PostCSS. Global styles and CSS variable definitions are in `src/styles/app.css`. shadcn/ui is configured with the `new-york` style, `gray` base color, and CSS variables (no Tailwind config file — Tailwind 4 reads `app.css` directly).

### Deployment

Vite is configured with `target: 'netlify'` in the TanStack Start plugin. Build output is Netlify-ready.
