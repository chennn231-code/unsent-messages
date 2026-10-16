import { useId } from "react";
import { HandDrawnStar } from "./HandDrawn";
const stars = [
  { left: "3%", top: "13%", size: ".65rem", opacity: 0.45 },
  { left: "93%", top: "7%", size: "1.05rem", opacity: 0.8 },
  { left: "45%", top: "4%", size: ".5rem", opacity: 0.45 },
  { left: "89%", top: "52%", size: ".6rem", opacity: 0.4 },
  { left: "5%", top: "73%", size: ".9rem", opacity: 0.6 },
  { left: "64%", top: "13%", size: ".55rem", opacity: 0.5 },
  { left: "74%", top: "61%", size: ".75rem", opacity: 0.7 },
];
export function StoryAtmosphere({ home = false }: { home?: boolean }) {
  return (
    <div className="story-atmosphere" aria-hidden="true">
      {stars.slice(0, home ? 5 : 7).map((s, i) => (
        <span
          className="night-star"
          key={i}
          style={{
            left: s.left,
            top: home ? s.top : `${parseFloat(s.top) * 0.8}%`,
            width: s.size,
            opacity: s.opacity,
            rotate: `${i % 2 ? 13 : -11}deg`,
          }}
        >
          <HandDrawnStar />
        </span>
      ))}
    </div>
  );
}
export function Ground() {
  const id = `ground-${useId().replaceAll(":", "")}`;
  return (
    <svg
      className="story-ground"
      viewBox="0 0 1000 180"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={id} x="-3%" y="-10%" width="106%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            seed="7"
            result="grain"
          />
          <feColorMatrix in="grain" type="saturate" values="0" />
          <feComponentTransfer result="soft">
            <feFuncR type="linear" slope=".2" intercept=".8" />
            <feFuncG type="linear" slope=".2" intercept=".8" />
            <feFuncB type="linear" slope=".2" intercept=".8" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <path
          fill="var(--color-ground)"
          opacity=".8"
          d="M25 108 C80 82 145 100 205 73 C298 61 365 78 452 67 C540 59 609 82 687 72 C773 62 845 78 962 108 C926 143 847 151 754 157 C633 170 538 158 430 166 C321 174 226 149 142 151 C86 145 58 132 25 108 Z"
        />
        <path
          fill="var(--color-wood)"
          opacity=".1"
          d="M87 111 C193 93 248 111 358 95 C473 84 595 109 715 94 C803 89 868 103 916 114 C808 113 715 130 607 119 C497 112 402 126 309 121 C221 115 157 122 87 111 Z"
        />
      </g>
    </svg>
  );
}
export function OpenMailboxIllustration() {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className="open-mailbox-illustration"
      viewBox="0 0 360 300"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={`mail-grain-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            seed="9"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer result="soft">
            <feFuncR type="linear" slope=".15" intercept=".85" />
            <feFuncG type="linear" slope=".15" intercept=".85" />
            <feFuncB type="linear" slope=".15" intercept=".85" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g
        filter={`url(#mail-grain-${id})`}
        stroke="var(--color-pencil)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          fill="var(--color-ground)"
          stroke="none"
          opacity=".7"
          d="M45 268 C108 246 227 250 308 272 C227 290 108 289 45 268 Z"
        />
        <path
          fill="var(--color-wood)"
          strokeWidth="2"
          d="M163 204 C170 205 180 202 187 204 C185 226 189 249 186 274 C178 276 170 273 162 274 C166 247 161 223 163 204 Z"
        />
        <path
          fill="var(--color-wood)"
          strokeWidth="2"
          d="M83 112 C92 68 144 61 185 78 C212 93 211 126 208 155 C210 174 206 195 207 209 C171 215 126 210 85 214 C81 184 85 145 83 112 Z"
        />
        <path
          fill="var(--bg-deep)"
          strokeWidth="2"
          d="M105 117 C109 93 145 86 168 98 C188 110 185 136 186 161 C184 177 189 184 185 192 C157 195 135 192 107 194 C102 175 108 145 105 117 Z"
        />
        <path
          fill="var(--color-wood)"
          strokeWidth="2"
          d="M108 193 C133 193 162 196 186 192 C208 205 225 227 238 242 C204 248 166 240 138 244 C127 224 115 210 108 193 Z"
        />
        <path
          fill="none"
          strokeWidth="1.4"
          strokeDasharray="11 1.5 5 1"
          d="M139 211 C155 211 170 213 185 211 M149 224 C166 225 185 222 205 228"
        />
        <path
          fill="var(--color-lamp)"
          stroke="none"
          opacity=".6"
          d="M240 124 C248 121 252 127 248 132 C242 135 236 129 240 124 Z M269 105 C274 103 277 108 274 111 C269 112 266 108 269 105 Z M253 149 C257 147 260 151 258 155 C253 157 251 152 253 149 Z"
        />
      </g>
    </svg>
  );
}
export function RoofSilhouette() {
  return (
    <svg
      className="roof-silhouette"
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="var(--bg-deep)"
        d="M0 200 C141 197 170 200 252 199 C255 170 252 144 255 124 C242 126 239 123 244 117 C292 88 334 42 383 16 C434 46 474 83 521 112 C535 117 535 122 522 124 C527 151 523 178 525 199 C639 198 709 201 800 200 Z"
      />
      <path
        fill="var(--color-lamp)"
        opacity=".25"
        d="M365 112 C375 110 390 113 401 110 C402 125 400 137 402 151 C389 151 376 150 365 152 C363 137 367 125 365 112 Z"
      />
    </svg>
  );
}
