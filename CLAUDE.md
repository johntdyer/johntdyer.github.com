# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an [Astro](https://astro.build/) static site for johntdyer.com using the [ataraxia](https://github.com/inakicalvo/astro-ataraxia-theme) theme. All site code lives under `astro/`.

## Common Commands

```bash
cd astro

# Start local dev server
npm run dev

# Build the site
npm run build

# Preview the production build locally
npm run preview
```

## Content

Posts live in `astro/src/content/blog/` as `.md` or `.mdx` files. The schema (defined in `astro/src/content.config.ts`) requires:

```yaml
---
title: "Post Title"
description: "One-line summary"
pubDate: 'Jan 01 2025'
tags: ['tag']          # at least one required
heroImage: '../../assets/image.jpg'   # optional
heroImageAlt: 'Alt text'              # optional
---
```

## CI/CD

Two GitHub Actions workflows in `.github/workflows/`:

- **`validate.yml`** — runs on every PR targeting `master`; runs `npm run build` to catch errors. Set as a required status check to block bad merges.
- **`deploy.yml`** — runs on push to `master`; builds and pushes `astro/dist` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.

GitHub Pages must be configured to serve from the `gh-pages` branch. Add `astro/public/CNAME` with `johntdyer.com` to preserve the custom domain across deploys.
