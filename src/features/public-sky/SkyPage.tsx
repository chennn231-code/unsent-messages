import { copy } from "../../content/zh-TW";
import { RoofSilhouette } from "../../components/StoryScene";
export function SkyPage() {
  return (
    <section className="page-content sky-story">
      <div className="page-narrative">
        <p className="eyebrow">{copy.sky.eyebrow}</p>
        <h1>{copy.sky.title}</h1>
        <p className="intro">{copy.sky.description}</p>
        <p className="availability-note">{copy.sky.previewTitle}</p>
        <p className="quiet-note">{copy.sky.availability}</p>
      </div>
      <RoofSilhouette />
    </section>
  );
}
