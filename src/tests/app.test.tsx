import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { App } from "../app/App";
describe("路由與基礎導覽（jsdom）", () => {
  it.each([
    ["/", "不敢傳出去的訊息"],
    ["/write", "寫下來吧"],
    ["/mailbox", "私人信箱"],
    ["/sky", "星空信箱"],
    ["/missing", "這裡好像沒有這封信"],
  ])("可直接呈現 %s", (route, title) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  });
  it("導覽後聚焦主內容，未開放頁面不假裝已讀取信件", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "私人信箱" }));
    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByText("信件清單還沒開放")).toBeVisible();
    expect(
      screen.queryByText("這裡還挺安靜的，像剛搬進來的房子。"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "私人信箱" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("開始寫信立即導航，保持編輯器預覽狀態", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "開始寫信" }));
    expect(screen.getByRole("heading", { name: "寫下來吧" })).toBeVisible();
    expect(screen.getByText("寫信和儲存功能還沒開放")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});

// Illustrated navigation exposes only existing previews, never fake letter states.
it("首頁入口保留可讀操作名稱與真實預覽路由", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(
    document.querySelectorAll('[data-idle="true"]').length,
  ).toBeGreaterThan(1);
  expect(screen.getByRole("link", { name: "開始寫信" })).toHaveAttribute(
    "data-idle",
    "true",
  );
  expect(
    screen.getByRole("link", { name: "私人信箱，尚未開放" }),
  ).toHaveAttribute("href", "/mailbox");
  expect(
    screen.getByRole("link", { name: "星空信箱，尚未開放" }),
  ).toHaveAttribute("href", "/sky");
});
