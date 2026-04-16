import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register', '/forgot-password', '/verify-email'],
      disallow: ['/dashboard', '/admin', '/api'],
    },
    sitemap: 'https://apnakhata.online/sitemap.xml',
  };
}
