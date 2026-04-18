import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://apnakhata.online';

  const routes = [
    '',
    '/login',
    '/register',
    '/forgot-password',
    '/verify-email',
    '/contact',
    '/guide',
    '/manifesto',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }));

  return routes;
}
