  // next-sitemap.config.js
  import { execSync } from 'node:child_process';
  import fs from 'node:fs';
  import path from 'node:path';

 function routeToFile(routePath) {
  // Remove leading and trailing slash
  const cleanRoute = routePath.replace(/^\/|\/$/g, '');
  const base = path.join(process.cwd(), 'app', cleanRoute);

  const candidates = [
    path.join(base, 'page.tsx'),
    path.join(base, 'page.jsx'),
    path.join(base, 'page.mdx'),
  ];

  // Return the first existing file
  const file = candidates.find(fs.existsSync);

  if (!file) {
    console.warn('File not found for route:', routePath);
  }

  return file;
}


  function gitLastChangeISO(file) {
    try {
      return execSync(`git log -1 --format=%cI -- "${file}"`).toString().trim();
    } catch {
      return new Date().toISOString();
    }
  }

  /** @type {import('next-sitemap').IConfig} */
  const config = {
    siteUrl: process.env.SITE_URL || 'https://e.com',
    generateRobotsTxt: true,
    autoLastmod: false,
    transform: async (_config, route) => {
      const file = routeToFile(route);
      return {
        loc: route,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: file ? gitLastChangeISO(file) : new Date().toISOString(),
      };
    },
  };

  export default config;
