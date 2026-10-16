import { useId } from "react";

/** Fixed paths keep the hand-drawn marks stable across renders and route changes. */
export function PaperSurface({ stamp = false }: { stamp?: boolean }) {
  const id = useId().replaceAll(":", "");
  const grain = `paper-grain-${id}`;
  const pigment = `paper-pigment-${id}`;
  const outline = stamp
    ? "M12 5 C24 3 40 5 51 4 C59 5 60 13 59 24 C60 36 58 46 59 52 C57 60 45 59 35 60 C22 58 14 61 7 56 C3 48 6 37 4 25 C3 14 5 7 12 5 Z"
    : "M25 5 C72 3 147 7 206 4 C225 3 236 12 235 27 C234 38 238 48 229 58 C220 67 207 65 190 67 C139 65 78 69 27 66 C10 67 4 57 5 43 C3 30 4 15 14 9 C17 7 20 6 25 5 Z";
  // Filled ribbons vary in thickness; the second pencil pass has tiny gaps.
  const ribbon = stamp
    ? "M12 5 C24 3 40 5 51 4 C59 5 60 13 59 24 C60 36 58 46 59 52 C57 60 45 59 35 60 C22 58 14 61 7 56 C3 48 6 37 4 25 C3 14 5 7 12 5 Z M12 6 C24 5 40 6 51 6 C57 6 58 14 57 24 C59 36 57 46 57 52 C56 58 45 58 35 58 C22 57 14 59 9 55 C5 48 7 37 6 25 C5 15 6 8 12 6 Z"
    : "M25 5 C72 3 147 7 206 4 C225 3 236 12 235 27 C234 38 238 48 229 58 C220 67 207 65 190 67 C139 65 78 69 27 66 C10 67 4 57 5 43 C3 30 4 15 14 9 C17 7 20 6 25 5 Z M25 7 C72 5 147 9 206 6 C223 5 234 13 233 27 C232 38 236 48 227 57 C219 65 207 63 190 65 C139 63 78 67 27 64 C12 65 6 56 7 43 C5 30 6 16 15 11 C18 9 21 8 25 7 Z";
  return (
    <svg
      className={`paper-surface${stamp ? " paper-surface-stamp" : ""}`}
      viewBox={stamp ? "0 0 64 64" : "0 0 240 72"}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={pigment} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-paper)" stopOpacity=".97" />
          <stop offset="48%" stopColor="var(--color-paper)" stopOpacity="1" />
          <stop
            offset="100%"
            stopColor="var(--color-paper-shade)"
            stopOpacity=".96"
          />
        </linearGradient>
        <filter
          id={grain}
          x="-5%"
          y="-10%"
          width="110%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            stitchTiles="stitch"
            seed="17"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="softGrain">
            <feFuncR type="linear" slope=".18" intercept=".82" />
            <feFuncG type="linear" slope=".18" intercept=".82" />
            <feFuncB type="linear" slope=".18" intercept=".82" />
          </feComponentTransfer>
          <feBlend
            in="SourceGraphic"
            in2="softGrain"
            mode="multiply"
            result="pigmented"
          />
          <feComposite in="pigmented" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${grain})`}>
        <path
          d={outline}
          fill={stamp ? "var(--color-wood)" : `url(#${pigment})`}
          fillOpacity={stamp ? ".12" : "1"}
        />
        <path
          d={ribbon}
          fill="var(--color-pencil)"
          fillRule="evenodd"
          opacity={stamp ? ".72" : ".55"}
        />
        <path
          d={outline}
          fill="none"
          stroke="var(--color-pencil)"
          strokeWidth=".6"
          strokeDasharray="13 .7 8 1.1 19 .6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".48"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

export function PencilDivider({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className="pencil-divider"
      viewBox={compact ? "0 0 64 10" : "0 0 900 10"}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        opacity=".3"
        d={
          compact
            ? "M2 5 C13 2 24 7 34 4 C44 2 53 6 62 4 C53 7 44 4 34 6 C24 8 13 4 2 6 Z"
            : "M2 5 C73 2 149 7 232 4 C309 2 387 6 471 4 C553 2 630 6 710 4 C784 2 837 6 898 4 C837 7 784 4 710 5 C630 8 553 4 471 6 C387 8 309 4 232 6 C149 8 73 4 2 6 Z"
        }
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth=".65"
        strokeDasharray="17 .8 11 1.3 23 .6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity=".25"
        d={
          compact
            ? "M3 7 C15 4 24 8 34 6 C45 4 53 8 61 6"
            : "M8 7 C97 4 181 8 271 6 C369 3 447 7 539 5 C634 3 729 8 817 5 C849 4 870 6 891 5"
        }
      />
    </svg>
  );
}

export function EnvelopeMark() {
  return (
    <svg
      className="envelope-mark"
      viewBox="0 0 36 28"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          strokeWidth="1.3"
          d="M5 5 C13 4 23 6 30 4 C33 7 30 16 31 23 C22 24 12 22 4 24 C3 16 5 10 5 5 Z"
        />
        <path
          strokeWidth="1.1"
          strokeDasharray="8 .5 13 .6"
          d="M5 6 C10 9 14 13 18 15 C23 12 27 9 30 6 M4 23 C9 19 12 17 15 14 M21 14 C25 17 28 20 31 23"
        />
      </g>
    </svg>
  );
}

export function HandDrawnStar() {
  return (
    <svg
      className="hand-drawn-star"
      viewBox="0 0 28 29"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        opacity=".9"
        d="M13 2 C15 5 15 8 17 10 C20 11 24 9 26 11 C24 14 21 15 20 17 C20 20 22 24 20 26 C17 24 15 21 12 21 C9 22 6 25 4 25 C4 21 7 17 6 15 C5 13 2 12 2 10 C6 9 8 11 10 9 C12 7 11 4 13 2 Z"
      />
      <path
        fill="var(--color-paper)"
        opacity=".32"
        d="M13 6 C15 9 13 12 16 13 C19 13 21 11 23 12 C20 14 17 14 16 16 C16 19 18 21 18 23 C15 20 13 18 11 19 C8 20 7 21 6 22 C8 18 9 15 7 13 C11 14 13 11 13 6 Z"
      />
    </svg>
  );
}
