import { copy } from "../../content/zh-TW";
import { HandDrawnStar } from "../../components/HandDrawn";
export function SkyPage() {
  return (
    <section className="page-content">
      <p className="eyebrow">{copy.sky.eyebrow}</p>
      <h1>{copy.sky.title}</h1>
      <p className="intro">{copy.sky.description}</p>
      <div className="empty-state">
        <span className="sky-mark" aria-hidden="true">
          <HandDrawnStar />
        </span>
        <h2>{copy.sky.previewTitle}</h2>
        <p>{copy.sky.availability}</p>
      </div>
    </section>
  );
}
