import {
  HandDrawnStar,
  PaperSurface,
  PencilDivider,
} from "../../components/HandDrawn";
import { PhysicalLink } from "../../components/PhysicalLink";
import { PostOffice } from "../../components/PostOffice";
import { copy } from "../../content/zh-TW";
export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true">
              <PencilDivider compact />
            </span>
            {copy.home.eyebrow}
          </p>
          <h1>{copy.home.title}</h1>
          <p className="home-description">{copy.home.description}</p>
          <p className="hero-subtitle">{copy.home.supportingText}</p>
          <PhysicalLink
            className="primary-button"
            to="/write"
            feedback="envelope"
            idlePeriod={3.7}
          >
            <PaperSurface />
            <span>{copy.home.startWriting}</span>
            <span aria-hidden="true">→</span>
          </PhysicalLink>
          <p className="hero-footnote">{copy.home.footnote}</p>
        </div>
        <PostOffice />
      </section>
      <section className="home-bottom" aria-label={copy.home.aboutLabel}>
        <PencilDivider />
        <p>
          <span className="small-star" aria-hidden="true">
            <HandDrawnStar />
          </span>
          {copy.home.closing}
        </p>
        <span>{copy.home.closingNote}</span>
      </section>
    </>
  );
}
