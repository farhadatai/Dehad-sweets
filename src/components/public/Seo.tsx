import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  path: string; // canonical path, e.g. "/products/cream-rolls"
  image?: string; // absolute-path OG image, e.g. "/img/hero-1280.webp"
  jsonLd?: object | object[];
}

const ORIGIN = 'https://www.dehatsweets.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Per-route SEO: title, description, canonical, Open Graph, JSON-LD. */
export default function Seo({ title, description, path, image = '/img/hero-1280.webp', jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', ORIGIN + path);
    upsertMeta('property', 'og:image', ORIGIN + image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', ORIGIN + path);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [title, description, path, image, jsonLd]);

  return null;
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dehat Sweets and Foods',
  url: ORIGIN,
  logo: `${ORIGIN}/img/logo-320.png`,
  email: 'info@dehatsweets.com',
  telephone: '+1-916-893-8020',
  areaServed: 'Sacramento, CA',
  description:
    'Handcrafted Afghan sweets and specialty foods — cream rolls, root, malida, khajoor, torshi, and chatni — made for families, celebrations, and store partners.',
};

export function productJsonLd(p: { name: string; slug: string; long: string; img: string }) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.long,
      image: `${ORIGIN}/img/${p.img}-800.webp`,
      brand: { '@type': 'Brand', name: 'Dehat Sweets and Foods' },
      url: `${ORIGIN}/products/${p.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${ORIGIN}/products` },
        { '@type': 'ListItem', position: 3, name: p.name, item: `${ORIGIN}/products/${p.slug}` },
      ],
    },
  ];
}
