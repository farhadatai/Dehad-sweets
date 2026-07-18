import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo, { productJsonLd } from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import Img from '../../components/public/Img';
import { products, bySlug, CONTACT, whatsappOrderLink, mailOrderLink } from '../../data/products';

const ProductView = () => {
  const { productName } = useParams();
  const product = bySlug(productName);
  const [zoomed, setZoomed] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="heading-display text-3xl font-bold">Product not found</h1>
        <p className="text-char-soft mt-3">The product you're looking for may have moved.</p>
        <Link to="/products" className="btn-forest mt-6">Browse all products</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={`${product.name} — Dehat Sweets and Foods`}
        description={product.short + ' ' + `Available in ${product.size}; wholesale: ${product.caseInfo}. Order by phone, WhatsApp, or email.`}
        path={`/products/${product.slug}`}
        image={`/img/${product.img}-800.webp`}
        jsonLd={productJsonLd(product)}
      />

      <article className="py-10 sm:py-16">
        <div className="container mx-auto px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-char-soft mb-6">
            <ol className="flex flex-wrap gap-1 list-none">
              <li><Link to="/" className="hover:text-burgundy">Home</Link><span aria-hidden="true" className="mx-1">/</span></li>
              <li><Link to="/products" className="hover:text-burgundy">Products</Link><span aria-hidden="true" className="mx-1">/</span></li>
              <li aria-current="page" className="text-charcoal font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image + zoom */}
            <div>
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="block w-full rounded-xl overflow-hidden border border-sand bg-cream cursor-zoom-in"
                aria-label={`Zoom into photo of ${product.name}`}
              >
                <Img
                  base={product.img}
                  alt={product.alt}
                  eager
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full aspect-[4/3] object-cover"
                />
              </button>
              <p className="text-xs text-char-soft mt-2 text-center">Click photo to zoom</p>
            </div>

            {/* Details */}
            <div>
              <p className="eyebrow">{product.category === 'bakery' ? 'Sweets & bakery' : 'Savory & pantry'}</p>
              <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">{product.name}</h1>
              <p className="text-char-soft text-lg leading-relaxed mt-5">{product.long}</p>

              <dl className="grid grid-cols-2 gap-4 mt-7">
                <div className="bg-cream border border-sand rounded-lg p-4">
                  <dt className="text-xs uppercase tracking-wide font-semibold text-char-soft">Retail size</dt>
                  <dd className="font-serif text-lg font-bold text-charcoal mt-1">{product.size}</dd>
                </div>
                <div className="bg-cream border border-sand rounded-lg p-4">
                  <dt className="text-xs uppercase tracking-wide font-semibold text-char-soft">Wholesale</dt>
                  <dd className="font-serif text-lg font-bold text-charcoal mt-1">{product.caseInfo}</dd>
                </div>
              </dl>

              {product.serving && (
                <div className="mt-6 border-l-2 border-saffron pl-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal">Serving suggestion</h2>
                  <p className="text-char-soft mt-1">{product.serving}</p>
                </div>
              )}

              {/* Order panel — real, inquiry-based ordering */}
              <div id="order" className="mt-8 bg-forest text-cream rounded-xl p-6">
                <h2 className="font-serif text-xl font-bold text-cream">Order {product.name}</h2>
                <p className="text-cream/80 text-sm mt-1.5">
                  We take orders directly — same-day response during business hours.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  <a href={whatsappOrderLink(product.name)} target="_blank" rel="noopener noreferrer" className="btn-hero-primary text-sm text-center">
                    WhatsApp
                  </a>
                  <a href={CONTACT.phoneHrefs[0]} className="btn-hero-secondary text-sm text-center">
                    Call {CONTACT.phones[0]}
                  </a>
                  <a href={mailOrderLink(product.name)} className="btn-hero-secondary text-sm text-center">
                    Email us
                  </a>
                </div>
              </div>

              <div className="mt-6 text-sm text-char-soft space-y-2">
                <p>
                  <strong className="text-charcoal">Ingredients &amp; allergens:</strong> ask us directly and we'll gladly share details
                  for any product.
                </p>
                <p>
                  <strong className="text-charcoal">Pickup &amp; delivery:</strong> contact us for current options in the Sacramento area.
                  Wholesale deliveries are scheduled with our partner stores.
                </p>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-16 sm:mt-24">
              <Reveal>
                <h2 id="related-heading" className="heading-display text-2xl sm:text-3xl font-bold text-center">
                  You May Also Like
                </h2>
              </Reveal>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 list-none">
                {related.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={i * 80}>
                    <Link
                      to={`/products/${p.slug}`}
                      className="product-card block bg-cream rounded-xl overflow-hidden border border-sand"
                    >
                      <Img base={p.img} alt={p.alt} sizes="(max-width: 640px) 100vw, 33vw" className="w-full aspect-[4/3] object-cover" />
                      <div className="p-4">
                        <h3 className="font-serif text-lg font-bold text-charcoal">{p.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-wide text-forest mt-1">{p.size}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {/* Zoom dialog */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed photo of ${product.name}`}
          className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <img src={`/img/${product.img}-lg.webp`} alt={product.alt} className="max-h-full max-w-full object-contain rounded-lg" />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-cream text-charcoal font-bold text-lg"
            aria-label="Close zoom"
            autoFocus
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ProductView;
