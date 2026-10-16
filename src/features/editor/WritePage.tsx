import { copy } from "../../content/zh-TW";
export function WritePage() {
  return (
    <section className="page-content">
      <p className="eyebrow">{copy.editor.eyebrow}</p>
      <h1>{copy.editor.title}</h1>
      <p className="intro emotional-copy">{copy.editor.description}</p>
      <div className="writing-desk">
        <div className="letter-paper">
          <p>{copy.editor.placeholder}</p>
          <div className="paper-lines" aria-hidden="true" />
          <p className="paper-note">{copy.editor.previewNote}</p>
        </div>
        <svg
          className="desk-pencil"
          viewBox="0 0 28 240"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="var(--color-wood)"
            stroke="var(--color-pencil)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M8 9 C12 7 18 9 22 8 C23 70 20 138 22 199 C18 213 15 226 13 233 C10 222 8 210 6 199 C7 137 5 70 8 9 Z"
          />
          <path
            fill="none"
            stroke="var(--color-pencil)"
            strokeWidth="1"
            strokeDasharray="21 1.2 13 .8"
            d="M14 12 C13 75 15 132 13 197"
          />
          <path
            fill="var(--paper-text)"
            d="M10 223 C12 222 14 223 16 222 C15 228 14 232 13 235 C11 230 11 227 10 223 Z"
          />
        </svg>
      </div>
      <p className="quiet-note">{copy.editor.availability}</p>
    </section>
  );
}
