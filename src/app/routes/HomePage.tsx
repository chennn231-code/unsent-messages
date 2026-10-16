import {
  EnvelopeMark,
  MailboxMark,
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
            idle
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
      <section className="post-office-paths" aria-label={copy.home.routeLabel}>
        <div className="route-section-heading">
          <p>{copy.home.closing}</p>
          <span>{copy.home.closingNote}</span>
        </div>
        <div className="post-paths">
          {copy.home.routes.map((route, index) => (
            <PhysicalLink
              to={route.to}
              key={route.to}
              className={`place-entry place-entry-${route.icon}`}
              idlePeriod={3.2 + index * 0.3}
              aria-label={`${route.title}，${route.state}`}
            >
              <span className="route-icon" aria-hidden="true">
                {route.icon === "letter" ? (
                  <EnvelopeMark />
                ) : route.icon === "mailbox" ? (
                  <MailboxMark />
                ) : (
                  <HandDrawnStar />
                )}
              </span>
              <span className="place-copy">
                <span className="route-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="route-title">{route.title}</span>
                <span className="route-description">{route.description}</span>
                <span className="route-state">{route.state}</span>
              </span>
              <span className="route-arrow" aria-hidden="true">
                ↗
              </span>
            </PhysicalLink>
          ))}
        </div>
      </section>
    </>
  );
}
