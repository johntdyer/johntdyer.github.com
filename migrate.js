#!/usr/bin/env node
// Migrates Hugo posts (TOML front matter + shortcodes) to Hexo (YAML front matter + fenced code)

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'content/posts');
const DEST = path.join(__dirname, 'hexo/source/_posts');

function tomlValueToYaml(key, value) {
  value = value.trim();
  // Strip surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return `${key}: "${value}"`;
}

function convertFrontMatter(toml) {
  const lines = toml.split('\n');
  const yamlLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip blank lines and commented-out lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (!match) continue;

    const [, key, rawVal] = match;
    const val = rawVal.trim().replace(/^['"]|['"]$/g, '');

    if (key === 'date') {
      // Normalize date — strip timezone offset for Hexo compatibility
      const normalized = val.replace(/T(\d{2}:\d{2}:\d{2})?.*$/, (_, t) => t ? `T${t}` : '');
      yamlLines.push(`date: ${normalized || val}`);
    } else if (key === 'title') {
      yamlLines.push(`title: "${val}"`);
    } else if (key === 'draft') {
      // Hexo doesn't use draft in front matter the same way; skip
    } else if (key === 'categories') {
      // Already a list value like [foo, bar]
      yamlLines.push(`categories: [${val}]`);
    } else {
      yamlLines.push(`${key}: ${val}`);
    }
  }

  return yamlLines.join('\n');
}

function convertContent(body) {
  // Convert {{< highlight lang >}} ... {{< /highlight >}} to fenced code blocks
  body = body.replace(/\{\{<\s*highlight\s+(\w+)\s*>\}\}/g, (_, lang) => '```' + lang);
  body = body.replace(/\{\{<\s*\/highlight\s*>\}\}/g, '```');

  // Remove any remaining Hugo shortcodes
  body = body.replace(/\{\{<[^>]+>\}\}/g, '');

  // Fix Jekyll-style {{ site.url }} references
  body = body.replace(/\{\{\s*site\.url\s*\}\}/g, 'https://johntdyer.com');

  return body;
}

function migrateFile(filename) {
  const src = path.join(SRC, filename);
  const raw = fs.readFileSync(src, 'utf8');

  // Match TOML front matter between +++ delimiters
  const match = raw.match(/^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n([\s\S]*)$/);
  if (!match) {
    console.warn(`  SKIP (no TOML front matter): ${filename}`);
    return;
  }

  const [, tomlBlock, body] = match;
  const yaml = convertFrontMatter(tomlBlock);
  const content = convertContent(body);

  const output = `---\n${yaml}\n---\n${content}`;

  // Rename .md (keep same slug)
  const destName = filename.replace(/\.md$/, '.md');
  const dest = path.join(DEST, destName);
  fs.writeFileSync(dest, output, 'utf8');
  console.log(`  OK: ${filename}`);
}

// Ensure dest exists
fs.mkdirSync(DEST, { recursive: true });

// Remove the hexo starter hello-world post
const hello = path.join(DEST, 'hello-world.md');
if (fs.existsSync(hello)) fs.unlinkSync(hello);

const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md') && f !== 'my-first-post.md');
console.log(`Migrating ${files.length} posts...`);
files.forEach(migrateFile);
console.log('Done.');
