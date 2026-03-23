# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Hugo static site for johntdyer.com. The site is currently in transition — there are legacy Jekyll posts in `_posts/` and the active Hugo content lives in `content/posts/`. The configured theme in `hugo.toml` is `toha`, but that theme is not present; the available themes are `ananke`, `cactus`, `github-style`, `LoveIt`, and `poison`.

## Common Commands

```bash
# Start local dev server (includes drafts)
hugo server -D

# Build the site
hugo

# Create a new post
hugo new posts/my-post-title.md

# Build with a specific theme override
hugo server -D --theme ananke
```

## Site Configuration

- Config file: `hugo.toml` — sets `baseURL`, `theme`, `title`, `languageCode`, and Disqus integration
- Go module: `go.mod` declares this as `github.com/johntdyer/hugo-toha.github.io`
- Output goes to `public/` (already contains a previously built site)

## Content

- `content/posts/` — Hugo Markdown posts (TOML front matter using `+++` delimiters)
- `_posts/` — Legacy Jekyll posts (not used by Hugo; these may be candidates for migration)
- `archetypes/default.md` — Template for new posts; new posts default to `draft = true`

## Themes

Themes are managed as git submodules (see `.gitmodules`). Currently registered submodules:
- `themes/ananke` — gohugo-theme-ananke (from theNewDynamic)
- `themes/github-style` — MeiK2333/github-style
- `themes/LoveIt` — dillonzq/LoveIt

Additional non-submodule themes present locally: `themes/cactus`, `themes/poison`.

To initialize submodules after cloning:
```bash
git submodule update --init --recursive
```

## Branch Structure

- `master` — main branch
- `hugo` — current working branch (active Hugo migration work)
