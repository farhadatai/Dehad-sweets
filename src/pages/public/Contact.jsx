import React, { useState } from 'react';
import Seo from '../../components/public/Seo';
import Reveal from '../../components/public/Reveal';
import { CONTACT, whatsappOrderLink } from '../../data/products';
import apiFetch from '../../utils/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', company: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(form) });
      setStatus('ok');
      setForm({ name: '', email: '', phone: '', message: '', company: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <>
      <Seo
        title="Contact & Ordering — Dehat Sweets and Foods"
        description="Order Dehat Afghan sweets and foods by phone, WhatsApp, or email. Serving families and stores in the Sacramento area. Call 916-893-8020."
        path="/contact"
      />

      <section className="py-14 sm:py-20 paper-grain">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Contact &amp; ordering</p>
            <h1 className="heading-display text-4xl sm:text-5xl font-bold mt-3">We'd Love to Hear From You</h1>
            <p className="text-char-soft text-lg mt-4">
              Orders, questions, ingredients, events, wholesale — reach us any way you like.
            </p>
          </div>

          <div id="order" className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 max-w-4xl mx-auto">
            <Reveal className="h-full">
              <a
                href={whatsappOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-forest text-cream rounded-xl p-6 h-full hover:bg-forest-deep transition-colors"
              >
                <h2 className="font-serif text-xl font-bold text-cream">WhatsApp</h2>
                <p className="text-cream/80 text-sm mt-2">Fastest way to order — message us anytime.</p>
                <p className="text-saffron-soft font-semibold mt-4">{CONTACT.phones[0]} →</p>
              </a>
            </Reveal>
            <Reveal delay={90} className="h-full">
              <div className="bg-cream border border-sand rounded-xl p-6 h-full">
                <h2 className="font-serif text-xl font-bold text-charcoal">Phone</h2>
                <p className="text-char-soft text-sm mt-2">Call us to place an order or ask a question.</p>
                <p className="mt-4 space-y-1">
                  <a href={CONTACT.phoneHrefs[0]} className="block font-semibold text-forest hover:text-burgundy">{CONTACT.phones[0]}</a>
                  <a href={CONTACT.phoneHrefs[1]} className="block font-semibold text-forest hover:text-burgundy">{CONTACT.phones[1]}</a>
                </p>
              </div>
            </Reveal>
            <Reveal delay={180} className="h-full">
              <a href={`mailto:${CONTACT.email}`} className="block bg-cream border border-sand rounded-xl p-6 h-full hover:border-saffron transition-colors">
                <h2 className="font-serif text-xl font-bold text-charcoal">Email</h2>
                <p className="text-char-soft text-sm mt-2">For orders, wholesale, and anything else.</p>
                <p className="font-semibold text-forest mt-4 break-all">{CONTACT.email}</p>
              </a>
            </Reveal>
          </div>

          <Reveal className="max-w-2xl mx-auto mt-16">
            <div className="bg-cream border border-sand rounded-xl p-6 sm:p-8">
              <h2 className="heading-display text-2xl font-bold">Send Us a Message</h2>
              {status === 'ok' ? (
                <p role="status" className="mt-5 text-forest font-semibold">
                  Thank you — your message is on its way. We'll get back to you soon.
                </p>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-5">
                  {/* Honeypot — hidden from real users */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-company">Company</label>
                    <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-charcoal mb-1.5">Name *</label>
                      <input id="contact-name" type="text" required autoComplete="name" value={form.name} onChange={set('name')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-charcoal mb-1.5">Email *</label>
                      <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={set('email')}
                        className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-charcoal mb-1.5">Phone (optional)</label>
                    <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')}
                      className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-charcoal mb-1.5">Message *</label>
                    <textarea id="contact-message" required rows={5} value={form.message} onChange={set('message')}
                      className="w-full rounded-md border border-sand bg-parchment px-4 py-2.5 text-charcoal" />
                  </div>
                  {status === 'error' && (
                    <p role="alert" className="text-burgundy text-sm">
                      {errorMsg} You can also email us directly at {CONTACT.email}.
                    </p>
                  )}
                  <button type="submit" className="btn-forest w-full sm:w-auto" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <p className="text-center text-sm text-char-soft mt-10">
            Serving the Sacramento area, California. Wholesale deliveries scheduled with partner stores.
          </p>
        </div>
      </section>
    </>
  );
};

export default Contact;
