# Sprint 01 驗收報告 · V4.4.1

驗證日期：2026-10-16（Asia/Taipei）。僅完成 Sprint 01，未進入 Sprint 02。

## A. Preflight

| 項目         | 修改前結果                                                                           |
| ------------ | ------------------------------------------------------------------------------------ |
| 專案根目錄   | `/Users/chenyuting/Documents/ChatGPT/《不敢傳出去的訊息》`                           |
| Branch       | `main`                                                                               |
| HEAD         | 尚無 commit，沒有可解析的 HEAD                                                       |
| Working Tree | 空白，除 `.git` 外沒有專案檔案，沒有未提交修改                                       |
| Staging      | 空白                                                                                 |
| 原有技術架構 | 無 React、TypeScript、Vite、package.json、lockfile、路由、CSS 或測試；無可沿用程式碼 |
| 環境         | Node.js 24.18.0、npm 11.16.0                                                         |

依空白專案條件初始化。沒有刪除或覆蓋原有成果，沒有執行 reset、clean、commit、push。

## B. Task 01–09

| Task            | 狀態     | 實作與證據                                                                                                                                                   |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01 專案基礎     | 已完成   | React 19.3.1、TypeScript 5.9.3 strict、Vite 8.3.4、Tailwind 4.3.3、React Router 7.18.4、Vitest 5.0.5、RTL 16.3.3、ESLint 10.12.0；只有 npm package-lock.json |
| 02 專案架構     | 已完成   | domain / repositories / features / components / styles / app 分層；UI 不依賴 IndexedDB；沒有大量未開發功能空檔                                               |
| 03 V4.1 視覺    | 已完成   | 指定色彩、字級、行高與字距 tokens、Noto 字體 swap、後備字型、CSS 郵局場景、紙張配色；重要文字對比度符合 AA                                                   |
| 04 路由         | 已完成   | `/`、`/write`、`/mailbox`、`/sky`、404；直接網址、重新整理、導覽及路由焦點處理已驗證                                                                         |
| 05 信件模型     | 已完成   | 指定型別與 publication status、UUID、日期、版本、owner、普通與時光信區分、狀態轉換及封存限制                                                                 |
| 06 Repository   | 已完成   | 非 React 介面、明確錯誤碼、revision、防止靜默覆蓋、實際刪除；delete 增加可選 expectedRevision，供未來 UI 防止用舊版本刪信                                    |
| 07 IndexedDB    | 已完成   | schema version 1、store、CRUD、版本檢查和更新同一交易、等待交易完成、升級阻擋／失敗、不可用／容量不足／寫入錯誤處理                                          |
| 08 自動化測試   | 已完成   | 3 個測試檔、46 個測試全數通過，無未處理拒絕；真實瀏覽器測試另行執行                                                                                          |
| 09 手機及無障礙 | 部分完成 | 真實桌面瀏覽器 320／390／412px × 5 路由及 200% 根字級放大、無溢出、44px 觸控區、鍵盤、焦點已驗證；實體裝置、作業系統放大、瀏海 Safe Area 待驗證              |

## C. 修改檔案

本輪皆為新增，無既有檔案被修改或刪除。以下列出所有應追蹤檔案；node_modules、dist 為忽略的生成物。

| 檔案                                            | 用途                                                 |
| ----------------------------------------------- | ---------------------------------------------------- |
| `.gitignore`                                    | 排除 node_modules、dist、coverage 與本機檔           |
| `package.json`                                  | 相依套件、dev/build/typecheck/lint/test scripts      |
| `package-lock.json`                             | 唯一套件鎖定檔                                       |
| `tsconfig.json`                                 | TypeScript strict 與編譯設定                         |
| `vite.config.ts`                                | React、Tailwind Vite 外掛與 Vitest 設定              |
| `eslint.config.js`                              | ESLint flat config 與 Hooks 規則                     |
| `index.html`                                    | 繁體中文、viewport、Safe Area、入口及 metadata       |
| `README.md`                                     | 啟動、架構、資料契約、限制、部署回退及測試方式       |
| `src/main.tsx`                                  | React / BrowserRouter 啟動                           |
| `src/app/App.tsx`                               | 網站共用框架、導覽、五個路由、404、焦點管理          |
| `src/app/routes/HomePage.tsx`                   | 首頁與指定文案                                       |
| `src/components/PostOffice.tsx`                 | 無外部圖片的靜態郵局場景                             |
| `src/features/editor/WritePage.tsx`             | 信紙預覽，不提供輸入或自動保存                       |
| `src/features/private-mailbox/MailboxPage.tsx`  | 私人信箱預留頁及本機資料提醒                         |
| `src/features/public-sky/SkyPage.tsx`           | 星空信箱預留頁，不提供投稿                           |
| `src/styles/global.css`                         | V4.1 tokens、字型、場景、紙張、響應式及無障礙樣式    |
| `src/domain/letter.types.ts`                    | Letter、Owner、PublicationStatus、CreateDraftInput   |
| `src/domain/letter.errors.ts`                   | 領域及儲存錯誤類別與錯誤碼                           |
| `src/domain/letter.validation.ts`               | 必填、UUID、日期、版本、時區、種類與狀態驗證         |
| `src/domain/letter.lifecycle.ts`                | 轉換圖、草稿編輯、封存及到期規則                     |
| `src/repositories/LetterRepository.ts`          | 可替換的非 React 儲存介面                            |
| `src/repositories/IndexedDbLetterRepository.ts` | 本機 store、CRUD、交易、競爭與錯誤處理               |
| `src/tests/setup.ts`                            | fake-indexeddb、RTL matcher 與 cleanup               |
| `src/tests/fixtures.ts`                         | 獨立測試資料                                         |
| `src/tests/domain.test.ts`                      | 領域模型與生命週期測試                               |
| `src/tests/repository.test.ts`                  | 模擬 IndexedDB 交易、CRUD、競爭、錯誤測試            |
| `src/tests/app.test.tsx`                        | jsdom / RTL 路由與焦點測試                           |
| `src/tests/browser-harness.ts`                  | 真實瀏覽器資料庫及字級放大測試邏輯，不由產品入口引用 |
| `tests/browser.html`                            | 僅開發環境手動點擊的瀏覽器測試入口                   |
| `docs/SPRINT01-REPORT.md`                       | 本報告                                               |
| `docs/screenshots/home-desktop.jpg`             | 桌面首頁證據                                         |
| `docs/screenshots/home-320.jpg`                 | 320px 首頁證據                                       |
| `docs/screenshots/write-320.jpg`                | 320px 信紙頁證據                                     |
| `docs/screenshots/text-scale-test.jpg`          | 200% 根字級放大結果                                  |
| `docs/screenshots/indexeddb-browser.jpg`        | 真實 IndexedDB CRUD 與衝突結果                       |

## D. 實際驗證結果

| 檢查                 | 指令／方式                             | 最終結果                                                                                                              |
| -------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Dev                  | `npm run dev`                          | Vite 8.3.4 啟動，Local URL `http://127.0.0.1:5173/`；真實瀏覽器成功載入。驗證後停止本輪伺服器，使用者可依 README 重啟 |
| Build                | `npm run build`                        | 通過；27 modules；JS 265.32 kB / gzip 84.51 kB，CSS 14.62 kB / gzip 4.55 kB                                           |
| Typecheck            | `npm run typecheck`                    | 通過                                                                                                                  |
| Lint                 | `npm run lint`                         | 通過                                                                                                                  |
| Unit Tests           | `npm run test`                         | 通過：3 files、46 tests，無 unhandled errors                                                                          |
| 套件                 | `npm ls --depth=0`                     | 無不相容 peer dependency                                                                                              |
| 安全相依檢查         | `npm audit --json`                     | 0 個已知漏洞                                                                                                          |
| Browser Verification | Codex In-app Browser                   | 首頁與全部路由、直接進入、重新整理、導覽後 main 焦點通過                                                              |
| 真實 IndexedDB       | `/tests/browser.html`                  | Create、Read、Update、List、Private、Delete、多實例 revision 衝突、重新整理後持久化通過                               |
| Mobile Verification  | 桌面瀏覽器 viewport override           | 320、390、412px × 五個路由全數無水平溢出，重要連結至少 44×44px                                                        |
| 文字放大             | 真實瀏覽器 iframe，root font-size 200% | 320、390、412px × 五個路由全數無水平溢出；這是字級模擬，並非 OS 字體或真機驗證                                        |
| 鍵盤                 | Tab、Return                            | Skip link 顯示、2px 焦點框、跳至 main 通過；路由切換聚焦 main                                                         |
| 信紙                 | 瀏覽器 computed style                  | 17px 字級、34px 行高、rgb(81,70,56) = #514638                                                                         |
| CSS / Git 格式       | `git diff --check`                     | 通過（新增檔案尚未 staged，另經 Prettier 格式化）                                                                     |

測試分類：

- 純領域測試：合法／非法資料、必填欄位、合法／非法轉換、封存不可改／取消／提早拆封、封存可刪除、到期轉換規則。
- fake-indexeddb：CRUD、revision、同庫不同實例競爭、不存在資料、損壞資料、owner 隔離、交易初始化失敗、容量不足、request success 後 abort 回滾、create abort、schema 降級／升級失敗／阻擋。錯誤是模擬注入，不代表實體磁碟已被填滿。
- RTL / jsdom：五個路由及導覽焦點。jsdom 不提供實際排版驗證。
- 真實瀏覽器：native IndexedDB 與實際 CSS 渲染，未替換成 fake-indexeddb。衝突測試為同頁兩個獨立 repository 實例，未宣稱實測兩個獨立瀏覽器分頁或實體手機。

相依套件初次安裝發現舊 Vitest 相依漏洞，已升級並重建本輪產生的依賴與 lockfile，最終 audit 為 0。初次 dev 受到 sandbox port 限制；取得工具執行權限後成功啟動並完成真實瀏覽器測試。

關鍵配色對比度（WCAG 相對亮度計算）：

| 前景／背景                 | 對比度  |
| -------------------------- | ------- |
| #E5D8C4 / #0B1018          | 13.57:1 |
| #C6BFB4 / #182634          | 8.43:1  |
| 主要按鈕 #29241E / #D5B58B | 7.92:1  |
| 信紙 #514638 / #E5D8C4     | 6.55:1  |

## E. 風險與限制

1. 尚未完成實體 iPhone、Android、Safari、TalkBack／VoiceOver、OS 字體放大與非零 Safe Area 測試，不能宣稱全部手機驗收通過。CSS 已提供 Safe Area padding、rem、換行、focus-visible、prefers-reduced-motion；目前場景沒有動畫。
2. 正式部署環境未設定，必須另行加入 SPA 路由回退。本輪未發布網站。
3. IndexedDB 本機明文，localId 是邏輯隔離而非安全授權；瀏覽器或同源 JavaScript 可讀取。清除資料、隱私模式、儲存驅逐等可能造成資料遺失；沒有備份或同步。
4. 封存的本機正文不具防提前讀取保護。只有領域規則、未實作真正封存／解鎖功能；呼叫端可控制系統時間。未來雲端必須以伺服器時間控制、分離正文與中繼資料、到期前禁止取得正文，不能因 owner 正確就讓雲端 API 回傳正文。
5. `delete` 目前是硬刪除；未來同步需另設 tombstone／同步協定，不可直接沿用為雲端同步語意。
6. Google Fonts 是可選的外部字型請求，`display=swap` 並提供完整系統後備；離線排版會依裝置字型有所差異。字型不會收到正文，但會有一般連線資訊。未來完整離線字型／自託管尚未規劃。
7. 未開發 Sprint 02 編輯器、自動保存與信件去向；資料層可測試，但目前產品頁沒有信件編輯、儲存或刪除按鈕。身份 localId 持久化及儲存錯誤 UI 待後續接入。
8. 新 schema 只有 version 1；未實作尚未定義的 future migration。已測試失敗／版本不相容與阻擋處理。
9. npm audit 0 僅表示本次資料庫查詢沒有已知相依漏洞，不是應用程式全面安全稽核。

## F. Git 狀態

- 修改前：branch `main`；無 commit、無 HEAD；Working Tree 與 Staging 空白。
- 修改後：branch `main`；仍無 commit、無 HEAD；35 個本輪新增檔案皆未追蹤（untracked）；Staging 空白。
- 沒有 commit 或 push，沒有切換分支、修改 `.git` 設定、reset 或 clean。
- `node_modules/`、`dist/` 為忽略產物，不在待提交清單。

## G. Sprint 02 準備度

**PARTIALLY READY**

資料模型、分層、原子版本控制、CRUD、錯誤處理及單元／真實瀏覽器證據已具備，可作為後續編輯器工作的基礎；Task 09 尚有實體裝置與輔助技術驗證待完成，因此不宣稱 Sprint 01 全項驗收通過。建議先完成 iOS Safari／Android Chrome、系統字體放大及 Safe Area 人工檢查，再確認正式進入下一階段。本輪在此停止。

## 驗收標準對照

| 編號 | 項目            | 結果                                   |
| ---- | --------------- | -------------------------------------- |
| 01   | 正常啟動        | 通過                                   |
| 02   | Build           | 通過                                   |
| 03   | Typecheck       | 通過                                   |
| 04   | ESLint          | 通過                                   |
| 05   | Vitest          | 通過                                   |
| 06   | 首頁／路由      | 通過，本機 dev；正式部署回退待設定     |
| 07   | V4.1 字體／配色 | 通過，外部字型有後備                   |
| 08   | IndexedDB CRUD  | 通過，模擬與真實瀏覽器皆有驗證         |
| 09   | revision 不覆蓋 | 通過，原子交易與多實例測試             |
| 10   | 基本手機排版    | 瀏覽器模擬通過；真機部分未驗證         |
| 11   | 既有功能未破壞  | 初始空白，無既有功能；未覆蓋使用者成果 |
| 12   | 無 Commit／Push | 通過                                   |

## 參考設定來源

- [Vite 官方入門](https://vite.dev/guide/)
- [Tailwind 官方 Vite 安裝](https://tailwindcss.com/docs/installation/using-vite)
- [React Router 官方 Declarative 安裝](https://reactrouter.com/start/declarative/installation)
