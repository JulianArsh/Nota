// NotaLogo — Musical wordmark with an eighth note replacing the dot in "i"
// or integrated into the N letterform. Used in Navbar + Landing page.
export default function NotaLogo({ size = 'md', light = false }) {
  const textColor = light ? '#FFF8F0' : '#4B2E2B';
  const accentColor = '#C08552';
  const logoSizes = {
    sm: { box: 28, font: 18, noteScale: 0.7 },
    md: { box: 36, font: 24, noteScale: 1 },
    lg: { box: 56, font: 38, noteScale: 1.55 },
    xl: { box: 80, font: 56, noteScale: 2.2 },
  };
  const { box, font, noteScale } = logoSizes[size] || logoSizes.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none' }}>
      {/* Icon mark: stylised stave + note */}
      <svg
        width={box}
        height={box}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rounded square background */}
        <rect width="40" height="40" rx="9" fill="#4B2E2B" />

        {/* Three mini stave lines */}
        <line x1="7" y1="16" x2="33" y2="16" stroke="rgba(255,248,240,0.3)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="7" y1="21" x2="33" y2="21" stroke="rgba(255,248,240,0.3)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="7" y1="26" x2="33" y2="26" stroke="rgba(255,248,240,0.3)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Eighth note — stem */}
        <line x1="24" y1="12" x2="24" y2="26" stroke="#C08552" strokeWidth="2" strokeLinecap="round" />
        {/* Eighth note — flag */}
        <path d="M24 12 Q32 15 28 20" stroke="#C08552" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Eighth note — filled head */}
        <ellipse cx="21.5" cy="26" rx="4" ry="2.8" fill="#FFF8F0" transform="rotate(-15 21.5 26)" />

        {/* Small treble-style flourish dot */}
        <circle cx="29" cy="27" r="1.5" fill="#C08552" />
      </svg>

      {/* Wordmark */}
      <span style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: font,
        fontWeight: 800,
        color: textColor,
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}>
        nota
      </span>
    </div>
  );
}
