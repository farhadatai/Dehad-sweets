import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo, { organizationJsonLd } from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import Img from '../../components/public/Img';
import Motif from '../../components/public/Motif';
import { featuredProducts, CONTACT, whatsappOrderLink } from '../../data/products';
import apiFetch from '../../utils/api';

/* ---------------- Hero ---------------- */

const Hero = () => (
  <section className="relative bg-forest-deep text-cream overflow-hidden">
    <div className="absolute inset-0" aria-hidden="true">
      <img
        src="/img/hero-1280.webp"
        srcSet="/img/hero-768.webp 768w, /img/hero-1280.webp 1280w, /img/hero-lg.webp 1536w"
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="w-full h-full object-cover hero-drift"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10160f]/90 via-[#10160f]/70 to-[#10160f]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#10160f]/85 via-transparent to-transparent" />
    </div>

    <div className="relative container mx-auto px-5 sm:px-6 py-28 sm:py-36 lg:py-44 max-w-none">
      <div className="max-w-2xl">
        <p className="eyebrow-on-dark hero-enter">Handcrafted Afghan sweets &amp; specialty foods</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mt-4 text-cream hero-enter hero-enter-delay-1">
          Afghan Tradition,<br />Made to Be Shared.
        </h1>
        <p className="text-lg sm:text-xl text-cream/85 mt-6 max-w-xl leading-relaxed hero-enter hero-enter-delay-2">
          Handcrafted sweets and specialty foods inspired by the flavors, hospitality, and memories of Afghanistan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-9 hero-enter hero-enter-delay-3">
          <Link to="/products" className="btn-hero-primary">Shop Our Sweets</Link>
          <Link to="/our-story" className="btn-hero-secondary">Discover Our Story</Link>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- Featured products ---------------- */

const FeaturedProducts = () => (
  <section className="py-16 sm:py-24 paper-grain" aria-labelledby="featured-heading">
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="eyebrow">From our kitchen</p>
        <h2 id="featured-heading" className="heading-display text-3xl sm:text-4xl font-bold mt-3">
          Sweets Worth Gathering For
        </h2>
        <p className="text-char-soft mt-4 text-lg">
          Every batch is made by hand, packed fresh, and ready for your table — or your store shelves.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 list-none">
        {featuredProducts.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 90}>
            <article className="product-card bg-cream rounded-xl overflow-hidden border border-sand h-full flex flex-col">
              <Link to={`/products/${p.slug}`} className="block overflow-hidden" aria-label={`View ${p.name}`}>
                <Img base={p.img} alt={p.alt} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="w-full aspect-[4/3] object-cover" />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-xl font-bold text-charcoal">
                  <Link to={`/products/${p.slug}`} className="hover:text-burgundy transition-colors">{p.name}</Link>
                </h3>
                <p className="text-sm text-char-soft mt-2 leading-relaxed flex-1">{p.short}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest mt-3">{p.size}</p>
                <div className="flex gap-2 mt-4">
                  <Link to={`/products/${p.slug}`} className="btn-outline-forest text-sm flex-1">View</Link>
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

      <Reveal className="text-center mt-10">
        <Link to="/products" className="heritage-link text-lg font-semibold underline underline-offset-4 decoration-saffron">
          See all nine products →
        </Link>
      </Reveal>
    </div>
  </section>
);

/* ---------------- Brand story teaser ---------------- */

const StoryTeaser = () => (
  <section className="py-16 sm:py-24 bg-cream" aria-labelledby="story-heading">
    <div className="container mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <Reveal>
        <Img base="about-dehat" alt="Dehat sweets and foods arranged for a family gathering" lgWidth={1536} widths={[800]} sizes="(max-width: 1024px) 100vw, 50vw" className="w-full rounded-xl object-cover aspect-[4/3] shadow-lg" />
      </Reveal>
      <Reveal delay={120}>
        <p className="eyebrow">Our story</p>
        <h2 id="story-heading" className="heading-display text-3xl sm:text-4xl font-bold mt-3">
          The Flavors We Grew Up With
        </h2>
        <p className="text-char-soft text-lg leading-relaxed mt-5">
          Dehat means village — and that is where our recipes come from. The cream rolls shared with green tea, the root baked for
          happy occasions, the torshi and chatni that never left the table. We make these foods the way we remember them, by hand,
          in small batches, for the families and stores of our community.
        </p>
        <div className="mt-7">
          <Link to="/our-story" className="btn-outline-forest">Read Our Story</Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ---------------- Signature product story (scroll narrative) ---------------- */

const storySteps = [
  {
    title: 'Rolled thin, by hand',
    text: 'Each cream roll starts as pastry rolled thin and shaped by hand — the way it has always been done.',
  },
  {
    title: 'Baked golden and crisp',
    text: 'Small batches go into the oven until the shells turn light, golden, and delicately crisp.',
  },
  {
    title: 'Filled with sweet cream',
    text: 'Once cooled, every shell is filled with smooth sweet cream — generous, but never heavy.',
  },
  {
    title: 'Packed fresh to share',
    text: 'Nine rolls to a box, ready for tea time, guests, and celebrations. Made to be shared.',
  },
];

const SignatureStory = () => (
  <section className="py-16 sm:py-24 bg-forest text-cream" aria-labelledby="signature-heading">
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="eyebrow-on-dark">Signature sweet</p>
        <h2 id="signature-heading" className="font-serif text-3xl sm:text-4xl font-bold mt-3 text-cream">
          The Cream Roll, Start to Finish
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-12 items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Img
              base="cream-roll-feature"
              alt="Close view of Dehat cream rolls, golden pastry filled with sweet cream"
              widths={[800]}
              lgWidth={1536}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full rounded-xl object-cover aspect-[4/3] shadow-2xl"
            />
          </Reveal>
        </div>
        <ol className="space-y-8 list-none">
          {storySteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80}>
              <div className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="flex-none w-10 h-10 rounded-full border border-saffron-soft/60 text-saffron-soft font-serif font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-cream">{step.title}</h3>
                  <p className="text-cream/75 mt-2 leading-relaxed">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={340}>
            <div className="pl-15 sm:pl-0 pt-2">
              <Link to="/products/cream-rolls" className="btn-hero-primary">See the Cream Rolls</Link>
            </div>
          </Reveal>
        </ol>
      </div>
    </div>
  </section>
);

/* ---------------- Occasions ---------------- */

const occasions = [
  { title: 'Eid & holidays', text: 'Trays of khajoor and cream rolls for the sweetest days of the year.' },
  { title: 'Weddings & engagements', text: 'Gift-ready boxes that honor the occasion and the guests.' },
  { title: 'Tea time', text: 'The everyday ritual — green tea, good company, and something sweet.' },
  { title: 'Family gatherings', text: 'Malida and root, shared straight from the box like home.' },
  { title: 'Corporate & community', text: 'Order in cases for events, fundraisers, and gatherings.' },
  { title: 'A thoughtful gift', text: 'A box of Dehat says: you were thought of, warmly.' },
];

const Occasions = () => (
  <section className="py-16 sm:py-24 paper-grain" aria-labelledby="occasions-heading">
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="eyebrow">Occasions &amp; gifting</p>
        <h2 id="occasions-heading" className="heading-display text-3xl sm:text-4xl font-bold mt-3">
          For Every Table That Matters
        </h2>
      </Reveal>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 list-none">
        {occasions.map((o, i) => (
          <Reveal as="li" key={o.title} delay={(i % 3) * 90}>
            <div className="bg-cream border border-sand rounded-xl p-6 h-full">
              <h3 className="font-serif text-lg font-bold text-forest">{o.title}</h3>
              <p className="text-sm text-char-soft mt-2 leading-relaxed">{o.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ---------------- Why Dehat ---------------- */

const whyItems = [
  {
    title: 'Authentic Afghan flavors',
    text: 'Traditional recipes for cream rolls, root, malida, khajoor, torshi, and chatni — the real thing.',
  },
  {
    title: 'Carefully prepared',
    text: 'Small batches, made by hand and packed fresh for families and store partners.',
  },
  {
    title: 'Gift-ready presentation',
    text: 'Clean, well-packed boxes and jars that are ready to give, serve, or shelve.',
  },
  {
    title: 'Convenient ordering',
    text: 'Order by phone, WhatsApp, or email — and wholesale partners get their own portal.',
  },
];

const WhyDehat = () => (
  <section className="py-16 sm:py-24 bg-cream" aria-labelledby="why-heading">
    <div className="container mx-auto px-5 sm:px-6">
      <Motif className="text-saffron mb-10" />
      <Reveal className="text-center max-w-2xl mx-auto">
        <h2 id="why-heading" className="heading-display text-3xl sm:text-4xl font-bold">Why Dehat</h2>
      </Reveal>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 list-none">
        {whyItems.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 90}>
            <div className="text-center px-4">
              <h3 className="font-serif text-lg font-bold text-charcoal">{item.title}</h3>
              <p className="text-sm text-char-soft mt-3 leading-relaxed">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ---------------- Wholesale strip ---------------- */

const WholesaleStrip = () => (
  <section className="py-16 sm:py-20 bg-burgundy text-cream" aria-labelledby="wholesale-heading">
    <div className="container mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
      <Reveal>
        <p className="eyebrow-on-dark">For markets, restaurants &amp; cafés</p>
        <h2 id="wholesale-heading" className="font-serif text-3xl sm:text-4xl font-bold mt-3 text-cream">
          Put Dehat on Your Shelves
        </h2>
        <p className="text-cream/85 text-lg mt-4 max-w-2xl leading-relaxed">
          Case-packed sweets and pantry staples, reliable batches, clear invoices, and a partner portal for reordering.
          We work with Afghan markets, grocery stores, restaurants, cafés, and event planners across the Sacramento area.
        </p>
      </Reveal>
      <Reveal delay={120} className="flex flex-col sm:flex-row lg:flex-col gap-3">
        <Link to="/wholesale" className="btn-hero-primary text-center">Wholesale Inquiry</Link>
        <a href={CONTACT.catalogPdf} download className="btn-hero-secondary text-center">Download Catalog (PDF)</a>
      </Reveal>
    </div>
  </section>
);

/* ---------------- Email signup ---------------- */

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      await apiFetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email, company: '' }),
      });
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-16 sm:py-20 paper-grain" aria-labelledby="signup-heading">
      <div className="container mx-auto px-5 sm:px-6 max-w-2xl text-center">
        <Reveal>
          <h2 id="signup-heading" className="heading-display text-2xl sm:text-3xl font-bold">Join the Dehat Table</h2>
          <p className="text-char-soft mt-3">
            Be the first to hear about product launches, seasonal sweets, and special offers.
          </p>
          {status === 'ok' ? (
            <p role="status" className="mt-6 text-forest font-semibold">
              Thank you — you're on the list. We'll be in touch.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <label htmlFor="signup-email" className="sr-only">Email address</label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 max-w-md rounded-md border border-sand bg-cream px-4 py-3 text-charcoal placeholder:text-char-soft/60"
              />
              <button type="submit" className="btn-forest" disabled={status === 'sending'}>
                {status === 'sending' ? 'Joining…' : 'Join'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p role="alert" className="mt-4 text-burgundy text-sm">
              Something went wrong. Please try again, or email us at {CONTACT.email}.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- Page ---------------- */

const HomePage = () => (
  <>
    <Seo
      title="Dehat Sweets and Foods — Handcrafted Afghan Sweets & Specialty Foods"
      description="Handcrafted Afghan sweets and specialty foods in the Sacramento area — cream rolls, root, malida, khajoor, torshi, and chatni. Order for your family, your event, or your store."
      path="/"
      jsonLd={organizationJsonLd}
    />
    <Hero />
    <FeaturedProducts />
    <StoryTeaser />
    <SignatureStory />
    <Occasions />
    <WhyDehat />
    <WholesaleStrip />
    <EmailSignup />
  </>
);

export default HomePage;
