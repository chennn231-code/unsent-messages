import postOffice from "../assets/post-office-pastel-v2.webp";
import { Ground } from "./StoryScene";
import { copy } from "../content/zh-TW";
import { PhysicalLink } from "./PhysicalLink";
export function PostOffice() {
  return (
    <figure className="pastel-post-office">
      <Ground />
      <PhysicalLink
        className="post-office-entry"
        to="/write"
        aria-label={copy.home.illustrationAction}
        idlePeriod={3.9}
      >
        <img
          src={postOffice}
          alt={copy.home.illustrationAlt}
          width={1536}
          height={1024}
          decoding="async"
          fetchPriority="high"
        />
        <span className="post-office-entry-label">
          {copy.home.illustrationAction}
          <span aria-hidden="true"> →</span>
        </span>
      </PhysicalLink>
      <figcaption>{copy.home.illustrationCaption}</figcaption>
    </figure>
  );
}
