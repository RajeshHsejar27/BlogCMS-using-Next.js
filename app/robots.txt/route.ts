import { NextResponse } from 'next/server';

/**
 * Generate robots.txt for SEO
 */
export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
  
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}