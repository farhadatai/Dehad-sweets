import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import Img from '../../components/public/Img';
import Motif from '../../components/public/Motif';
import { products, whatsappOrderLink } from '../../data/products';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'bakery', label: 'Sweets & Bakery' },
  { key: 'savory', label: 'Savory & Pantry' },
];

const ProductsPage = () => {
  const [filter, setFilter] = useState('all');
  const visible = products.filter((p) => filter === 'all' || p.category === filter);

  return (
    <>
      <Seo
        title="All Products — Dehat Sweets and Foods"
        description="Browse all Dehat products: Afghan cream rolls, root, malida, khajoor, torshi, green and red chatni, and traditional spice blends. Available retail and wholesale in the Sacramento area."
        path="/products"
      />

      <section className="py-14 sm:py-20 paper-grain">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Our products</p>
            <h1 className="heading-display text-4xl sm:text-5xl font-bold mt-3">Made by Hand, Packed Fresh</h1>
            <p className="text-char-soft text-lg mt-4">
              Nine traditional products — from celebration sweets to the jars that live on every Afghan table.
            </p>
          </div>

          <Motif className="text-saffron my-10" />

          <div role="group" aria-label="Filter products by category" className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={
                  filter === f.key
                    ? 'rounded-full bg-forest text-cream px-5 py-2 text-sm font-semibold'
                    : 'rounded-full border border-forest/30 text-forest px-5 py-2 text-sm font-semibold hover:bg-forest/5 transition-colors'
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
            {visible.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                <article className="product-card bg-cream rounded-xl overflow-hidden border border-sand h-full flex flex-col">
                  <Link to={`/products/${p.slug}`} className="block overflow-hidden" aria-label={`View ${p.name}`}>
                    <Img
                      base={p.img}
                      alt={p.alt}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-serif text-xl font-bold text-charcoal">
                        <Link to={`/products/${p.slug}`} className="hover:text-burgundy transition-colors">{p.name}</Link>
                      </h2>
                      <span className="flex-none text-[11px] font-semibold uppercase tracking-wide text-burgundy border border-burgundy/30 rounded-full px-2.5 py-1">
                        {p.category === 'bakery' ? 'Sweet' : 'Savory'}
                      </span>
                    </div>
                    <p className="text-sm text-char-soft mt-2 leading-relaxed flex-1">{p.short}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-forest mt-3">
                      {p.size} · {p.caseInfo}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Link to={`/products/${p.slug}`} className="btn-outline-forest text-sm flex-1">Details</Link>
                      <a
                        href={whatsappOrderLink(p.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-forest text-sm flex-1"
                      >
                        Order
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-14 bg-forest text-cream rounded-xl px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-cream">Buying for a store or event?</h2>
              <p className="text-cream/80 mt-1">Every product is available case-packed for wholesale partners.</p>
            </div>
            <Link to="/wholesale" className="btn-hero-primary flex-none">Wholesale Inquiry</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
