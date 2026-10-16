import { copy } from "../../content/zh-TW";
import { EnvelopeMark } from "../../components/HandDrawn";
export function MailboxPage() {
  return (
    <section className="page-content">
      <p className="eyebrow">{copy.mailbox.eyebrow}</p>
      <h1>{copy.mailbox.title}</h1>
      <p className="intro">{copy.mailbox.description}</p>
      <div className="empty-state">
        <span className="envelope-icon" aria-hidden="true">
          <EnvelopeMark />
        </span>
        <h2>{copy.mailbox.previewTitle}</h2>
        <p>{copy.mailbox.availability}</p>
        <p className="quiet-note">{copy.mailbox.previewNote}</p>
      </div>
      <p className="privacy-note">{copy.mailbox.localPrivacy}</p>
    </section>
  );
}
