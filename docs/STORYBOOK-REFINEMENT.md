# 高級手繪繪本版 · 更新紀錄

日期：2026-10-16（Asia/Taipei）

本次依使用者最後一份規範實作：完整繪本構圖、夜空空氣感、手繪地面、全站紙色與字體，以及所有可點入口的 3–4 秒呼吸。這份最後要求取代前面「僅主要入口呼吸」的選擇。保留「開始寫信」等文字內容，依追加要求移除介面句尾句點；隱私長句改用分號分隔，沒有修改信件正文資料。

## 實作

- 首頁：移除框住主圖的矩形與卡片式入口，改為郵局落在泥土筆觸上、下方郵務路徑指引；主色為霧藍、米白與暖杏／木棕一組暖色，插畫少量灰綠只作次要筆觸。
- 背景：#2E3244 到 #1A1D2B 的夜空放射漸層（使用者明確指定的例外），SVG 紙紋 alpha .04；首頁五顆背景星星加主圖兩顆，其他頁七顆，位置與亮度固定為非均勻分布，避免重繪跳動。
- 郵局：內建 ImageGen 編修的第二版，簡化屋瓦、減少重描邊、保留紙粒；透明 WebP 約 216KB。舊圖保留。
- 信紙：實測 #F0E6D3、18px、行高 36px、墨色 #3D3428；placeholder 16px、#B8AFA3；紙邊約 1–2px 偏移，加入手繪桌面與鉛筆作場景層。
- 私人信箱：原生手繪 SVG 的打開信箱與靜態灰塵意象，保留「清單未開放」說明，沒有假裝已讀取空清單。
- 星空：上方七顆 8–17px、opacity .4–.8 的非均勻星星與下方屋頂剪影；沒有虛構公開信件。
- 標題：Noto Serif TC 32px／500、行高 1.5、字距 .06em；操作文字 Noto Sans TC 400；手機輔助文字仍至少 15px。
- 不使用預設卡片、毛玻璃、陰影堆疊；分隔線使用不規則筆觸與虛線。
- 操作：固定外層連結熱區，只有內層圖形移動。可見入口呼吸 1–1.03、3–4 秒、錯開相位；離屏與分頁隱藏時暫停。按下 .95、2px 下沉；180ms 回彈，220ms 淡筆觸回聲。觸控按下時支援才 vibrate(10)，錯誤不阻擋操作。
- 頁面轉場：220ms 淡入與微位移；prefers-reduced-motion 取消動畫，保留靜態高亮與鍵盤焦點。

## 驗證

- Typecheck、Lint、54 個 Vitest 測試及 Build 通過。
- 真實瀏覽器 320／390／412px × 五個路由無水平溢出，可見操作熱區至少 44×44px。
- 根字級 200% 模擬，三種寬度 × 五路由無水平溢出。
- 開發測試頁以真實 CSS 和模擬 pointer events 驗證 .95 按壓、固定熱區、回彈；取用正式 CSS 分支模擬減少動態，導航仍可用。
- 實體手機震動、OS 字級／動態設定、VoiceOver／TalkBack 尚未驗證。
- domain 與 repositories 六個檔案對照既有 SHA-256 全部一致；沒有改動資料庫、所有權或生命週期。
- 沒有 commit 或 push；預覽保持運行供人工確認。

## 範圍限制

仍為 Sprint 01 的產品功能。寫信是信紙預覽；信箱清單與公開星空尚未開放。因此「有信件時的信封清單」「點星星展開真實信件」「真正空信箱後的灰塵動畫」尚未接入，未使用假信件或假成功畫面展示。這次完成的是視覺與既有入口的回饋。

## 主要檔案

- src/components/StoryScene.tsx：夜空星星、地面、私人信箱與屋頂 SVG
- src/components/PostOffice.tsx：第二版插畫、地面及既有寫信入口
- src/components/PhysicalLink.tsx：固定熱區、觸控、可見性控制
- src/components/HandDrawn.tsx：柔化的紙面與手繪筆觸
- src/app/App.tsx、src/app/routes/HomePage.tsx：共用構圖與首頁路徑
- src/features/editor/WritePage.tsx、private-mailbox/MailboxPage.tsx、public-sky/SkyPage.tsx：各頁繪本場景
- src/styles/global.css、pastel-home.css、interaction.css：統一設計變數與動態
- src/content/zh-TW.ts、index.html：句尾句點與入口說明
- src/assets/post-office-pastel-v2.png、post-office-pastel-v2.webp：原始圖及網頁用圖
- src/assets/paper-grain.svg：低強度紙紋
- src/tests/app.test.tsx、physical-link.test.tsx、browser-harness.ts：更新的實際狀態與動態測試
- docs/screenshots/storybook-*.jpg：最終畫面及驗證截圖

## 插畫編修紀錄

工具：內建 ImageGen；編修目標：專案內第一版透明 PNG；輸出另存 v2，未覆寫原圖。

最終 prompt：

> Use case: style-transfer. Edit target: the attached existing transparent pastel midnight post-office illustration. Make this SAME illustration gentler and substantially simpler, retaining its identity and entire composition. Keep a small asymmetrical pitched-roof post office with two warm apricot front windows, wooden glazed door, little coral postbox, shallow doorstep and crescent moon. Keep the same 1536x1024 landscape framing and genuine transparent background. Simplify the roof to one dusty-coral pigment shape with just a few uneven pencil marks; remove most individual roof-tile divisions and surface scribbles. Remove the blank plaque above the door, simplify ground vegetation to a few soft sage strokes, and keep only TWO tiny irregular stars. Reduce the weight and contrast of charcoal-like outlines by about 35 percent; use soft warm brown-gray broken pencil edges instead. Reduce coarse speckle density about 25 percent but retain visible organic paper grain, chalk and wax pigment variation. Use fewer marks and larger calm pastel shapes, no glossy smooth vector fill, no blur filter. Gentle modest apricot window color, little color bleed, no large luminous halo around building or moon. Palette remains fog blue-gray #2A2D3E, ivory #F0E6D3, milk-tea #C4A882, dusty coral #D4956B, fog sage #8FA6A8, apricot #E8C49A. No new objects, people, animals, pumpkins, flowers, benches, text, typography, logos or watermarks. Preserve transparent edges and a quiet flat 2D handmade picture-book feeling. This is a refinement of the existing website asset, not a new scene or UI mockup.

