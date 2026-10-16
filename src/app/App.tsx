import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
import "../styles/pastel-home.css";
import {
  EnvelopeMark,
  PaperSurface,
  PencilDivider,
} from "../components/HandDrawn";
import { HomePage } from "./routes/HomePage";
import { WritePage } from "../features/editor/WritePage";
import { MailboxPage } from "../features/private-mailbox/MailboxPage";
import { SkyPage } from "../features/public-sky/SkyPage";
import { copy } from "../content/zh-TW";
import { PhysicalLink, PhysicalNavLink } from "../components/PhysicalLink";
import "../styles/interaction.css";
export function App() {
  const { pathname } = useLocation();
  const isPastelHome = pathname === "/";
  const previous = useRef(pathname);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    if (previous.current !== pathname) {
      main.current?.focus();
      window.scrollTo(0, 0);
      previous.current = pathname;
    }
  }, [pathname]);
  return (
    <div className={`app-shell${pathname === "/" ? " pastel-home" : ""}`}>
      <a className="skip-link" href="#main">
        {copy.navigation.skipToMain}
      </a>
      <header className="site-header">
        <PhysicalLink
          className="brand"
          to="/"
          aria-label={copy.brand.homeLabel}
          idlePeriod={3.4}
        >
          <span className="brand-stamp" aria-hidden="true">
            {isPastelHome ? (
              <>
                <PaperSurface stamp />
                <EnvelopeMark />
              </>
            ) : (
              <EnvelopeMark />
            )}
          </span>
          <span>
            {copy.brand.name}
            <small>{copy.brand.englishName}</small>
          </span>
        </PhysicalLink>
        <nav
          aria-label={copy.navigation.label}
          className="flex flex-wrap items-center"
        >
          <PhysicalNavLink to="/" end idlePeriod={3.1}>
            {copy.navigation.home}
          </PhysicalNavLink>
          <PhysicalNavLink to="/write" idlePeriod={3.5}>
            {copy.navigation.write}
          </PhysicalNavLink>
          <PhysicalNavLink to="/mailbox" idlePeriod={3.8}>
            {copy.navigation.mailbox}
          </PhysicalNavLink>
          <PhysicalNavLink to="/sky" idlePeriod={4}>
            {copy.navigation.sky}
          </PhysicalNavLink>
        </nav>
        {isPastelHome && <PencilDivider />}
      </header>
      <main id="main" tabIndex={-1} ref={main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/mailbox" element={<MailboxPage />} />
          <Route path="/sky" element={<SkyPage />} />
          <Route
            path="*"
            element={
              <section className="page-content">
                <p className="eyebrow">{copy.notFound.eyebrow}</p>
                <h1>{copy.notFound.title}</h1>
                <p className="intro">{copy.notFound.description}</p>
                <PhysicalLink className="primary-button" to="/">
                  {copy.notFound.goHome}
                </PhysicalLink>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        {isPastelHome && <PencilDivider />}
        <span>{copy.footer.message}</span>
        <span>
          {copy.footer.place} <i aria-hidden="true">·</i> {copy.footer.version}
        </span>
      </footer>
    </div>
  );
}
