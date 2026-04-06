import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://terrenosenaysen.cl/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://terrenosenaysen.cl/venta/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://terrenosenaysen.cl/localidades/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://terrenosenaysen.cl/guia/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://terrenosenaysen.cl/blog/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://terrenosenaysen.cl/contacto/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://terrenosenaysen.cl/publicar-propiedad/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://terrenosenaysen.cl/nosotros/</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
};