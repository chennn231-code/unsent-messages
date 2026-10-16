import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PhysicalLink } from "../components/PhysicalLink";
class TestPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;
  isPrimary: boolean;
  constructor(type: string, options: PointerEventInit = {}) {
    super(type, options);
    this.pointerId = options.pointerId ?? 1;
    this.pointerType = options.pointerType ?? "touch";
    this.isPrimary = options.isPrimary ?? true;
  }
}
const vibrate = vi.fn(() => true);
const renderLink = () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={<PhysicalLink to="/next">開始寫信</PhysicalLink>}
        />
        <Route path="/next" element={<h1>下一頁</h1>} />
      </Routes>
    </MemoryRouter>,
  );
  return screen.getByRole("link", { name: "開始寫信" });
};
beforeEach(() => {
  vibrate.mockClear();
  vi.stubGlobal("PointerEvent", TestPointerEvent);
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  vi.stubGlobal(
    "navigator",
    Object.create(navigator, {
      vibrate: { value: vibrate, configurable: true },
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());
describe("互動回饋不影響導覽", () => {
  it("觸控按下輕震一次，鬆手不重複，點選立即導航", () => {
    const link = renderLink();
    fireEvent.pointerDown(link);
    expect(vibrate).toHaveBeenCalledExactlyOnceWith(10);
    fireEvent.pointerUp(link);
    expect(vibrate).toHaveBeenCalledExactlyOnceWith(10);
    fireEvent.click(link);
    expect(screen.getByRole("heading", { name: "下一頁" })).toBeVisible();
  });
  it("觸控取消及離開目標不追加震動", () => {
    const link = renderLink();
    fireEvent.pointerDown(link);
    fireEvent.pointerCancel(link);
    fireEvent.pointerUp(link);
    fireEvent.pointerDown(link);
    fireEvent.pointerLeave(link);
    fireEvent.pointerUp(link);
    expect(vibrate).toHaveBeenCalledTimes(2);
  });
  it("捲動取消回彈，鬆手不追加震動", () => {
    const link = renderLink();
    fireEvent.pointerDown(link);
    fireEvent.pointerMove(link, { clientY: 35 });
    fireEvent.pointerUp(link);
    expect(vibrate).toHaveBeenCalledTimes(1);
  });
  it("滑鼠與右鍵不觸發手機震動", () => {
    const link = renderLink();
    fireEvent.pointerDown(link, { pointerType: "mouse" });
    fireEvent.pointerUp(link, { pointerType: "mouse" });
    fireEvent.pointerDown(link, { button: 2 });
    fireEvent.pointerUp(link, { button: 2 });
    expect(vibrate).not.toHaveBeenCalled();
  });
  it("不支援或拒絕震動時仍可導航", () => {
    vibrate.mockImplementationOnce(() => {
      throw new Error("unsupported");
    });
    const link = renderLink();
    expect(() => fireEvent.pointerDown(link)).not.toThrow();
    fireEvent.pointerUp(link);
    fireEvent.click(link);
    expect(screen.getByRole("heading", { name: "下一頁" })).toBeVisible();
  });
  it("減少動態時不啟動按壓狀態或震動，仍可導航", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    const link = renderLink();
    fireEvent.pointerDown(link);
    expect(link).toHaveAttribute("data-phase", "idle");
    fireEvent.pointerUp(link);
    expect(vibrate).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(screen.getByRole("heading", { name: "下一頁" })).toBeVisible();
  });
});
