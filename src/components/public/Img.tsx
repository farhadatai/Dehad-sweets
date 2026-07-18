interface ImgProps {
  base: string; // base name in /public/img → {base}-400.webp / -800.webp / -lg.webp
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
  widths?: number[]; // available numeric widths (default 400, 800)
  lgWidth?: number;  // approximate intrinsic width of the -lg file
  width?: number;
  height?: number;
}

/** Responsive WebP image with lazy-loading by default. */
export default function Img({
  base,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  eager = false,
  widths = [400, 800],
  lgWidth = 1400,
  width,
  height,
}: ImgProps) {
  const entries = widths.map((w) => `/img/${base}-${w}.webp ${w}w`);
  entries.push(`/img/${base}-lg.webp ${lgWidth}w`);
  return (
    <img
      src={`/img/${base}-800.webp`}
      srcSet={entries.join(', ')}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      width={width}
      height={height}
    />
  );
}
