export default function sitemap() {
  const baseUrl = 'https://laporkakabupati.kupangkab.go.id';

  // Define your public routes here
  const publicRoutes = [
    {
      url: '',
      changeFrequency: 'daily',
      priority: 1.0, // Home page is the most important
    },
    // {
    //   url: '/privacy-policy',
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    {
      url: '/auth/login',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: '/auth/register',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: '/auth/forgot-password',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
