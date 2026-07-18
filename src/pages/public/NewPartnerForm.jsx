import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import Img from '../../components/public/Img';
import { CONTACT } from '../../data/products';
import apiFetch from '../../utils/api';

/*
 * Wholesale & partner inquiry page.
 * Served at both /wholesale and /become-a-partner (URL preserved).
 * Posts to the existing, working /api/partners endpoint.
 */

const audiences = [
  'Afghan markets',
  'Grocery stores',
  'Restaurants',
  'Cafés',
  'Event planners',
  'Community organizations',
];

const benefits = [
  { title: 'Case-packed & consistent', text: 'Every product ships in clear case counts — 12 or 24 per case — packed fresh in batches.' },
  { title: 'Simple reordering', text: 'Approved partners get a store portal for orders, invoices, and delivery records.' },
  { title: 'Real relationships', text: 'A family-run producer that picks up the phone and works around your shelf space.' },
];

const Wholesale = () => {
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    location: '',
    requestType: 'Wholesale pricing & catalog',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await apiFetch('/api/partners', { method: 'POST', body: JSON.stringify(form) });
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <>
      <Seo
        title="Wholesale & Partners — Dehat Sweets and Foods"
        description="Stock authentic Afghan sweets and foods in your market, restaurant, or café. Case-packed cream rolls, root, malida, khajoor, torshi, and chatni for Sacramento-area stores."
        path="/wholesale"
      />

      <section className="relative bg-forest-deep text-cream overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Img base="partners" alt="" widths={[800]} lgWidth={1536} sizes="100vw" eager className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#10160f]/70 via-[#10160f]/70 to-forest-deep" />
        </div>
        <div className="relative container mx-auto px-5 sm:px-6 py-20 sm:py-28 text-center">
          <p className="eyebrow-on-dark hero-enter">Wholesale &amp; partners</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream mt-4 hero-enter hero-enter-delay-1">
            Bring Dehat to Your Shelves
          </h1>
          <p className="text-cream/85 text-lg max-w-2xl mx-auto mt-5 hero-enter hero-enter-delay-2">
            Authentic Afghan sweets and pantry staples your customers already know and miss.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 paper-grain">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <Reveal>
                <h2 className="heading-display text-3xl font-bold">Who We Work With</h2>
                <ul className="flex flex-wrap gap-2.5 mt-5 list-none">
                  {audiences.map((a) => (
                    <li key={a} className="rounded-full bg-cream border border-sand px-4 py-2 text-sm font-medium text-charcoal">{a}</li>
                  ))}
                </ul>
              </Reveal>

              <div className="space-y-5 mt-10">
                {benefits.map((b, i) => (
                  <Reveal key={b.title} delay={i * 90}>
                    <div className="bg-cream border border-sand rounded-xl p-5">
                      <h3 className="font-serif text-lg font-bold text-forest">{b.title}</h3>
                      <p className="text-sm text-char-soft mt-2 leading-relaxed">{b.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={280}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href={CONTACT.catalogPdf} download className="btn-outline-forest text-center">Download Catalog (PDF)</a>
                  <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Wholesale inquiry')}`} className="btn-outline-forest text-center">
                    Email {CONTACT.email}
                  </a>
                </div>
                <p className="text-sm text-char-soft mt-4">
                  Prefer the phone? Call <a href={CONTACT.phoneHrefs[0]} className="font-semibold text-forest hover:text-burgundy">{CONTACT.phones[0]}</a>{' '}
                  or <a href={CONTACT.phoneHrefs[1]} className="font-semibold text-forest hover:text-burgundy">{CONTACT.phones[1]}</a>.
                </p>
              </Reveal>
            </div>

            {/* Inquiry form */}
            <Reveal delay={120}>
              <div className="bg-cream border border-sand rounded-xl p-6 sm:p-8 lg:sticky lg:top-28">
                <h2 className="heading-display text-2xl font-bold">Wholesale Inquiry</h2>
                <p className="text-char-soft text-sm mt-2">
                  Tell us about your business and we'll follow up with pricing, case counts, and delivery options.
                </p>

                {status === 'ok' ? (
                  <div role="status" className="mt-6">
                    <p className="text-forest font-semibold">Thank you — your inquiry has been received.</p>
                    <p className="text-char-soft text-sm mt-2">
                      We'll be in touch soon. Ready to go deeper? You can also{' '}
                      <Link to="/register" className="text-burgundy font-semibold underline underline-offset-2">request a partner account</Link>{' '}
                      for portal access.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="w-business" className="block text-sm font-semibold text-charcoal mb-1.5">Business name *</label>
                      <input id="w-business" type="text" required autoComplete="organization" value={form.businessName} onChange={set('businessName')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="w-contact" className="block text-sm font-semibold text-charcoal mb-1.5">Contact person *</label>
                        <input id="w-contact" type="text" required autoComplete="name" value={form.contactPerson} onChange={set('contactPerson')}
                          className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                      </div>
                      <div>
                        <label htmlFor="w-phone" className="block text-sm font-semibold text-charcoal mb-1.5">Phone *</label>
                        <input id="w-phone" type="tel" required autoComplete="tel" value={form.phoneNumber} onChange={set('phoneNumber')}
                          className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="w-email" className="block text-sm font-semibold text-charcoal mb-1.5">Email *</label>
                      <input id="w-email" type="email" required autoComplete="email" value={form.email} onChange={set('email')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                    </div>
                    <div>
                      <label htmlFor="w-location" className="block text-sm font-semibold text-charcoal mb-1.5">City / location</label>
                      <input id="w-location" type="text" value={form.location} onChange={set('location')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                    </div>
                    <div>
                      <label htmlFor="w-type" className="block text-sm font-semibold text-charcoal mb-1.5">What do you need?</label>
                      <select id="w-type" value={form.requestType} onChange={set('requestType')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal">
                        <option>Wholesale pricing &amp; catalog</option>
                        <option>Product samples</option>
                        <option>Event / large order</option>
                        <option>Partner account (store portal)</option>
                        <option>Something else</option>
                      </select>
                    </div>
                    {status === 'error' && (
                      <p role="alert" className="text-burgundy text-sm">
                        {errorMsg} You can also email us at {CONTACT.email}.
                      </p>
                    )}
                    <button type="submit" className="btn-forest w-full" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wholesale;
