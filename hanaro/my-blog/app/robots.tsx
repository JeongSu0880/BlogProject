import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'sbm.topician.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/my/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/terms/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
