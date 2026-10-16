import { copy } from "../../content/zh-TW";
export function WritePage() {
  return (
    <section className="page-content">
      <p className="eyebrow">{copy.editor.eyebrow}</p>
      <h1>{copy.editor.title}</h1>
      <p className="intro emotional-copy">{copy.editor.description}</p>
      <div className="letter-paper">
        <p>{copy.editor.placeholder}</p>
        <div className="paper-lines" aria-hidden="true" />
        <p className="paper-note">{copy.editor.previewNote}</p>
      </div>
      <p className="quiet-note">{copy.editor.availability}</p>
    </section>
  );
}
