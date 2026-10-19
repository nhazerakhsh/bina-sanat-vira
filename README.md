# Bina Sanat Vira (بیناصنعت ویرا)

Landing page for a machine-vision and industrial-automation company.

**Stack:** SvelteKit 3 · Svelte 5 · Tailwind CSS 4 · Paraglide JS (fa default, en) · Lucide icons · shadcn-style UI primitives (`tailwind-variants` + `cn`) · Twemoji flags · Prettier · ESLint

## Scripts

```sh
npm run dev      # dev server
npm run build    # production build
npm run check    # svelte-check
npm run lint     # prettier --check + eslint
npm run format   # prettier --write
```

## i18n

- Messages: `messages/fa.json` (base locale) and `messages/en.json`. Use them as `m.key()` from `#lib/paraglide/messages.js`.
- Persian lives at `/`, English at `/en`. `<html lang dir>` is set in `src/hooks.server.ts`, so RTL/LTR follows the locale.
- The inlang plugins are installed locally (`project.inlang/settings.json`) so builds work offline.
- Layout uses logical Tailwind utilities (`ms-*`, `ps-*`, `start-*`, `rtl:`) so one markup serves both directions.

## Structure

```
src/lib/components/
  ui/        button, card, section-heading, visual, arrow-link, social-icon
  cards/     service-card, product-card, article-card, stat-item
  layout/    header, footer, logo, language-switcher, seo (OG / Twitter / hreflang)
  sections/  hero, about, services, why-us, products (carousel), articles, partners
```

## Images

Photos are placeholders (branded machine-vision visuals). To use real photos, drop files in `static/images/`
and set the `src`/`image` prop, e.g. in `sections/hero.svelte`: `const heroImage = '/images/hero.jpg'`.
`static/og-image.png` (1200×630) is the social share image; replace it with your own artwork.
