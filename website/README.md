# Mawqifi+ Website V2

## Structure
- `index.html` — public one-page site (English)
- `index-ar.html` — Arabic version (RTL), linked from the navbar and footer
- `projects.html` — separate Projects page, hidden from navigation and marked `noindex`
- `style.css` — responsive layout, cinematic/3D effects, RTL rules, reduced-motion fallback
- `script.js` — scroll scenes, parallax, active nav, mobile menu, service form (Supabase)
- `supabase/policies.sql` — Row Level Security for the form table (run once)
- `assets/` — Mawqifi+ imagery (WebP) and logo/favicons

## Run locally
Open `index.html` directly, or use VS Code Live Server for the best preview.

## Public navigation
Home / About Us / Solutions / Contact / العربية / Request a Service

## Projects
The page exists but has no navbar link yet. It carries `noindex` so search engines skip it.

## Request a Service form
Connected to Supabase: submissions are inserted into `service_requests`.
- The publishable key in `script.js` is meant for the browser, but it is only safe
  when RLS is on. Run `supabase/policies.sql` so visitors can insert requests but
  can never read, edit or delete them.
- `status` is set to `NEW` by the database, not by the browser.
- A hidden honeypot field drops simple spam bots.
- If the Supabase library fails to load, the rest of the site keeps working and
  the form shows the team email instead.

## Accessibility
Visitors with "reduce motion" turned on get the About section as normal stacked
text instead of the scroll animation.
