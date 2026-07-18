import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import Img from '../../components/public/Img';
import Motif from '../../components/public/Motif';

/*
 * Copy note: everything here sticks to what is verifiable — Dehat is a
 * family-run Afghan sweets and foods producer serving the Sacramento area,
 * selling retail boxes and wholesale cases. No invented history, dates,
 * founders, or claims. Owner can enrich this page with real family details
 * (see redesign/07-owner-confirmation-checklist.md).
 */

const OurStory = () => (
  <>
    <Seo
      title="Our Story — Dehat Sweets and Foods"
      description="Dehat means village. We make traditional Afghan sweets and specialty foods by hand in the Sacramento area — the cream rolls, root, malida, and torshi our community grew up with."
      path="/our-story"
    />

    <section className="relative bg-forest-deep text-cream overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Img base="spices" alt="" widths={[800]} lgWidth={1536} sizes="100vw" eager className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#10160f]/70 via-[#10160f]/60 to-forest-deep" />
      </div>
      <div className="relative container mx-auto px-5 sm:px-6 py-24 sm:py-32 text-center">
        <p className="eyebrow-on-dark hero-enter">Our story</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream mt-4 hero-enter hero-enter-delay-1">
          Dehat Means Village.
        </h1>
        <p className="text-cream/85 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed hero-enter hero-enter-delay-2">
          It's where our recipes come from — and the spirit we bring to every batch.
        </p>
      </div>
    </section>

    <section className="py-16 sm:py-24 paper-grain">
      <div className="container mx-auto px-5 sm:px-6 max-w-3xl">
        <Reveal>
          <p className="text-lg sm:text-xl leading-relaxed text-charcoal">
            In Afghanistan, the best food never came from a factory. It came from home — from hands that knew the dough,
            the pot, and the people they were feeding. Cream rolls waiting beside the green tea. Root baked for good news.
            Malida shared straight from the bowl. Torshi and chatni brightening every plate on the table.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lg leading-relaxed text-char-soft mt-6">
            Dehat Sweets and Foods exists to keep those flavors alive here in California. We are a family-run producer in the
            Sacramento area, making traditional Afghan sweets and pantry staples in small batches — by hand, the way we remember them.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-lg leading-relaxed text-char-soft mt-6">
            Our boxes go two places: to families — for tea time, Eid, weddings, and everyday sweetness — and to the shelves of the
            Afghan markets, grocery stores, and restaurants that serve our community. Either way, the goal is the same: when you
            open a Dehat box, it should taste like being welcomed into someone's home.
          </p>
        </Reveal>

        <Motif className="text-saffron my-12" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { n: '9', label: 'traditional products' },
            { n: '2', label: 'ways to buy — retail & wholesale' },
            { n: '1', label: 'promise: made like home' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div>
                <p className="font-serif text-4xl font-bold text-burgundy">{s.n}</p>
                <p className="text-sm text-char-soft mt-2">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 sm:py-20 bg-cream">
      <div className="container mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <Img
            base="savory-products"
            alt="Dehat savory products — torshi, chatni, and spice blends"
            widths={[800]}
            lgWidth={1535}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full rounded-xl object-cover shadow-lg"
          />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="heading-display text-3xl sm:text-4xl font-bold">More Than Sweets</h2>
          <p className="text-char-soft text-lg leading-relaxed mt-5">
            Alongside our bakery line, we prepare the savory staples of the Afghan pantry: tangy torshi, green and red chatni,
            and traditional spice preparations. They're the jars that quietly hold a kitchen together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Link to="/products" className="btn-forest">Browse Products</Link>
            <Link to="/contact" className="btn-outline-forest">Ask Us Anything</Link>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default OurStory;
