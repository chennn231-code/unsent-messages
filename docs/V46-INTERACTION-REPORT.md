# V4.5.1／V4.6 與互動回饋整合驗收

日期：2026-10-16（Asia/Taipei）。本次將進行中的手繪 SVG 細節、V4.6 文案管理與後續追加的互動回饋一起完成。產品功能仍為 Sprint 01，沒有進入編輯器、公開、刪除或時光信功能開發。

## A. Preflight

- 專案：`/Users/chenyuting/Documents/ChatGPT/《不敢傳出去的訊息》`。
- Branch：`main`；HEAD：尚無 commit，無可解析 HEAD。
- Working Tree：既有全部成果皆為未追蹤檔案，包含前一項尚在進行的 SVG 工作；Staging 空白。
- 目前階段：Sprint 01 基礎頁面、資料模型與本機 repository 已完成，先前驗收保留真機／Safe Area 等人工測試。首頁已有粉彩插畫試版；沒有真實信件操作、帳號、公開或時光信 UI。
- 已搜尋 app、features、components、index.html、測試及資料層中文字。原無集中式文案檔；路由元件測試依賴舊文案。
- 修改範圍：既有頁面、共享裝飾與路由連結、文案檔及規範、樣式、相關測試與報告。修改前對全部 domain／repositories 檔案建立 SHA-256 基準，完成後逐檔比對全部一致。

## B. 文案與互動修改摘要

### 已接入文案

- 首頁主標題「不敢傳出去的訊息」；「有些話打了三遍又刪掉，最後連自己都想不起來要說什麼。」；「沒事，放這裡就好。」；主要操作「開始寫信」。沒有新增序列淡入，直接顯示完整文字。
- 寫信：「寫下來吧」「寫給誰都行，寫給自己也不丟人。」「想說什麼，就從這裡開始寫。」保留真實的預覽／未開放提示，不新增輸入框。
- 私人信箱：清楚說明清單未開放，未顯示真正空清單文案。補足「這個瀏覽器」與「不會自動同步到其他裝置」說明。
- 星空信箱：說明之後呈現經審核的公開信件，目前尚未開放。未把未實作功能寫成沒有公開資料。
- 404、導覽、品牌替代文字、頁尾、插畫 alt 與說明均集中到 `src/content/zh-TW.ts`。
- HTML title／description 與啟動時 metadata 同步 V4.6；靜態 HTML 保留無 JS 時可讀的 fallback，React 啟動後使用集中式文案。

### 未接入及待人工確認

刪除／公開／同步／時光信件／回應等狀態未有對應產品功能，只記入 `copy-guidelines.md`，包含實際成功條件、10 秒撤回、後端審核、封存限制及錯誤處理語意。

三條故事角落候選也只列於規範，等待人工確認，沒有暗示真實投稿。現有專案沒有找到 V3.9 的 15 條原文，未覆蓋、刪除或建立替代彩蛋元件。

### 手繪細節

- `HandDrawn.tsx` 使用明確 viewBox、穩定的 cubic／quadratic 曲線、不等寬填色筆觸、斷續的第二筆描邊及圓線端／圓接角。
- 郵票與按鈕紙面 filter：fractalNoise .65、3 octaves、固定 seed 17，降強度灰階 noise 以 multiply 混入，再依原始圖形 alpha 裁切。文字和焦點框不套此材質濾鏡。
- 紙面只做同色微深淺的 gradient，沒有新增大面積光滑漸層。SVG 顏色由 CSS variables／currentColor 提供，不用純黑描邊。
- 信封只保留外形與封口；星星為不對稱曲線。rem 尺寸、穩定路徑與 useId 避免重繪時形狀變動或 filter ID 衝突。
- 主郵局保留前一輪原創 WebP 插畫與比例，不重新生成。舊 pencil SVG 資產保留，但目前介面改用可繼承顏色的 React SVG。

### 已接入互動

| 項目           | 實作                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| 真正可點的入口 | 品牌首頁、四個導覽連結、開始寫信、404 返回連結，以及新增郵局插畫連至既有 `/write` 路由     |
| Idle           | 1 → 1.03 → 1，ease-in-out 3.1–4 秒，不同入口週期錯開；僅 scale，不改排版                   |
| Hover          | 只在 fine pointer／hover 裝置：scale 1.08、brightness 1.04、暖光 .15 → .3；cursor pointer  |
| 觸控按壓       | 一般 .95；主信封式按鈕 .9，加下沉 3px，100ms                                               |
| 鬆開           | .95 → 1.05 → 1，200ms；按下過渡與鬆開回彈合計至多 300ms，不包含使用者按住多久              |
| 觸覺           | 有效 touch pointerup 且支援時呼叫 navigator.vibrate(10)，失敗不影響導覽                    |
| 取消保護       | pointercancel、離開目標、移動超過 10px、鬆手在目標外、非主指標／右鍵不造成有效觸控回饋     |
| 不延遲操作     | 沒有 preventDefault、等待動畫的 timer 或動畫結束後才導航；保持原生連結、鍵盤操作與焦點管理 |
| 減少動態       | 無呼吸、縮放、回彈、過渡、亮度濾鏡與震動，改為靜態 outline；鍵盤仍有清楚焦點框             |
| 暖光形狀       | 使用 drop-shadow 隨插畫／紙面輪廓，避免整張透明 PNG 的矩形發光框                           |

Skip link 保持靜態可及性工具，不新增呼吸效果。裝飾星星、信封與主圖內小信箱不是獨立可點物件，不加會誤導操作的假熱區。

### 本輪尚未實作的專屬效果

沒有真實功能可以連接，因此未新增：信封抽紙、書桌鏡頭與杯筆晃動、公開星星展信與擴散圈、私人信箱門與灰塵、送出飛信／頁面震動、刪除碎裂／暗沉、1.5 秒長按刪除與環形進度。未實作公開星星，所以也沒有可套用的「星星視覺外多 20px」操作熱區。未建立這些功能的空元件或假完成畫面。

未來接上後仍必須以真實交易或後端結果觸發完成動畫，長按不能取消明確刪除確認，也需有等效鍵盤與輔助技術途徑。

## C. 修改檔案

本清單以本次連續要求為範圍；所有檔案在 Git 仍是未追蹤成果，以下「修改」表示相對前一次已完成的工作內容。

| 狀態 | 檔案                                           | 用途                                          |
| ---- | ---------------------------------------------- | --------------------------------------------- |
| 新增 | `src/content/zh-TW.ts`                         | 已接入文案與型別安全常數                      |
| 新增 | `src/content/copy-guidelines.md`               | V4.6 語氣、安全狀態、未開放文案與候選使用條件 |
| 新增 | `src/components/HandDrawn.tsx`                 | 紙面、分隔線、信封與星星的手繪 SVG            |
| 新增 | `src/components/PhysicalLink.tsx`              | 共用原生連結的物理回饋，不改路由語意          |
| 新增 | `src/styles/interaction.css`                   | 呼吸、hover、按壓、回彈與減少動態樣式         |
| 新增 | `src/tests/physical-link.test.tsx`             | 震動、取消、捲動、滑鼠、錯誤及減少動態測試    |
| 修改 | `src/app/App.tsx`                              | 集中文案、共用導覽回饋、手繪品牌與分隔線      |
| 修改 | `src/app/routes/HomePage.tsx`                  | V4.6 主文案與手繪按鈕、裝飾                   |
| 修改 | `src/components/PostOffice.tsx`                | 集中 alt／caption 與指向既有寫信頁的明確入口  |
| 修改 | `src/features/editor/WritePage.tsx`            | 寫信預覽文案與情緒文案字體                    |
| 修改 | `src/features/private-mailbox/MailboxPage.tsx` | 預覽狀態與本機資料界線                        |
| 修改 | `src/features/public-sky/SkyPage.tsx`          | 未開放狀態與公開性質說明                      |
| 修改 | `src/main.tsx`                                 | 從集中式文案套用 title／description           |
| 修改 | `src/styles/pastel-home.css`                   | inline SVG、rem 造型與長文案排版              |
| 修改 | `src/assets/paper-grain.svg`                   | noise .65、currentColor                       |
| 修改 | `src/tests/app.test.tsx`                       | 新文案與預覽不假裝讀取／編輯的檢查            |
| 修改 | `src/tests/browser-harness.ts`                 | 真實 CSS 按壓、回彈與減少動態分支測試         |
| 修改 | `tests/browser.html`                           | 既有開發用測試頁加測試按鈕，不是產品路由      |
| 修改 | `index.html`                                   | 靜態 fallback description                     |
| 修改 | `README.md`                                    | 當前文案／互動說明及測試入口                  |
| 新增 | `docs/V46-INTERACTION-REPORT.md`               | 本驗收報告                                    |
| 新增 | `docs/screenshots/v46-home-desktop.jpg`        | 1280px 首頁                                   |
| 新增 | `docs/screenshots/v46-home-320.jpg`            | 320px 首頁                                    |
| 新增 | `docs/screenshots/v46-write-320.jpg`           | 320px 信紙預覽                                |
| 新增 | `docs/screenshots/v46-motion-verification.jpg` | 互動／減少動態瀏覽器測試                      |
| 新增 | `docs/screenshots/v46-text-scale.jpg`          | 200% 字級測試                                 |

沒有刪除檔案；未新增動畫套件、未改 package／lockfile。

## D. 文案規範檢查

- 台灣繁體中文、自然口語、操作直接、安全說明清楚。英文品牌名 Unsent Messages 保留。
- 已掃描正式 copy 常數，沒有感嘆號、Emoji、指定的非台灣用詞或過度網路化語氣。
- 產品 app／feature／component 中不再重複硬編碼中文文案。
- 未宣稱已登入、已同步、公開成功、已刪除、信件為空或對方已讀。
- 本機與雲端分開；預覽頁沒有新增資料操作。
- domain／repositories SHA-256 比對全部一致，所有權、資料結構、API、IndexedDB 與封存規則未變。

## E. 實際測試結果

| 項目                        | 結果                                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `npm run build`             | 通過；33 modules；JS 272.85kB、gzip 87.36kB；插畫 296.21kB                                                        |
| `npm run typecheck`         | 通過                                                                                                              |
| `npm run lint`              | 通過                                                                                                              |
| `npm run test`              | 通過，4 files／53 tests；包含先前領域與 fake-indexeddb 測試                                                       |
| Browser Verification        | 真實瀏覽器：新文案、操作名稱、Skip link 的 Tab／Return、焦點框、導航後 main 焦點通過                              |
| Motion Browser Verification | 真實 CSS 渲染，透過開發用測試頁模擬 pointer events：下沉與 200ms 回彈通過                                         |
| Reduced Motion Verification | 取出正式 media rules，於 iframe 啟用並模擬 matchMedia：無動畫／縮放、靜態高亮、正常導航通過；不是 OS 設定切換測試 |
| Mobile Verification         | 桌面真實瀏覽器 320／390／412px × 五個路由：無水平溢出，所有可見操作連結至少 44×44px                               |
| 文字放大                    | 同三種寬度 × 五路由，200% 根字級模擬全部無溢出                                                                    |
| 信紙                        | 17px／34px 行高，保持深墨色、高對比與 Noto Serif TC                                                               |
| 核心資料檔                  | SHA-256 六個檔案全部一致                                                                                          |

53 個測試包含 24 個領域、16 個 fake-indexeddb、7 個路由／預覽及 6 個互動回饋測試。模擬 IndexedDB 與觸控，不等於實體手機測試。

`npm run dev` 已成功啟動並完成驗證。驗證後停止本輪伺服器，依 README 可重啟。

## F. 風險與待確認

- 實體 Android 震動、iOS 行為、OS reduced-motion／字體設定、Safe Area 及實體螢幕閱讀器尚未驗證。震動是 best effort；不支援仍可操作。
- 物理回饋只接現有入口；上述尚無產品功能的動畫及長按確認均未完成，不能宣稱全部互動規格完成。
- 未新增首頁依序淡入，避免為文案新增動畫系統；所有文字可立即讀到。
- V4.5 的全站套用仍未完成；目前首頁為粉彩主題，其他頁仍是 Sprint 01 預覽風格，只有共用 SVG／導覽回饋與文案更新。
- 純視覺提示不能取代說明：既有「開始寫信」實際進入預覽，不代表編輯器可用，頁內有明確說明。
- 文案候選需人工確認：三條彩蛋；真正空清單時的輕鬆輔助句。其他未開放狀態有使用條件，需在未來實作時重新驗證。
- 資料層錯誤目前未直接顯示於產品 UI，所以保留原始錯誤訊息；後續應依錯誤碼接正式安全文案，不能暗示已有版本選擇 UI。
- 標題和描述的靜態 HTML fallback 須隨品牌文案同步；執行時由 copy 常數覆寫。

## G. Git 狀態

修改前後均為 `main`、無 commit／HEAD，Staging 空白。Working Tree 保留所有既有及本次未追蹤成果。沒有 commit、push、reset、clean 或切換分支。`node_modules`、`dist` 維持忽略產物。

## H. 最終判斷

**PARTIAL PASS**

V4.6 在已實作頁面完整接入，集中式文案和未來語氣／安全規範已建立；手繪細節與現有入口的互動回饋也已通過程式及瀏覽器檢查。完整場景互動仍有多項依賴尚未存在的編輯／信件／公開／刪除功能，且實體裝置驗證未完成，因此整體判定為部分通過。本輪停止，不進入下一個 Sprint。
