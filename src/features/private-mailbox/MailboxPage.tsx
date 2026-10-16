import { copy } from "../../content/zh-TW";
import { OpenMailboxIllustration } from "../../components/StoryScene";
export function MailboxPage() {
  return (
    <section className="page-content mailbox-story">
      <div className="page-narrative">
        <p className="eyebrow">{copy.mailbox.eyebrow}</p>
        <h1>{copy.mailbox.title}</h1>
        <p className="intro">{copy.mailbox.description}</p>
        <p className="availability-note">{copy.mailbox.availability}</p>
        <p className="quiet-note">{copy.mailbox.previewNote}</p>
      </div>
      <div className="mailbox-vignette">
        <OpenMailboxIllustration />
        <p className="vignette-caption">{copy.mailbox.previewTitle}</p>
      </div>
      <p className="privacy-note">{copy.mailbox.localPrivacy}</p>
    </section>
  );
}
