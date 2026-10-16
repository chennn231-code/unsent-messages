// Explicit browser harness: not imported by the production app or Vitest.
import { IndexedDbLetterRepository } from "../repositories/IndexedDbLetterRepository";
const dbName = "unsent-messages-sprint01-browser-tests";
const repo = new IndexedDbLetterRepository("browser-test", dbName);
const result = document.querySelector<HTMLPreElement>("#result")!;
const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};
document.querySelector<HTMLButtonElement>("#run")!.onclick = async () => {
  result.textContent = "執行中…";
  try {
    const letter = await repo.createDraft({
      type: "unsent",
      owner: { kind: "local", localId: "browser-test" },
      content: "測試用文字：鬱、龘、𠮷。",
    });
    assert(
      (await repo.getById(letter.id))?.content === letter.content,
      "Create / Read failed",
    );
    const other = new IndexedDbLetterRepository("browser-test", dbName);
    const updates = await Promise.allSettled([
      repo.saveDraft(letter.id, "第一個修改", 1),
      other.saveDraft(letter.id, "第二個修改", 1),
    ]);
    assert(
      updates.filter((r) => r.status === "fulfilled").length === 1,
      "Atomic revision conflict failed",
    );
    const rejected = updates.find(
      (r) => r.status === "rejected",
    ) as PromiseRejectedResult;
    assert(
      rejected.reason.code === "REVISION_CONFLICT",
      "Wrong conflict error",
    );
    const updated = await repo.getById(letter.id);
    assert(updated?.revision === 2, "Revision failed");
    assert(
      (await repo.listLocal()).some((l) => l.id === letter.id),
      "List failed",
    );
    const saved = await repo.savePrivate(letter.id, 2);
    assert(
      saved.lifecycle === "private" && saved.revision === 3,
      "Private failed",
    );
    await repo.delete(letter.id, 3);
    assert((await repo.getById(letter.id)) === null, "Delete failed");
    const persistent = await repo.createDraft({
      type: "unsent",
      owner: { kind: "local", localId: "browser-test" },
      content: "重新整理驗證",
    });
    sessionStorage.setItem("sprint01-test-letter", persistent.id);
    result.textContent =
      "PASS: 真實 IndexedDB Create / Read / Update / List / Private / Delete / 多實例衝突。\n已建立持久化測試信件，請重新整理後驗證。";
  } catch (error) {
    result.textContent = `FAIL: ${String(error)}`;
  }
};
document.querySelector<HTMLButtonElement>("#persist")!.onclick = async () => {
  try {
    const id = sessionStorage.getItem("sprint01-test-letter");
    assert(Boolean(id), "請先執行測試");
    const l = await repo.getById(id!);
    assert(l?.content === "重新整理驗證", "Persistence failed");
    await repo.delete(id!);
    sessionStorage.removeItem("sprint01-test-letter");
    result.textContent =
      "PASS: 頁面重新整理後，真實 IndexedDB 信件仍可讀取。測試信件已清除。";
  } catch (error) {
    result.textContent = `FAIL: ${String(error)}`;
  }
};

// Reflow check using a real browser rendering at 200% root font size.
// This simulates text scaling, not device OS accessibility settings.
document.querySelector<HTMLButtonElement>("#zoom")!.onclick = async () => {
  const frame = document.querySelector<HTMLIFrameElement>("#zoom-frame")!;
  frame.hidden = false;
  const rows: string[] = [];
  try {
    for (const width of [320, 390, 412]) {
      frame.style.width = `${width}px`;
      for (const path of ["/", "/write", "/mailbox", "/sky", "/missing"]) {
        await new Promise<void>((resolve, reject) => {
          frame.onload = () => resolve();
          frame.onerror = () => reject(new Error("Frame failed"));
          frame.src = path;
        });
        const doc = frame.contentDocument!;
        await new Promise<void>((resolve) => {
          const check = () => {
            if (doc.querySelector("h1")) resolve();
            else setTimeout(check, 20);
          };
          check();
        });
        doc.documentElement.style.fontSize = "200%";
        await new Promise<void>((resolve) =>
          frame.contentWindow!.requestAnimationFrame(() =>
            frame.contentWindow!.requestAnimationFrame(() => resolve()),
          ),
        );
        const actualWidth = doc.documentElement.clientWidth;
        const scrollWidth = doc.documentElement.scrollWidth;
        assert(
          scrollWidth <= actualWidth,
          `Overflow: ${path} ${width}px (${scrollWidth} > ${actualWidth})`,
        );
        rows.push(`PASS: ${path} ${actualWidth}px，200% 字體，無水平溢出`);
      }
    }
    result.textContent = rows.join("\n");
  } catch (error) {
    result.textContent = rows.join("\n") + `\nFAIL: ${String(error)}`;
  }
};

// Browser-rendered feedback checks. Events and reduced-motion are simulated;
// this is not a claim of real phone vibration or native OS preference testing.
document.querySelector<HTMLButtonElement>("#motion")!.onclick = async () => {
  const frame = document.querySelector<HTMLIFrameElement>("#zoom-frame")!;
  const rows: string[] = [];
  frame.hidden = false;
  frame.style.width = "320px";
  result.textContent = "執行中";
  try {
    await new Promise<void>((resolve) => {
      frame.onload = () => resolve();
      frame.src = "/";
    });
    const doc = frame.contentDocument!;
    const win = frame.contentWindow!;
    await new Promise<void>((resolve, reject) => {
      const deadline = Date.now() + 5000;
      const check = () => {
        if (doc.querySelector(".primary-button")) resolve();
        else if (Date.now() > deadline) reject(new Error("App load timed out"));
        else setTimeout(check, 20);
      };
      check();
    });
    const link = doc.querySelector<HTMLAnchorElement>(".primary-button")!;
    const surface = link.querySelector<HTMLElement>(".tactile-surface")!;
    const pause = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const box = link.getBoundingClientRect();
    const pointer = (type: string) =>
      link.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerId: 12,
          pointerType: "touch",
          isPrimary: true,
          button: 0,
          clientX: box.x + box.width / 2,
          clientY: box.y + box.height / 2,
        }),
      );
    const nativeReduced = win.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!nativeReduced) {
      assert(
        win.getComputedStyle(surface).animationName === "physical-breathe",
        "Idle breathing missing",
      );
      pointer("pointerdown");
      await pause(120);
      assert(link.dataset.phase === "pressed", "Press state missing");
      const pressedBox = link.getBoundingClientRect();
      assert(
        Math.abs(pressedBox.width - box.width) < 1 &&
          Math.abs(pressedBox.height - box.height) < 1,
        "Link hit area must remain fixed while pressed",
      );
      assert(
        Number(win.getComputedStyle(surface).scale) <= 0.96,
        "Envelope sink missing",
      );
      pointer("pointerup");
      await pause(30);
      assert(
        win.getComputedStyle(surface).animationName === "physical-release",
        "Release missing",
      );
      assert(
        parseFloat(win.getComputedStyle(surface).animationDuration) <= 0.2,
        "Release exceeds 200ms",
      );
      await pause(240);
      assert(link.dataset.phase === "idle", "Release did not settle");
      rows.push("PASS: 真實 CSS 呼吸、下沉及 200ms 回彈（模擬觸控事件）");
    } else rows.push("SKIP: 系統已開啟減少動態，一般動畫不執行");
    // Reuse the shipped media-rule bodies; do not invent a separate test style.
    const mediaBodies: string[] = [];
    for (const sheet of Array.from(doc.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (
            rule.type === CSSRule.MEDIA_RULE &&
            (rule as CSSMediaRule).conditionText.includes(
              "prefers-reduced-motion",
            )
          )
            mediaBodies.push(
              Array.from((rule as CSSMediaRule).cssRules)
                .map((r) => r.cssText)
                .join("\n"),
            );
        }
      } catch {
        /* Cross-origin font CSS is unrelated to application motion. */
      }
    }
    assert(mediaBodies.length > 0, "Reduced-motion CSS missing");
    const style = doc.createElement("style");
    style.textContent = mediaBodies.join("\n");
    doc.head.append(style);
    const originalMedia = win.matchMedia.bind(win);
    win.matchMedia = (query) =>
      query.includes("prefers-reduced-motion")
        ? Object.create(originalMedia(query), { matches: { value: true } })
        : originalMedia(query);
    pointer("pointerdown");
    pointer("pointerup");
    await pause(30);
    const reduced = win.getComputedStyle(surface);
    assert(
      reduced.animationName === "none" && reduced.transitionDuration === "0s",
      "Reduced motion still animates",
    );
    assert(
      reduced.scale === "1" &&
        win.getComputedStyle(link).outlineStyle === "solid",
      "Static highlight missing",
    );
    rows.push("PASS: 正式減少動態 CSS + 模擬偏好：無動畫、無縮放、靜態高亮");
    link.click();
    await pause(50);
    assert(
      doc.querySelector("h1")?.textContent === "寫下來吧",
      "Reduced-motion navigation failed",
    );
    rows.push("PASS: 減少動態時仍立即進入寫信預覽");
    result.textContent = rows.join("\n");
  } catch (error) {
    result.textContent = rows.join("\n") + `\nFAIL: ${String(error)}`;
  }
};
