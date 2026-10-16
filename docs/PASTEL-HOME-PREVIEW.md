# 柔霧粉彩首頁 · 第一版方向預覽

本輪依指令最後的「先改首頁看效果」建議，僅對首頁套用新美術方向。尚未全量套用至寫信、私人信箱、星空與 404；這些頁面繼續使用 Sprint 01 視覺。

## 已套用

- 新色板 tokens 與首頁專屬 `pastel-home` 範圍，沒有修改資料模型、Repository 或生命週期。
- 夜空 #2A2D3E、紙張 #F0E6D3、暖杏 #E8C49A、珊瑚 #D4956B 等指定色板。
- 180px 無縫紙張紋理：fractal noise frequency .84、3 octaves、seed 23、alpha multiplier .08，避免強噪點干擾閱讀。
- 原創透明粉彩郵局插畫，略不對稱輪廓、不均勻顏料、珊瑚屋頂、杏色窗燈、米白牆、手繪月亮與星星；未加入動物、南瓜或野餐。
- 手繪按鈕：兩筆不完全重合的描邊、非對稱邊緣、米白紙紋底；不濾鏡處理文字與焦點框。
- 手繪分隔線與導覽底線；首頁沒有平滑 CSS 漸層、3D 透視或場景動畫。
- Noto Serif TC 標題、Noto Sans TC 操作介面保持不變。信紙正文未在此次首頁試版中變動；全量套用時需使用新紙色 #F0E6D3，保留 17–19px、行高 2.0 與深墨色。

## 修改與新增檔案

- 修改 `src/app/App.tsx`：依路由套用首頁主題 class。
- 修改 `src/app/routes/HomePage.tsx`：首頁短文案與箭頭。
- 修改 `src/components/PostOffice.tsx`：以可讀 alt 與固有尺寸呈現粉彩插畫。
- 新增 `src/styles/pastel-home.css`：首頁限定的配色、紙紋、描邊與手機排版。
- 新增 `src/assets/paper-grain.svg`、`pencil-divider.svg`、`pencil-outline.svg`：可維護的紋理與手繪介面素材。
- 新增 `src/assets/post-office-pastel-v1.png`：ImageGen 原始圖，1536×1024、透明背景。
- 新增 `src/assets/post-office-pastel-v1.webp`：cwebp q85、lossless alpha 編碼；網站載入此版本，由 2.26MB 降至約 296KB。原圖保留供後續調整。
- 新增本說明及 `docs/screenshots/pastel-home-desktop-v1.jpg`、`pastel-home-320-v1.jpg`、`pastel-text-scale-v1.jpg`。

## 驗證

- `npm run typecheck`、`npm run lint`、`npm run test`（46 tests）及 `npm run build` 通過。
- 真實桌面瀏覽器：1280px 截圖；320／390／412px 首頁均沒有水平溢出，導覽與主要按鈕至少 44×44px。
- 瀏覽器測試頁：三種寬度、五個路由、200% 根字級模擬全部無水平溢出。
- 主圖成功載入 WebP，alpha 保留，固有尺寸避免載入後版面跳動。
- 未新增動畫；沿用全域 prefers-reduced-motion 規則。
- 實體手機、OS 字體放大及輔助技術尚未重新驗證。
- 目前色板中珊瑚色等指定暖色本身可能高於 HSL 40% 飽和度；保留使用者指定色值，藉由畫面比例、紙紋與低飽和大面積夜空呈現柔和視覺，未擅自改寫指定 hex 值。
- 未 commit 或 push。先前工作仍維持未提交狀態。

## 插畫生成紀錄

工具：內建 ImageGen；模式：新生成，透明背景；使用者附圖只作風格理解，沒有直接複製其中物件或排版。場景已移入專案，不依賴外部圖片 URL。

最終生成 prompt：

> Use case: illustration-story. Asset type: transparent homepage illustration for a Traditional Chinese emotional letter-writing website named Unsent Messages. Create an ORIGINAL small cozy midnight post office, no text or lettering anywhere. Style: Soft Grainy Pastel Illustration, tangible dry soft pastel, wax crayon and colored pencil on fibrous handmade paper, strongly visible but soft grain and broken uneven pigment fill, loose irregular trembling outlines, simplified flat 2D hand-drawn facade, slightly asymmetric, no vector-perfect edges. Composition: landscape approximately 3:2, entire little post office visible, small pitched dusty coral roof, oatmeal plaster walls, muted milk-tea wooden door, two small softly glowing apricot windows and one little rounded coral postbox beside the door. A small irregular crescent moon and only three tiny hand-drawn stars above the roof, some minimal muted sage ground strokes below. Plenty of empty transparent space around silhouette. No characters, animals, pumpkins, picnic, forest, flowers, benches or extra buildings. Gentle quiet picture-book mood, restrained detail, NOT photorealistic, NO dramatic lighting, NO 3D perspective, NO smooth gradients, NO glossy glow or sharp geometry. Palette: foggy blue gray purple #2A2D3E and #1E2030 outlines, warm apricot #E8C49A light, old-paper ivory #F0E6D3 walls, milk-tea #C4A882 wood, muted dusty coral #D4956B roof/postbox, fog sage #8FA6A8 small details, cream #F5E6C8 stars. Main materials low saturation, softly rubbed pastel lamp light. Transparent background, preserve irregular powdery edges. Do NOT add any UI, labels, typography, border, watermark, or solid background.
