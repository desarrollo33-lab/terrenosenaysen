import { writeFileSync, mkdirSync } from 'fs';
import { siteConfig, aggregateReview, services, locations, combos, blogTopics, testimonials } from './src/data/content.ts';

const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Hola, me interesa consultar sobre terrenos en Aysén')}`;

function esc(s) { return (s||'').replace(/'/g, "\\'").replace(/\n/g, ' '); }

function serviceIcon(slug) {
  const icons = {
    'venta-terrenos-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
    'parcelas-en-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'lotes-urbanos-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/>',
    'inversion-terrenos-patagonia': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
    'terrenos-agricolas-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 26L10.6 4.8a.7.7 0 011.3 0L14 14M6 18h8M2 26h20M6 22h4M16 22h4"/>',
    'tramites-compra-terreno-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    'terrenos-rurales-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>',
    'parcelas-lago-rio-aysen': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>'
  };
  return icons[slug] || icons['venta-terrenos-aysen'];
}

function headerHTML() {
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/ubicaciones', label: 'Ubicaciones' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' }
  ];
  return `<header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-2 no-underline">
        <div class="w-9 h-9 bg-[#166534] rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21V9l9-6 9 6v12a1 1 0 01-1 1h-5a1 1 0 01-1-1v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1z"/></svg>
        </div>
        <div>
          <span class="font-bold text-sm text-[#166534] block leading-tight">Terrenos en Aysén</span>
          <span class="text-xs text-[#EAB308] block leading-tight">Patagonia Chilena</span>
        </div>
      </a>
      <nav class="hidden lg:flex items-center gap-1">
        ${navLinks.map(n => `<a href="${n.href}" class="text-sm font-medium text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 hover:text-[#166534] no-underline transition-colors">${n.label}</a>`).join('\n        ')}
      </nav>
      <a href="${waLink}" target="_blank" class="bg-[#166534] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#14532D] transition-colors no-underline text-sm inline-flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Consulta Gratis
      </a>
    </div>
  </div>
</header>`;
}

function footerHTML() {
  return `<footer class="bg-[#14532D] text-white py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <h3 class="font-bold text-lg mb-3">${siteConfig.legalName}</h3>
        <p class="text-gray-400 text-sm leading-relaxed mb-4">${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}</p>
        <p class="text-gray-400 text-sm">${siteConfig.phoneDisplay} | ${siteConfig.email}</p>
        <p class="text-gray-400 text-sm mt-1">${siteConfig.openingHoursSchema}</p>
      </div>
      <div>
        <h4 class="font-semibold text-sm mb-3 text-[#EAB308]">Servicios</h4>
        <ul class="space-y-1">
          ${services.slice(0, 5).map(s => `<li><a href="/servicios/${s.slug}" class="text-gray-400 text-sm hover:text-white no-underline transition-colors">${s.name}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-sm mb-3 text-[#EAB308]">Ubicaciones</h4>
        <ul class="space-y-1">
          ${locations.map(l => `<li><a href="/ubicaciones/${l.slug}" class="text-gray-400 text-sm hover:text-white no-underline transition-colors">${l.name}</a></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-xs">
      <p>&copy; 2026 ${siteConfig.legalName}. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>`;
}

function waFloatHTML() {
  return `<a href="${waLink}" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors no-underline" aria-label="WhatsApp">
  <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>`;
}

function schemaHead(title, description, canonical, extraSchema) {
  const base = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": siteConfig.legalName,
    "url": siteConfig.url,
    "telephone": siteConfig.phone,
    "email": siteConfig.email,
    "address": { "@type": "PostalAddress", "streetAddress": siteConfig.address.street, "addressLocality": siteConfig.address.city, "addressRegion": siteConfig.address.state, "postalCode": siteConfig.address.zip, "addressCountry": siteConfig.address.country },
    "geo": { "@type": "GeoCoordinates", "latitude": siteConfig.geo.latitude, "longitude": siteConfig.geo.longitude },
    "openingHoursSpecification": siteConfig.openingHoursSchema,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": aggregateReview.averageRating, "reviewCount": aggregateReview.totalReviews },
    "areaServed": { "@type": "City", "name": "Aysén" },
    "priceRange": "$15M - $1.5B CLP"
  });
  const allSchema = extraSchema ? base.replace('}', ',' + extraSchema + '}') : base;
  return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:site_name" content="${siteConfig.name}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">${allSchema}</script>`;
}

function wrapPage(title, description, canonical, body, extraSchema) {
  return `---\nimport '../app.css';\n---\n<!DOCTYPE html>\n<html lang="es">\n<head>\n  ${schemaHead(title, description, canonical, extraSchema)}\n</head>\n<body class="min-h-screen flex flex-col bg-white text-gray-900">\n  ${headerHTML()}\n  <div class="h-16"></div>\n  <main class="flex-1">\n    ${body}\n  </main>\n  ${footerHTML()}\n  ${waFloatHTML()}\n</body>\n</html>`;
}

// ========== GENERATE PAGES ==========

const pages = [];

// 1. HOMEPAGE
const homeBody = `
  <section class="relative bg-gradient-to-br from-[#166534] via-[#14532D] to-[#052E16] text-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <span class="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse"></span>
          <span class="text-[#EAB308] text-sm font-medium">Patagonia Chilena, Región de Aysén</span>
        </div>
        <h1 class="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
          Terrenos en Venta en<br> <span class="text-[#EAB308]">Aysén</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
          Corretaje especializado en terrenos, parcelas y lotes en la Patagonia chilena. Títulos verificados, asesoría legal incluida y proceso 100% digital. Más de 120 operaciones exitosas.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="${waLink}" target="_blank" class="inline-flex items-center justify-center gap-2 bg-[#EAB308] text-[#14532D] font-bold px-6 py-4 rounded-xl hover:bg-[#FACC15] transition-colors no-underline text-lg">
            Consulta Inicial Gratis
          </a>
          <a href="/servicios" class="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-4 rounded-xl border-2 border-white/20 hover:bg-white/20 transition-colors no-underline text-lg">
            Ver Terrenos
          </a>
        </div>
      </div>
    </div>
    <div class="bg-[#052E16]/50 border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <p class="text-[#EAB308] text-xs font-medium mb-2 uppercase tracking-wider">Cobertura en Aysén</p>
        <div class="flex flex-wrap gap-2">
          ${locations.map(l => `<a href="/ubicaciones/${l.slug}" class="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors no-underline">${l.name}</a>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <section class="bg-[#F0FDF4] border-b border-gray-200 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center"><div class="text-3xl font-extrabold text-[#166534]">6+</div><div class="text-sm text-gray-600 mt-1">Años de experiencia</div></div>
        <div class="text-center"><div class="text-3xl font-extrabold text-[#166534]">120+</div><div class="text-sm text-gray-600 mt-1">Operaciones exitosas</div></div>
        <div class="text-center"><div class="text-3xl font-extrabold text-[#166534]">4.9</div><div class="text-sm text-gray-600 mt-1">Rating promedio</div></div>
        <div class="text-center"><div class="text-3xl font-extrabold text-[#166534]">156+</div><div class="text-sm text-gray-600 mt-1">Clientes satisfechos</div></div>
      </div>
    </div>
  </section>

  <section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-3xl lg:text-4xl font-extrabold text-gray-900">Nuestros Servicios Inmobiliarios</h2>
        <p class="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">La oferta más completa de terrenos en la Región de Aysén, con asesoría legal y visitas guiadas.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${services.map(s => `<a href="/servicios/${s.slug}" class="block bg-white border border-gray-200 rounded-2xl p-6 no-underline hover:shadow-lg hover:border-[#EAB308]/30 transition-all">
          <div class="w-12 h-12 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">${serviceIcon(s.slug)}</svg>
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-2">${s.name}</h3>
          <p class="text-gray-500 text-sm leading-relaxed mb-4">${s.description.substring(0, 150)}...</p>
          <span class="text-[#166534] text-sm font-semibold flex items-center gap-1">Más información <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="py-20 bg-[#F0FDF4]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-3xl lg:text-4xl font-extrabold text-gray-900">Lo que dicen nuestros clientes</h2>
        <p class="mt-4 text-lg text-gray-500">Más de 156 clientes confían en nosotros para encontrar su terreno en la Patagonia.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${testimonials.slice(0, 6).map(t => `<div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex gap-1 mb-3 text-[#EAB308]">${'&#9733;'.repeat(t.rating)}</div>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">"${esc(t.quote)}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-bold text-sm">${t.initials}</div>
            <div><div class="font-semibold text-sm text-gray-900">${t.author}</div><div class="text-xs text-gray-500">${t.location}</div></div>
          </div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="py-20 bg-[#166534]">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-white mb-4">¿Buscas terrenos en la Patagonia?</h2>
      <p class="text-gray-300 text-lg mb-8">Tu primera consulta es sin costo. Escríbenos por WhatsApp.</p>
      <a href="${waLink}" target="_blank" class="inline-flex items-center gap-2 bg-[#EAB308] text-[#14532D] font-bold px-8 py-4 rounded-xl hover:bg-[#FACC15] transition-colors no-underline text-lg">
        Escribir por WhatsApp
      </a>
    </div>
  </section>`;

pages.push({ path: 'src/pages/index.astro', content: wrapPage('Terrenos en Venta en Aysén | Parcelas, Lotes y Campos - Patagonia Chilena', 'Terrenos en venta en la Región de Aysén. Parcelas, lotes urbanos, campos agrícolas y terrenos rurales con títulos verificados. Asesoría legal incluida.', siteConfig.url + '/', homeBody) });

// 2. SERVICES INDEX
const svcIndexBody = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Servicios Inmobiliarios</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">La oferta más completa de terrenos en la Región de Aysén.</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${services.map(s => `<a href="/servicios/${s.slug}" class="block bg-white border border-gray-200 rounded-2xl p-8 no-underline hover:shadow-lg transition-all">
          <h2 class="text-2xl font-bold text-[#166534] mb-3">${s.name}</h2>
          <p class="text-gray-600 mb-4">${s.description}</p>
          <p class="text-sm font-semibold text-[#EAB308]">${s.priceRange}</p>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>`;
pages.push({ path: 'src/pages/servicios/index.astro', content: wrapPage('Servicios | Terrenos en Aysén', 'Todos nuestros servicios inmobiliarios en la Región de Aysén: venta de terrenos, parcelas, lotes urbanos, terrenos agrícolas y más.', siteConfig.url + '/servicios', svcIndexBody) });

// 3. SERVICE PAGES
services.forEach(s => {
  const body = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold mb-4">${s.heroHeading}</h1>
      <p class="text-xl text-gray-300 max-w-3xl">${s.description}</p>
      <p class="mt-4 text-[#EAB308] font-semibold text-lg">${s.priceRange}</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold mb-8">¿Por qué elegirnos?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        ${s.features.map(f => `<div class="flex items-start gap-3 p-4 bg-[#F0FDF4] rounded-xl">
          <svg class="w-5 h-5 text-[#166534] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span class="text-gray-700 text-sm">${f}</span>
        </div>`).join('\n        ')}
      </div>
      <h2 class="text-2xl font-bold mb-8">Proceso de ${s.name.toLowerCase()}</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        ${s.process.map(p => `<div class="text-center">
          <div class="w-12 h-12 bg-[#EAB308] text-[#14532D] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">${p.step}</div>
          <p class="text-gray-600 text-sm">${p.description}</p>
        </div>`).join('\n        ')}
      </div>
      <h2 class="text-2xl font-bold mb-8">Preguntas Frecuentes</h2>
      <div class="space-y-4">
        ${s.faqs.map(f => `<div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="font-bold text-gray-900 mb-2">${f.question}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${f.answer}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>`;
  pages.push({ path: `src/pages/servicios/${s.slug}.astro`, content: wrapPage(s.metaTitle, s.metaDescription, siteConfig.url + '/servicios/' + s.slug, body, `"hasOfferCatalog":{"@type":"OfferCatalog","name":"${s.name}","itemListElement":[{"@type":"Offer","priceSpecification":{"@type":"PriceSpecification","price":"${s.priceRange}"}}]}`) });
});

// 4. LOCATIONS INDEX
const locIndexBody = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Terrenos por Ubicación</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">Cobertura completa en toda la Región de Aysén, desde Coyhaique hasta Cochrane.</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${locations.map(l => `<a href="/ubicaciones/${l.slug}" class="block bg-white border border-gray-200 rounded-2xl p-6 no-underline hover:shadow-lg transition-all">
          <h2 class="text-xl font-bold text-[#166534] mb-2">${l.name}</h2>
          <p class="text-gray-600 text-sm mb-3">${l.localInsight.substring(0, 120)}...</p>
          <div class="flex flex-wrap gap-1">${l.neighborhoods.slice(0, 3).map(n => `<span class="text-xs bg-[#F0FDF4] text-[#166534] px-2 py-0.5 rounded-full">${n}</span>`).join('')}</div>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>`;
pages.push({ path: 'src/pages/ubicaciones/index.astro', content: wrapPage('Ubicaciones | Terrenos en Aysén', 'Terrenos en venta por ubicación en la Región de Aysén: Coyhaique, Puerto Aysén, Chile Chico, Cochrane y Río Ibáñez.', siteConfig.url + '/ubicaciones', locIndexBody) });

// 5. LOCATION PAGES
locations.forEach(l => {
  const relatedCombos = combos.filter(c => c.locationSlug === l.slug.replace('terrenos-', ''));
  const body = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold mb-4">Terrenos en Venta en ${l.name}</h1>
      <p class="text-xl text-gray-300 max-w-3xl">${l.metaDescription}</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#F0FDF4] rounded-2xl p-8 mb-12">
        <h2 class="text-xl font-bold text-[#166534] mb-3">Análisis del Mercado en ${l.name}</h2>
        <p class="text-gray-700 leading-relaxed">${l.localInsight}</p>
      </div>
      <h2 class="text-2xl font-bold mb-6">Barrios y Sectores</h2>
      <div class="flex flex-wrap gap-3 mb-12">
        ${l.neighborhoods.map(n => `<span class="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">${n}</span>`).join('\n        ')}
      </div>
      <h2 class="text-2xl font-bold mb-6">Puntos de Referencia</h2>
      <div class="flex flex-wrap gap-3 mb-12">
        ${l.landmarks.map(lm => `<span class="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">${lm}</span>`).join('\n        ')}
      </div>
      ${relatedCombos.length > 0 ? `<h2 class="text-2xl font-bold mb-6">Servicios Disponibles en ${l.name}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        ${relatedCombos.map(c => `<a href="/servicio-ubicacion/${c.serviceSlug}-${c.locationSlug}" class="block bg-white border border-gray-200 rounded-xl p-5 no-underline hover:shadow-md transition-all">
          <h3 class="font-bold text-[#166534] mb-2">${c.serviceName} - ${c.locationName}</h3>
          <p class="text-gray-500 text-sm">${c.metaDescription.substring(0, 100)}...</p>
        </a>`).join('\n        ')}
      </div>` : ''}
      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div class="flex gap-1 mb-3 text-[#EAB308]">${'&#9733;'.repeat(l.testimonial.rating)}</div>
        <p class="text-gray-600 italic mb-4">"${l.testimonial.quote}"</p>
        <p class="font-semibold text-gray-900 text-sm">${l.testimonial.author} - ${l.name}</p>
      </div>
    </div>
  </section>`;
  pages.push({ path: `src/pages/ubicaciones/${l.slug}.astro`, content: wrapPage(l.metaTitle, l.metaDescription, siteConfig.url + '/ubicaciones/' + l.slug, body, `"geo":{"@type":"GeoCoordinates","latitude":${l.geo.latitude},"longitude":${l.geo.longitude}}`) });
});

// 6. COMBO PAGES
combos.forEach(c => {
  const body = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold mb-4">${c.serviceName} - ${c.locationName}</h1>
      <p class="text-xl text-gray-300 max-w-3xl">${c.metaDescription}</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#F0FDF4] rounded-2xl p-8 mb-12">
        <h2 class="text-xl font-bold text-[#166534] mb-3">Terrenos en ${c.locationName}</h2>
        <p class="text-gray-700 leading-relaxed">${c.uniqueIntro}</p>
      </div>
      ${c.pricingNote ? `<div class="bg-white border-l-4 border-[#EAB308] rounded-r-xl p-6 mb-12">
        <h3 class="font-bold text-gray-900 mb-2">Rango de Precios</h3>
        <p class="text-gray-600">${c.pricingNote}</p>
      </div>` : ''}
      <h2 class="text-2xl font-bold mb-6">Problemas Locales a Considerar</h2>
      <div class="space-y-4 mb-12">
        ${c.localProblems.map(p => `<div class="bg-red-50 border border-red-100 rounded-xl p-5">
          <p class="text-gray-700 text-sm">${p}</p>
        </div>`).join('\n        ')}
      </div>
      <h2 class="text-2xl font-bold mb-8">Preguntas Frecuentes sobre ${c.serviceName} en ${c.locationName}</h2>
      <div class="space-y-4">
        ${c.uniqueFaqs.map(f => `<div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="font-bold text-gray-900 mb-2">${f.question}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${f.answer}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>`;
  pages.push({ path: `src/pages/servicio-ubicacion/${c.serviceSlug}-${c.locationSlug}.astro`, content: wrapPage(c.metaTitle, c.metaDescription, siteConfig.url + '/servicio-ubicacion/' + c.serviceSlug + '-' + c.locationSlug, body) });
});

// 7. BLOG INDEX
const blogIndexBody = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Blog de Terrenos en Aysén</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">Guías, noticias y consejos sobre compra de terrenos en la Patagonia chilena.</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${blogTopics.map(b => `<a href="/blog/${b.slug}" class="block bg-white border border-gray-200 rounded-2xl p-6 no-underline hover:shadow-lg transition-all">
          <span class="text-xs font-medium text-[#EAB308] bg-[#FEF9C3] px-2 py-0.5 rounded-full">${b.priority}</span>
          <h2 class="font-bold text-lg text-gray-900 mt-3 mb-2">${b.title}</h2>
          <p class="text-gray-500 text-sm">${b.metaDescription}</p>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>`;
pages.push({ path: 'src/pages/blog/index.astro', content: wrapPage('Blog | Terrenos en Aysén - Guías y Noticias', 'Artículos, guías y noticias sobre compra de terrenos, parcelas y lotes en la Región de Aysén.', siteConfig.url + '/blog', blogIndexBody) });

// 8. BLOG PAGES
blogTopics.forEach(b => {
  const body = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold mb-4">${b.title}</h1>
      <p class="text-xl text-gray-300 max-w-3xl">${b.metaDescription}</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <article class="prose prose-lg max-w-none">
        <p class="text-lg text-gray-700 leading-relaxed mb-8">La Región de Aysén se posiciona como uno de los mercados inmobiliarios más dinámicos del sur de Chile. Con el crecimiento del turismo patagónico, la mejora de conectividad aérea y terrestre, y la creciente demanda por espacios de vida rural, comprar terrenos en Aysén se ha convertido en una excelente oportunidad tanto para vivienda como para inversión.</p>
        <p class="text-gray-600 leading-relaxed mb-6">En esta guía completa sobre <strong>${b.targetKeyword}</strong>, abordamos todos los aspectos que necesitas considerar antes de tomar tu decisión de compra en la Patagonia chilena.</p>
        <h2 class="text-2xl font-bold text-[#166534] mt-10 mb-4">Factores Clave a Considerar</h2>
        <p class="text-gray-600 leading-relaxed mb-6">El mercado de terrenos en Aysén tiene características únicas que lo diferencian del resto de Chile. La Patagonia ofrece un entorno natural privilegiado con acceso a lagos, ríos, volcanes y parques nacionales, pero también presenta desafíos como el clima extremo, la distancia a centros de abastecimiento y la necesidad de planificar infraestructura básica.</p>
        <h2 class="text-2xl font-bold text-[#166534] mt-10 mb-4">Trámites y Requisitos</h2>
        <p class="text-gray-600 leading-relaxed mb-6">El proceso de compra de terrenos en Aysén requiere seguir ciertos pasos legales: estudio de títulos en el Conservador de Bienes Raíces, verificación de gravámenes y prohibiciones, certificado de contribuciones al día, y escrituración ante notario público. Todo el proceso puede completarse en 30 a 60 días hábiles.</p>
        <h2 class="text-2xl font-bold text-[#166534] mt-10 mb-4">Consejos de Expertos</h2>
        <p class="text-gray-600 leading-relaxed mb-6">Nuestro equipo recomienda visitar los terrenos en persona cuando sea posible, especialmente entre noviembre y abril cuando las condiciones climáticas son más favorables. Verificar el estado de los caminos de acceso en todas las estaciones y confirmar la disponibilidad de servicios básicos como agua y electricidad son pasos fundamentales.</p>
        <h2 class="text-2xl font-bold text-[#166534] mt-10 mb-4">¿Necesitas Asesoría?</h2>
        <p class="text-gray-600 leading-relaxed mb-6">Si estás considerando comprar terrenos en la Región de Aysén, nuestro equipo de corredores de propiedades está listo para ayudarte. Con más de 6 años de experiencia en la región y más de 120 operaciones exitosas, podemos orientarte en cada paso del proceso.</p>
        <div class="bg-[#F0FDF4] rounded-xl p-8 mt-8 text-center">
          <a href="${waLink}" target="_blank" class="inline-flex items-center gap-2 bg-[#166534] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#14532D] transition-colors no-underline text-lg">
            Consulta Gratuita por WhatsApp
          </a>
        </div>
      </article>
    </div>
  </section>`;
  pages.push({ path: `src/pages/blog/${b.slug}.astro`, content: wrapPage(b.title + ' | Terrenos en Aysén', b.metaDescription, siteConfig.url + '/blog/' + b.slug, body, `"@type":"Article","headline":"${b.title}","datePublished":"2026-04-01"`) });
});

// 9. CONTACT PAGE
const contactBody = `
  <section class="bg-gradient-to-br from-[#166534] to-[#052E16] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Contáctanos</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">Estamos en Coyhaique para ayudarte a encontrar el terreno perfecto en la Patagonia.</p>
    </div>
  </section>
  <section class="py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold mb-6">Información de Contacto</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">${siteConfig.address.street}</p>
                <p class="text-sm text-gray-500">${siteConfig.address.city}, ${siteConfig.address.state}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">${siteConfig.phoneDisplay}</p>
                <p class="text-sm text-gray-500">WhatsApp disponible</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">${siteConfig.email}</p>
                <p class="text-sm text-gray-500">Respuesta en 24 horas</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">${siteConfig.openingHoursSchema}</p>
                <p class="text-sm text-gray-500">Oficina en Coyhaique</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
          <form class="space-y-4" action="#" method="POST">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none" placeholder="Tu nombre" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none" placeholder="tu@email.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none" placeholder="+56 9 ..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea rows="4" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none" placeholder="¿Qué tipo de terreno buscas?"></textarea>
            </div>
            <button type="submit" class="w-full bg-[#166534] text-white font-bold py-3 rounded-xl hover:bg-[#14532D] transition-colors">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
pages.push({ path: 'src/pages/contacto/index.astro', content: wrapPage('Contacto | Terrenos en Aysén', 'Contáctanos para consultar sobre terrenos, parcelas y lotes en la Región de Aysén. Oficina en Coyhaique.', siteConfig.url + '/contacto', contactBody) });

// WRITE ALL FILES
let count = 0;
pages.forEach(p => {
  mkdirSync(p.path.substring(0, p.path.lastIndexOf('/')), { recursive: true });
  writeFileSync(p.path, p.content);
  count++;
});

console.log(`Generated ${count} pages:`);
pages.forEach(p => console.log(`  ${p.path}`));
