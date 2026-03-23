# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a [Hexo](https://hexo.io/) static site for johntdyer.com using the [hipaper](https://github.com/iTimeTraveler/hexo-theme-hipaper) theme. All site code lives under `hexo/`.

## Common Commands

```bash
cd hexo

# Start local dev server
npx hexo server

# Build the site
npx hexo generate

# Clean build artifacts
npx hexo clean

# Create a new post
npx hexo new "Post Title"
```

## Structure

- `hexo/source/_posts/` — Markdown posts with YAML front matter
- `hexo/themes/hipaper/` — hipaper theme (committed directly, not a submodule)
- `hexo/_config.yml` — site configuration (title, URL, theme, etc.)
- `hexo/package.json` — Node dependencies

## CI/CD

Two GitHub Actions workflows in `.github/workflows/`:

- **`validate.yml`** — runs on every PR targeting `master`; builds the site with `hexo generate --bail` to catch parse errors. Set as a required status check to block bad merges.
- **`deploy.yml`** — runs on push to `master`; builds and pushes `hexo/public` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.

GitHub Pages must be configured to serve from the `gh-pages` branch. A `hexo/source/CNAME` file with `johntdyer.com` will preserve the custom domain across deploys.
