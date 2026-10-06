/**
 * Minimal 16px line icons for the overview cards and sidebar.
 *
 * Inline SVG rather than an icon package: there are seven shapes, and adding a
 * dependency for them would be the only new thing in the bundle.
 */
const PATHS: Record<string, string> = {
  summary:
    "M4 3.5h8M4 8h8M4 12.5h5M14 3.5v9M14 12.5v.5",
  strengths: "M3.5 8.5l3 3 6.5-7",
  gaps: "M8 5.5v4M8 12.2v.3M8 2.2L14.2 13.5H1.8z",
  limitations: "M8 7.2v4.3M8 4.3v.3M8 1.8a6.2 6.2 0 100 12.4A6.2 6.2 0 008 1.8z",
  evidence: "M4 3.5h5l1.5 2H12v8H4zM6 8.5h4M6 10.8h3",
  retrieval: "M2.5 5.5h11M2.5 8h7M2.5 10.5h11M11.5 7.4l1.6 1.6-1.6 1.6",
  plus: "M8 3.5v9M3.5 8h9",
  chevron: "M6 3.5L10.5 8 6 12.5",
  home: "M2.5 6.8L8 2.5l5.5 4.3V13H2.5z",
};

/** Uniform 16px stroke styling so the set reads as one family. */
function base() {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

interface IconProps {
  name: keyof typeof PATHS | string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size, className }: IconProps) {
  const d = PATHS[name];

  if (!d) {
    return null;
  }

  const attrs = base();

  return (
    <svg {...attrs} width={size ?? attrs.width} height={size ?? attrs.height} className={className}>
      <path d={d} />
    </svg>
  );
}