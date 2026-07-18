// Single source of truth for public product content.
// All sizes/case counts come from the official Dehat product catalog PDF.
// DO NOT add ingredients, allergens, shelf life, or certifications here
// until the owner confirms them (see redesign/07-owner-confirmation-checklist.md).

export type ProductCategory = 'bakery' | 'savory';

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  size: string;        // retail unit, from catalog
  caseInfo: string;    // wholesale case info, from catalog
  short: string;       // one-line card description
  long: string;        // product-page description (cultural/general, no invented recipe claims)
  img: string;         // base name in /public/img (–400/–800/–lg.webp)
  alt: string;
  featured?: boolean;
  serving?: string;    // serving suggestion (general, non-factual-claim)
}

export const products: Product[] = [
  {
    slug: 'cream-rolls',
    name: 'Cream Rolls',
    category: 'bakery',
    size: '9-roll box',
    caseInfo: '24-roll wholesale case',
    short: 'Crisp, flaky pastry rolls with a smooth sweet cream filling.',
    long:
      'Our signature sweet: light, golden pastry rolled thin, baked until crisp, and filled with a smooth sweet cream. A favorite on Afghan tables for tea time, guests, and celebrations — packed fresh in a 9-roll box.',
    img: 'cream-rolls',
    alt: 'Box of Dehat cream rolls — golden flaky pastry rolls filled with sweet cream',
    featured: true,
    serving: 'Serve with green tea or coffee. A classic for guests and gatherings.',
  },
  {
    slug: 'root',
    name: 'Root',
    category: 'bakery',
    size: '1.5 lb box',
    caseInfo: '12 boxes per case',
    short: 'Traditional Afghan sweet bread — dense, tender, and lightly sweet.',
    long:
      'Root (roht) is a beloved Afghan sweet bread: dense, tender, and gently sweet, traditionally shared at family gatherings and happy occasions. Baked in batches and packed in 1.5 lb boxes.',
    img: 'root',
    alt: 'Dehat root — traditional Afghan sweet bread in a 1.5 pound box',
    featured: true,
    serving: 'Slice and share with tea — a staple of Afghan hospitality.',
  },
  {
    slug: 'malida',
    name: 'Malida',
    category: 'bakery',
    size: '1.5 lb box',
    caseInfo: '12 boxes per case',
    short: 'Soft, fragrant crumbled sweet — a comforting Afghan classic.',
    long:
      'Malida is a comforting Afghan classic: a soft, fragrant crumbled sweet traditionally prepared for family occasions and shared straight from the bowl. Packed in 1.5 lb boxes.',
    img: 'malida',
    alt: 'Dehat malida — soft crumbled Afghan sweet in a 1.5 pound box',
    featured: true,
    serving: 'Spoon into small bowls for guests, or enjoy with tea.',
  },
  {
    slug: 'khajoor',
    name: 'Khajoor',
    category: 'bakery',
    size: '1.5 lb box',
    caseInfo: '24 boxes per case',
    short: 'Golden fried pastries — crisp outside, tender inside.',
    long:
      'Khajoor are golden, date-shaped fried pastries: crisp on the outside, tender inside, and just sweet enough. A nostalgic treat found on Afghan tables at Eid and family celebrations. Packed in 1.5 lb boxes.',
    img: 'khajoor',
    alt: 'Dehat khajoor — golden date-shaped Afghan fried pastries',
    featured: true,
    serving: 'Perfect alongside tea, or set out for Eid and celebrations.',
  },
  {
    slug: 'afghan-torshi',
    name: 'Afghan Torshi',
    category: 'savory',
    size: '32 oz jar',
    caseInfo: '24 jars per case',
    short: 'Tangy Afghan-style mixed pickle, made the traditional way.',
    long:
      'Torshi is the sharp, tangy pickle that brightens Afghan meals — spooned next to rice, kabob, and stews. Packed in 32 oz jars.',
    img: 'afghan-torshi',
    alt: 'Jar of Dehat Afghan torshi mixed pickle, 32 ounces',
    serving: 'Serve alongside rice dishes, kabob, and hearty stews.',
  },
  {
    slug: 'afghan-chatni-green',
    name: 'Afghan Chatni — Green',
    category: 'savory',
    size: '16 fl oz jar',
    caseInfo: '24 jars per case',
    short: 'Fresh, zesty green chatni — the classic Afghan table sauce.',
    long:
      'Green chatni is the fresh, zesty sauce found on nearly every Afghan table — bright, herby, and made to wake up rice, kabob, bolani, and more. Packed in 16 fl oz jars.',
    img: 'afghan-chatni-green',
    alt: 'Jar of Dehat green Afghan chatni sauce, 16 fluid ounces',
    serving: 'Spoon over kabob, bolani, rice, or anything that needs brightness.',
  },
  {
    slug: 'afghan-chatni-red',
    name: 'Afghan Chatni — Red',
    category: 'savory',
    size: '16 fl oz jar',
    caseInfo: '24 jars per case',
    short: 'Rich, warming red chatni with a gentle kick.',
    long:
      'The bolder sibling of our green chatni: rich, warming, and made for those who like a gentle kick with their kabob and rice. Packed in 16 fl oz jars.',
    img: 'afghan-chatni-red',
    alt: 'Jar of Dehat red Afghan chatni sauce, 16 fluid ounces',
    serving: 'Pairs well with grilled meats, rice, and fried snacks.',
  },
  {
    slug: 'masali-deg',
    name: 'Masali Deg',
    category: 'savory',
    size: '12 oz',
    caseInfo: '24 per case',
    short: 'A traditional Afghan spice preparation for the family pot.',
    long:
      'Masali Deg is a traditional Afghan spice preparation, blended for the big family pot. Packed in 12 oz containers. Ask us about ingredients and how our partner stores use it.',
    img: 'masali-deg',
    alt: 'Container of Dehat masali deg Afghan spice preparation, 12 ounces',
  },
  {
    slug: 'masala-dar-pepper',
    name: 'Masala Dar Pepper',
    category: 'savory',
    size: '12 oz',
    caseInfo: '24 per case',
    short: 'Seasoned pepper blend for everyday Afghan cooking.',
    long:
      'A seasoned pepper blend for everyday cooking — the kind of jar that stays within arm’s reach of the stove. Packed in 12 oz containers. Ask us about ingredients.',
    img: 'masala-dar-pepper',
    alt: 'Container of Dehat masala dar seasoned pepper blend, 12 ounces',
  },
];

export const featuredProducts = products.filter((p) => p.featured);
export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const CONTACT = {
  phones: ['916-893-8020', '916-846-6682'],
  phoneHrefs: ['tel:+19168938020', 'tel:+19168466682'],
  whatsapp: 'https://wa.me/19168938020',
  email: 'info@dehatsweets.com',
  site: 'https://www.dehatsweets.com',
  catalogPdf: '/catalog/Dehat-Sweets-Product-Catalog.pdf',
};

export const whatsappOrderLink = (productName?: string) => {
  const text = productName
    ? `Hello Dehat Sweets, I would like to order: ${productName}`
    : 'Hello Dehat Sweets, I would like to place an order.';
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
};

export const mailOrderLink = (productName?: string) => {
  const subject = productName ? `Order inquiry: ${productName}` : 'Order inquiry';
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;
};
