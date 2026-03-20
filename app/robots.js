export default function robots() {
  const baseUrl = 'https://laporkakabupati.kupangkab.go.id';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow crawling of internal app portals and API routes
      disallow: ['/api/', '/adm/', '/pelapor/', '/bupati-portal/', '/opd/'],
    },
    // Adding sitemap URL will help Google and other search engines easily discover it
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
