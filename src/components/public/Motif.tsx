/**
 * Subtle Afghan-inspired geometric divider (eight-pointed star lattice).
 * Used sparingly as a section separator. Decorative only (aria-hidden).
 */
export default function Motif({ className = 'text-saffron/50' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="block h-px w-16 sm:w-28 bg-current opacity-40" />
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 1l3.1 5.6L21.5 4.5l-2.1 5.4L25 13l-5.6 3.1 2.1 5.4-5.4-2.1L13 25l-3.1-5.6-5.4 2.1 2.1-5.4L1 13l5.6-3.1L4.5 4.5l5.4 2.1L13 1z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="13" r="2.4" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span className="block h-px w-16 sm:w-28 bg-current opacity-40" />
    </div>
  );
}
