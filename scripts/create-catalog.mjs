import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsPDF } from 'jspdf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const outputDir = path.join(root, 'catalog');
const outputFile = path.join(outputDir, 'Dehat-Sweets-Product-Catalog.pdf');

fs.mkdirSync(outputDir, { recursive: true });

const page = {
  width: 11,
  height: 8.5,
};

const gold = [212, 160, 28];
const softGold = [237, 197, 83];
const white = [246, 241, 229];
const black = [0, 0, 0];

const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'in',
  format: [page.width, page.height],
  compress: true,
});

const dataUrl = (filename) => {
  const fullPath = path.join(publicDir, filename);
  const ext = path.extname(filename).slice(1).toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
};

const addBackground = () => {
  doc.setFillColor(...black);
  doc.rect(0, 0, page.width, page.height, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.025);
  doc.roundedRect(0.12, 0.12, page.width - 0.24, page.height - 0.24, 0.08, 0.08);
};

const addImageFit = (filename, x = 0, y = 0, w = page.width, h = page.height) => {
  const img = dataUrl(filename);
  const props = doc.getImageProperties(img);
  const imageRatio = props.width / props.height;
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;
  let drawX = x;
  let drawY = y;

  if (imageRatio > boxRatio) {
    drawW = w;
    drawH = w / imageRatio;
    drawY = y + (h - drawH) / 2;
  } else {
    drawH = h;
    drawW = h * imageRatio;
    drawX = x + (w - drawW) / 2;
  }

  doc.addImage(img, props.fileType, drawX, drawY, drawW, drawH, undefined, 'FAST');
};

const addFullImagePage = (filename, title) => {
  addBackground();
  addImageFit(filename, 0.18, 0.18, page.width - 0.36, page.height - 0.36);
  if (title) {
    doc.setFillColor(0, 0, 0, 0.72);
    doc.rect(0.18, 7.58, page.width - 0.36, 0.55, 'F');
    doc.setTextColor(...softGold);
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.text(title, page.width / 2, 7.94, { align: 'center' });
  }
};

const addCover = () => {
  addBackground();
  addImageFit('more-than-food.png', 0.15, 0.15, page.width - 0.3, page.height - 0.3);
  doc.setFillColor(0, 0, 0, 0.58);
  doc.rect(0.15, 0.15, page.width - 0.3, page.height - 0.3, 'F');

  doc.addImage(dataUrl('dehat-logo.png'), 'PNG', 4.83, 0.55, 1.35, 1.35);
  doc.setTextColor(...softGold);
  doc.setFont('times', 'bold');
  doc.setFontSize(48);
  doc.text('Dehat Sweets & Food', page.width / 2, 3.05, { align: 'center' });
  doc.setFontSize(30);
  doc.text('Product Catalog', page.width / 2, 3.82, { align: 'center' });
  doc.setDrawColor(...gold);
  doc.line(3.2, 4.15, 7.8, 4.15);

  doc.setFont('times', 'italic');
  doc.setFontSize(20);
  doc.setTextColor(...white);
  doc.text('Wholesale Afghan sweets, bakery items, and savory products', page.width / 2, 4.72, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...softGold);
  doc.text('Fresh batches | Case-packed products | Local delivery', page.width / 2, 7.45, { align: 'center' });
};

const addSectionPage = (title, subtitle) => {
  addBackground();
  doc.addImage(dataUrl('dehat-logo.png'), 'PNG', 4.95, 0.75, 1.1, 1.1);
  doc.setFont('times', 'bold');
  doc.setTextColor(...softGold);
  doc.setFontSize(54);
  doc.text(title, page.width / 2, 3.55, { align: 'center' });
  doc.setDrawColor(...gold);
  doc.line(3.2, 3.95, 7.8, 3.95);
  doc.setFont('times', 'italic');
  doc.setFontSize(22);
  doc.setTextColor(...white);
  doc.text(subtitle, page.width / 2, 4.65, { align: 'center', maxWidth: 8 });
};

const addContactPage = () => {
  addBackground();
  doc.addImage(dataUrl('dehat-logo.png'), 'PNG', 4.9, 0.45, 1.2, 1.2);

  doc.setTextColor(...softGold);
  doc.setFont('times', 'bold');
  doc.setFontSize(54);
  doc.text('Place Your Order', page.width / 2, 2.65, { align: 'center' });
  doc.setDrawColor(...gold);
  doc.line(3.05, 3.05, 7.95, 3.05);

  const columns = [
    ['Phone', '916-893-8020', '916-846-6682'],
    ['WhatsApp', '916-893-8020', '916-846-6682'],
    ['Email', 'info@dehatsweets.com'],
    ['Website', 'www.dehatsweets.com'],
  ];

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  columns.forEach((col, index) => {
    const x = 1.35 + index * 2.75;
    doc.setTextColor(...softGold);
    doc.text(col[0], x, 4.15, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setTextColor(...white);
    doc.setFontSize(15);
    col.slice(1).forEach((line, lineIndex) => {
      doc.text(line, x, 4.52 + lineIndex * 0.28, { align: 'center' });
    });
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    if (index < columns.length - 1) {
      doc.setDrawColor(...gold);
      doc.line(x + 1.35, 3.68, x + 1.35, 4.96);
    }
  });

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.02);
  doc.roundedRect(1.15, 5.45, 8.7, 1.05, 0.16, 0.16);
  const promises = [
    ['Fast', 'Response'],
    ['Reliable', 'Delivery'],
    ['Flexible', 'Ordering'],
  ];
  promises.forEach((item, index) => {
    const x = 2.45 + index * 3.05;
    doc.setTextColor(...softGold);
    doc.setFont('times', 'italic');
    doc.setFontSize(18);
    doc.text(item[0], x, 5.95, { align: 'center' });
    doc.setTextColor(...white);
    doc.text(item[1], x, 6.25, { align: 'center' });
    if (index < promises.length - 1) {
      doc.setDrawColor(...gold);
      doc.line(x + 1.5, 5.6, x + 1.5, 6.34);
    }
  });

  doc.setFont('times', 'italic');
  doc.setTextColor(...softGold);
  doc.setFontSize(30);
  doc.text('Contact us for pricing & wholesale deals', page.width / 2, 7.45, { align: 'center' });
};

addCover();
doc.addPage();
addFullImagePage('about-dehat.png', 'About Dehat');
doc.addPage();
addFullImagePage('why-dehat.png', 'Why Stores Choose Dehat');
doc.addPage();
addSectionPage('Bakery Products', 'Fresh, traditional Afghan bakery items packed for wholesale partners.');

[
  ['cream-rolls.png', 'Cream Rolls | 9 roll box | 24 roll case'],
  ['root.png', 'Root | 1.5 lb each | 12 per case'],
  ['malida.png', 'Afghan Malida | 1.5 lb each | 12 per case'],
  ['khajoor.png', 'Khajoor | 1.5 lb each | 24 per case'],
].forEach(([filename, title]) => {
  doc.addPage();
  addFullImagePage(filename, title);
});

doc.addPage();
addFullImagePage('savory-products.png', 'Savory Products');

[
  ['afghan-torshi.png', 'Afghan Torshi | 32oz | Case: 24'],
  ['afghan-chatni-green.png', 'Afghan Chatni Green | 16 fl oz | Case: 24'],
  ['afghan-chatni-red.png', 'Afghan Chatni Red | 16 fl oz | Case: 24'],
  ['masali-deg.png', 'Masali Deg | 12oz | Case: 24'],
  ['masala-dar-pepper.png', 'Masala Dar Pepper | 12oz | Case: 24'],
].forEach(([filename, title]) => {
  doc.addPage();
  addFullImagePage(filename, title);
});

doc.addPage();
addContactPage();

doc.save(outputFile);
console.log(outputFile);
