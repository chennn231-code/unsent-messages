/** Live UI copy only. Unimplemented product states belong in copy-guidelines.md. */
export const copy = {
  brand: {
    name: "不敢傳出去的訊息",
    englishName: "Unsent Messages",
    homeLabel: "不敢傳出去的訊息，回首頁",
  },
  navigation: {
    label: "主要導覽",
    skipToMain: "跳至主要內容",
    home: "首頁",
    write: "寫信",
    mailbox: "私人信箱",
    sky: "星空信箱",
  },
  home: {
    title: "不敢傳出去的訊息",
    eyebrow: "深夜郵局",
    description: "有些話打了三遍又刪掉，最後連自己都想不起來要說什麼。",
    supportingText: "沒事，放這裡就好。",
    startWriting: "開始寫信",
    footnote: "先看看，不急著寫。",
    aboutLabel: "關於這裡",
    closing: "不用想好要寫什麼。",
    closingNote: "想寫的時候，再來就好。",
    illustrationAlt:
      "粉彩手繪的小郵局：珊瑚色屋頂、米白牆面、亮著杏色燈光的窗戶，門旁有信箱，屋頂上方有彎月。",
    illustrationCaption: "郵局還亮著燈。",
    illustrationAction: "進去看看寫信頁面",
  },
  editor: {
    eyebrow: "寫給誰都可以",
    title: "寫下來吧",
    description: "寫給誰都行，寫給自己也不丟人。",
    placeholder: "想說什麼，就從這裡開始寫。",
    previewNote: "這是信紙預覽，還不能輸入。",
    availability: "寫信和儲存功能還沒開放。",
  },
  mailbox: {
    eyebrow: "留給自己",
    title: "私人信箱",
    description: "留給自己的信，之後會放在這裡。",
    previewTitle: "這裡先留個位置。",
    availability: "信件清單還沒開放。",
    previewNote: "目前是頁面預覽，還不能查看或管理信件。",
    localPrivacy:
      "本機信件只會留在這個瀏覽器。清除網站資料後，就無法復原，也不會自動同步到其他裝置。",
  },
  sky: {
    eyebrow: "不認識的人，也可能讀到",
    title: "星空信箱",
    description: "這裡之後會放通過審核的公開信件。",
    previewTitle: "星空信箱還沒開放。",
    availability: "目前還不能公開或閱讀信件。",
  },
  notFound: {
    eyebrow: "404・找不到這一頁",
    title: "這裡好像沒有這封信。",
    description: "可能是網址不對，先回首頁看看。",
    goHome: "回到郵局",
  },
  footer: {
    message: "不想傳的話，就先放著。",
    place: "深夜郵局",
    version: "基礎預覽版",
  },
} as const;
