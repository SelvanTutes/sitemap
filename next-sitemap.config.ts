import type { IConfig } from 'next-sitemap'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Try to map a route (e.g. "/about") to the page file in /app
 */
function routeToFile(routePath: string): string | undefined {
  const base = path.join(process.cwd(), 'app', routePath.replace(/^\//, ''))
  const candidates = [
    path.join(base, 'page.tsx'),
    path.join(base, 'page.mdx'),
    path.join(base, 'page.jsx'),
  ]
  return candidates.find(fs.existsSync)
}

/**
 * Return the ISO-8601 timestamp of the most recent Git commit
 * that touched the given file. Fallback = current date.
 */
function gitLastChangeISO(file: string): string {
  try {
    return execSync(`git log -1 --format=%cI -- "${file}"`).toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

const config: IConfig = {
  siteUrl: process.env.SITE_URL || 'https://e.com',
  generateRobotsTxt: true,  // still generates /robots.txt
  sitemapSize: 5000,
  autoLastmod: false,       // we supply our own <lastmod>
  transform: async (_config, route) => {
    const file = routeToFile(route)
    return {
      loc: route,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: file ? gitLastChangeISO(file) : new Date().toISOString(),
    }
  },
}

export default config
