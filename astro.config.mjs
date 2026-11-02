import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mcjh0n.github.io',
  base: process.env.GITHUB_ACTIONS === 'true' ? '/my-portfolio' : '/',
  integrations: [sitemap()],
});
