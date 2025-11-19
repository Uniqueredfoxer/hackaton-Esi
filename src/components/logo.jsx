
const Logo = ({ size = 48, withText = true, className = "", title = "logo" }) => {
  const svgSize = size;

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={title}
      role="img"
    >
      {/* Icon: mortarboard above an open-book cube */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Mortarboard (diamond rotated) */}
        <g transform="translate(32,12)">
          <polygon points="0,-8 12,0 0,8 -12,0" transform="rotate(0)" fill="#ddd" />
          {/* little band */}
          <rect x="-10" y="9" width="20" height="4" rx="1" fill="#ddd" />
        </g>

        {/* Open book / cube below */}
        <g transform="translate(8,26)">
          {/* left page face */}
          <path d="M0 4 L20 0 L20 24 L0 20 Z" fill="#ddd" />
          {/* right page face */}
          <path d="M44 4 L24 0 L24 24 L44 20 Z" fill="#ddd" />
          {/* center spine (a gap) */}
          <rect x="20" y="2" width="4" height="20" fill="#aaa" />
          {/* open page highlights (cutouts) */}
          <path d="M6 8 L22 6 L22 18 L6 20 Z" fill="#000" opacity="0.06" />
          <path d="M38 8 L22 6 L22 18 L38 20 Z" fill="#000" opacity="0.06" />
        </g>

        {/* small outer padding square for solidity */}
        <rect x="0" y="0" width="0" height="0" fill="000" />
      </svg>

      {withText && (
        <span
          style={{ fontFeatureSettings: '"tnum" 1' }}
          className="font-sans font-semibold tracking-tight text-white text-[18px]"
        >
          AKA
        </span>
      )}
    </div>
  );
};

export default Logo;
