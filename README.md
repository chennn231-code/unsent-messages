# 不敢傳出去的訊息 · Unsent Messages

Sprint 01：React / TypeScript / Vite 基礎網站與 IndexedDB 信件資料層。

## 本機執行

本輪環境：Node.js 24.18.0、npm 11.16.0。Vite 8 請使用官方支援的 Node.js 版本（建議 Node.js 24 LTS）。

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

開啟終端顯示的 Local URL（預設 http://127.0.0.1:5173/）。
正式部署請將未知路徑回退至 `index.html`，讓 `/write`、`/mailbox`、`/sky` 可直接進入及重新整理；靜態資源仍應依原路徑服務。

## 範圍

提供首頁、寫信預覽、私人信箱預留頁、星空預留頁、404 與導覽。
沒有輸入、自動保存、帳號、雲端、公開投稿或實際時光信解鎖功能。

- `src/domain/`：型別、驗證、狀態轉換與草稿編輯規則，不依賴 React 或 IndexedDB。
- `src/repositories/`：抽象介面與 IndexedDB 實作。UI 不直接操作資料庫。
- `src/features/`：本輪基本功能頁面。
- `src/app/`：路由、頁面焦點管理。
- `src/styles/`：V4.1 tokens、排版、響應式與首頁粉彩主題。

## Repository 契約

```ts
const repository = new IndexedDbLetterRepository(localId);
const draft = await repository.createDraft({
  type: "unsent",
  owner: { kind: "local", localId },
  content: "",
});
const updated = await repository.saveDraft(
  draft.id,
  "一些心裡的話",
  draft.revision,
);
await repository.savePrivate(updated.id, updated.revision);
```

`localId` 由呼叫端提供並跨重載保留；本輪尚未接上身份 provider 或編輯 UI，未自動建立裝置身份。未來接 UI 時需先處理身份持久化及失敗訊息。
此本機實作只接受對應的 local owner；account owner 僅由領域型別預留，未來另行實作雲端 repository。

- 資料庫 `unsent-messages`，schema version 1，`letters` store 以 UUID `id` 為 key。
- 每次操作均等待交易完成；版本檢查和寫入在同一個 store readwrite transaction 內。
- `saveDraft`、`savePrivate` 必須提供目前版本；衝突拋出 `REVISION_CONFLICT`，呼叫端需重新讀取，不能自動強制覆蓋。
- `delete(id, expectedRevision?)` 擴充可選版本參數，讓未來 UI 防止使用舊版本刪除。刪除是實際刪除 IndexedDB 紀錄，沒有動畫或可復原資源回收筒；領域 `deleted` 表示允許的終止狀態，不寫入 tombstone。
- 草稿正文可空白；必填欄位、UUID、完整帶時區 ISO 日期時間、時間順序、整數版本及信件種類均須通過驗證。
- `unsent` 不接受封存／拆封狀態或解鎖欄位。時光草稿可暫無時間設定；封存規則要求有效未來時間與 IANA 時區。
- 只有 draft 可編輯；sealed 不能改正文、解鎖日期、取消封存或提早拆封，可刪除。本輪只提供領域規則，沒有 repository 的封存／解鎖操作。
- 所有已存資料讀取後再驗證，損壞資料會回報錯誤而不被靜默修復或丟棄。
- 明確錯誤碼：`VALIDATION`、`INVALID_TRANSITION`、`LOCKED`、`NOT_FOUND`、`REVISION_CONFLICT`、`UNAVAILABLE`、`QUOTA`、`STORAGE`、`UPGRADE`。
- 升級被舊分頁阻擋時回報錯誤；遇到更新版本需求自動關閉本實例連線；後續 schema migration 必須另行設計及測試。

## 驗證

`npm run test` 為離線自動化測試：領域規則、fake-indexeddb 的交易與 CRUD、React Testing Library 的路由元件測試。

真實瀏覽器測試與模擬測試分開。啟動 dev 後可進入 `/tests/browser.html`：

1. 「執行真實資料庫測試」驗證 CRUD、revision、多實例競爭，並留下測試用持久化紀錄。
2. 重新整理頁面，按「驗證重新整理後持久化」讀取並清除該紀錄。
3. 「驗證 200% 文字放大」以 320／390／412px iframe 渲染五個路由，將根字級放大至 200%，檢查水平溢出。這是字級放大模擬，並非手機作業系統字體設定測試。

測試僅使用獨立的 `unsent-messages-sprint01-browser-tests` 資料庫，不接觸使用者信件。測試頁不在 production build 的 HTML 入口內；不要把原始碼目錄直接當正式網站發布。

完整驗收、檔案清單與限制見 [Sprint 01 報告](docs/SPRINT01-REPORT.md)。

## 視覺與隱私限制

Google Fonts CSS 使用 `display=swap` 載入 Noto Serif TC／Noto Sans TC 的 400、500 字重（Google 提供 WOFF2），並有系統繁中字型後備。離線時使用系統字體，罕見字元可繼續由後備字體顯示；第三方字型請求會暴露一般連線資訊，不傳送正文。若未來要求完全離線及零第三方請求，應另行規劃完整自託管字型。

IndexedDB 是本機明文儲存，不是加密或帳號權限邊界，localId 只是邏輯隔離。可被相同來源 JavaScript、瀏覽器工具或具有裝置存取權的人讀取；瀏覽器可能清除或驅逐資料。本輪未提供備份、匯出或同步。

時光規則中的日期使用呼叫端時間，不是防竄改機制。未來雲端封存正文必須和可讀中繼資料分離，並由伺服器時間及授權控制正文讀取，不得直接把本機 repository 當雲端權限設計。

## V4.6 文案與互動更新

已接入的台灣繁體中文文案集中於 `src/content/zh-TW.ts`；品牌語氣與未開放狀態的使用條件見 `src/content/copy-guidelines.md`。

首頁、導覽與返回連結提供呼吸、按壓回彈及支援時的觸覺回饋，操作立即導頁。郵局插畫也連至既有寫信預覽；裝飾星星不提供假互動。減少動態時改為靜態高亮。沒有新增信件編輯、刪除或公開功能。

`/tests/browser.html` 新增「驗證互動與減少動態」：以實際 CSS 渲染和模擬事件驗證按壓／回彈、減少動態樣式與導覽，不代表已測試實體手機震動或作業系統設定。

完整修改、限制及 A–H 驗收見 [V4.6 與互動報告](docs/V46-INTERACTION-REPORT.md)。
