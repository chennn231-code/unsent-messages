import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app/App";
import "./styles/global.css";
import { copy } from "./content/zh-TW";
document.title = `${copy.brand.name}｜${copy.brand.englishName}`;
document
  .querySelector('meta[name="description"]')
  ?.setAttribute(
    "content",
    `${copy.home.description}${copy.home.supportingText}`,
  );
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
