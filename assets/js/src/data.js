// 模擬資料：機關、服務與案件。所有內容皆為模擬，部分情境參考公開報導。
export const SEED_VERSION = "2026-10-21-v1";

export const AGENCIES = [
  { id: "mohw", name: "衛生福利部", type: "gov" },
  { id: "dot", name: "臺北市政府交通局", type: "gov" },
  { id: "trtc", name: "臺北大眾捷運股份有限公司", type: "soe" },
  { id: "tourism", name: "臺北市政府觀光傳播局", type: "gov" },
  { id: "pto", name: "臺北市公共運輸處", type: "gov" },
  { id: "line", name: "LINE台灣（示範）", type: "private" },
  { id: "msft", name: "台灣微軟（示範）", type: "private" },
  { id: "bank", name: "示範網路銀行", type: "private" },
  { id: "shop", name: "示範電商平台", type: "private" },
];

export const SERVICES = [
  { id: "cme", name: "醫事人員繼續教育積分管理系統", agency: "mohw", channel: "網站", edition: "標準版", badge: "AA（2.1 版，模擬）", vendor: "甲資訊股份有限公司（模擬）" },
  { id: "tw-std", name: "臺北好行（標準版）", agency: "dot", channel: "App", edition: "標準版", badge: "未取得 App 標章（模擬）", friendly: "tw-vi", vendor: "乙數位股份有限公司（模擬）" },
  { id: "tw-vi", name: "臺北好行（視障介面）", agency: "dot", channel: "App", edition: "友善版本", friendlyOf: "tw-std", badge: "未取得 App 標章（模擬）", vendor: "乙數位股份有限公司（模擬）" },
  { id: "mrt-std", name: "台北捷運Go（標準版）", agency: "trtc", channel: "App", edition: "標準版", badge: "未標示輔助使用支援", friendly: "mrt-text", vendor: "丙系統股份有限公司（模擬）" },
  { id: "mrt-text", name: "台北捷運Go（文字模式）", agency: "trtc", channel: "App", edition: "友善版本", friendlyOf: "mrt-std", badge: "未標示輔助使用支援", vendor: "丙系統股份有限公司（模擬）" },
  { id: "mrt-web", name: "臺北捷運公司官方網站", agency: "trtc", channel: "網站", edition: "標準版", badge: "AA（2.1 版）", vendor: "丙系統股份有限公司（模擬）" },
  { id: "travel", name: "臺北旅遊網", agency: "tourism", channel: "網站", edition: "標準版", badge: "AA（2.1 版，模擬）", vendor: "丁網路股份有限公司（模擬）" },
  { id: "ebus", name: "臺北市公車動態資訊系統", agency: "pto", channel: "網站", edition: "標準版", badge: "AA（2.1 版，模擬）", vendor: "戊資訊股份有限公司（模擬）" },
  { id: "line-pc", name: "LINE（Windows 電腦版）", agency: "line", channel: "桌面應用程式", edition: "標準版", badge: "不適用（民間企業）", vendor: "企業自行開發" },
  { id: "win11", name: "Windows 11", agency: "msft", channel: "桌面應用程式", edition: "標準版", badge: "不適用（民間企業）", vendor: "企業自行開發" },
  { id: "bank-app", name: "示範網路銀行 App", agency: "bank", channel: "App", edition: "標準版", badge: "不適用（民間企業）", vendor: "企業自行開發" },
  { id: "shop-web", name: "示範電商平台", agency: "shop", channel: "網站", edition: "標準版", badge: "不適用（民間企業）", vendor: "企業自行開發" },
];

export const WCAG = {
  "1.1.1": "非文字內容",
  "1.3.1": "資訊與關係",
  "1.3.2": "有意義的順序",
  "1.4.1": "色彩的使用",
  "1.4.3": "對比（最低）",
  "1.4.4": "調整文字大小",
  "2.1.1": "鍵盤",
  "2.1.2": "無鍵盤陷阱",
  "2.2.1": "可調整時間",
  "2.4.3": "焦點順序",
  "2.4.4": "連結目的",
  "2.5.1": "指標手勢",
  "2.5.3": "名稱中的標籤",
  "2.5.8": "目標尺寸（最小）",
  "3.3.1": "錯誤識別",
  "3.3.8": "無障礙驗證（最低）",
  "4.1.2": "名稱、角色、值",
  "4.1.3": "狀態訊息",
  "gap": "友善版本功能落差（建議修正第7條之2）",
};

// ---------- 重點案例（對應提案內容） ----------
const KEY_CASES = [
  {
    title: "登入驗證碼只有圖片，沒有非視覺替代方式",
    service: "cme", type: "操作困難", wcag: "3.3.8", task: "介面操作", severity: "block", status: "fixing",
    platform: "Windows 11／Chrome", at: "NVDA", source: "migrated", firstReportedAt: "2023-04-15",
    description: "登入頁的圖形驗證碼沒有語音播放或其他替代方式，視障醫事人員無法自行登入查詢繼續教育積分，換照因此受影響。",
    steps: ["開啟系統登入頁", "以 NVDA 瀏覽至驗證碼欄位", "嘗試取得驗證碼內容"],
    expected: "提供不需辨識圖片的驗證方式，例如語音播放或其他安全的替代驗證。",
    actual: "只能讀到「圖形」，無法得知驗證碼內容，無法完成登入。",
    srLog: "圖形\n編輯 請輸入驗證碼\n按鈕 登入",
    reportedAt: "2026-10-01", assessedAt: "2026-10-02", altProvidedAt: "2026-10-05",
    events: [
      ["2023-04-15", "legacy", "通報人", "於無障礙網路空間服務網申訴（舊制）。回覆：已轉請數位政府司去函要求改善。"],
      ["2026-02-23", "legacy", "通報人", "再次透過服務網申訴（舊制）。"],
      ["2026-03-09", "legacy", "數位發展部", "回覆：已再次去函要求改善。舊制無改善期限，也不公開處理進度。"],
      ["2026-09-20", "legacy", "通報人", "再次登入，障礙仍未排除。"],
      ["2026-10-01", "report", "系統", "自舊申訴專區移轉至本平台，重新立案。"],
      ["2026-10-02", "assess", "數位發展部審查員", "評估為阻斷級：無法自主完成登入與積分查詢。通知衛生福利部於 30 日內修正，並於 3 個工作日內提供替代管道。"],
      ["2026-10-05", "alt", "機關承辦人", "已提供替代管道：專線人工協助查詢積分，不需當事人提供帳號密碼。"],
    ],
  },
  {
    title: "無法全程以鍵盤操作，部分按鈕缺少文字名稱",
    service: "cme", type: "操作困難", wcag: "2.1.1", task: "介面操作", severity: "block", status: "fixing",
    platform: "Windows 11／Firefox", at: "NVDA", source: "migrated", firstReportedAt: "2023-04-15",
    description: "積分查詢流程中的「查詢」與「下一頁」按鈕無法以 Tab 鍵到達，按鈕本身也沒有可讀名稱。",
    steps: ["登入後進入積分查詢頁", "以 Tab 鍵移動焦點", "嘗試啟動查詢按鈕"],
    expected: "所有按鈕都能以鍵盤到達與啟動，並有清楚的名稱。",
    actual: "焦點跳過查詢按鈕；以瀏覽模式讀到時只念「按鈕」。",
    srLog: "按鈕\n按鈕\n表格 0 列",
    reportedAt: "2026-10-01", assessedAt: "2026-10-02", altProvidedAt: "2026-10-05",
    events: [
      ["2026-10-01", "report", "系統", "自舊申訴專區移轉至本平台，重新立案。"],
      ["2026-10-02", "assess", "數位發展部審查員", "評估為阻斷級，通知衛生福利部於 30 日內修正。"],
      ["2026-10-05", "alt", "機關承辦人", "已提供替代管道：專線人工協助查詢積分。"],
    ],
  },
  {
    title: "表單流程無法被螢幕閱讀器正確辨識",
    service: "cme", type: "缺乏語音支援", wcag: "1.3.1", task: "介面操作", severity: "serious", status: "fixing",
    platform: "Windows 11／Chrome", at: "NVDA", source: "migrated", firstReportedAt: "2023-04-15",
    description: "申請表的欄位與說明文字沒有關聯，螢幕閱讀器無法得知每個欄位要填什麼。",
    steps: ["進入換照積分證明申請", "以 NVDA 逐欄瀏覽"],
    expected: "每個欄位都有標籤，說明文字與欄位相互關聯。",
    actual: "只念「編輯」，沒有欄位名稱。",
    srLog: "編輯\n編輯\n下拉式方塊",
    reportedAt: "2026-10-01", assessedAt: "2026-10-02",
    events: [
      ["2026-10-01", "report", "系統", "自舊申訴專區移轉至本平台，重新立案。"],
      ["2026-10-02", "assess", "數位發展部審查員", "評估為嚴重級，通知衛生福利部於 60 日內修正。"],
    ],
  },
  {
    title: "旅程規劃頁的起訖點欄位沒有名稱，無法以 TalkBack 操作",
    service: "tw-std", type: "操作困難", wcag: "4.1.2", task: "介面操作", severity: "block", status: "retest",
    platform: "Android 15", at: "TalkBack",
    description: "標準版的旅程規劃頁中，起點與終點欄位沒有名稱，送出按鈕也無法聚焦，無法規劃轉乘。",
    steps: ["開啟臺北好行標準版", "進入旅程規劃", "以 TalkBack 逐項瀏覽"],
    expected: "欄位念出「起點」「終點」，按鈕可聚焦並啟動。",
    actual: "只念「編輯方塊」，送出按鈕無法聚焦。",
    srLog: "編輯方塊\n編輯方塊\n（無法聚焦送出按鈕）",
    reportedAt: "2026-09-08", assessedAt: "2026-09-09", altProvidedAt: "2026-09-11",
    events: [
      ["2026-09-08", "report", "通報人", "透過本平台通報。"],
      ["2026-09-09", "assess", "數位發展部審查員", "評估為阻斷級，通知臺北市政府交通局於 30 日內修正。"],
      ["2026-09-11", "alt", "機關承辦人", "已提供替代管道：客服專線協助查詢轉乘路線。"],
      ["2026-10-06", "fix", "機關承辦人", "回報已修正：欄位加上名稱並調整焦點順序（模擬版本 5.12）。"],
      ["2026-10-07", "autotest", "系統", "自動回測：未發現欄位缺少名稱，等待使用者實測。"],
    ],
  },
  {
    title: "視障介面缺少旅程規劃、捷運與 YouBike 功能",
    service: "tw-vi", type: "功能落差", wcag: "gap", task: "資訊查找", severity: "serious", status: "fixing", gap: true,
    platform: "Android 15", at: "TalkBack",
    description: "視障介面只提供公車查詢與預約，標準版的旅程規劃、捷運與 YouBike 資訊都沒有；標準版又只能勉強操作。",
    steps: ["開啟 TalkBack 後啟動臺北好行", "比對視障介面與標準版的功能清單"],
    expected: "友善版本提供與標準版相同的核心功能，或標準版本身可以順利使用。",
    actual: "視障介面缺少多數交通資訊，視障者只能放棄或請他人協助。",
    srLog: "路線搜尋 按鈕\n站牌搜尋 按鈕\n我的最愛 按鈕\n預約現況 按鈕",
    reportedAt: "2026-08-20", assessedAt: "2026-08-21",
    events: [
      ["2026-08-20", "report", "通報人", "透過本平台通報。"],
      ["2026-08-21", "assess", "數位發展部審查員", "評估為嚴重級，登錄為功能落差案件，通知臺北市政府交通局於 60 日內改善。"],
      ["2026-09-05", "note", "機關承辦人", "機關回覆：已提供視障介面，標準版暫無改版計畫。"],
      ["2026-09-06", "note", "數位發展部審查員", "審查意見：友善版本不免除標準版的無障礙義務，維持列管。"],
    ],
  },
  {
    title: "偵測到 TalkBack 後強制切換為視障介面，無法選擇標準版",
    service: "tw-vi", type: "操作困難", wcag: "gap", task: "資訊查找", severity: "serious", status: "closed", gap: true,
    platform: "Android 14", at: "TalkBack",
    description: "開啟 TalkBack 後 App 自動進入視障介面，沒有切換回標準版的選項。",
    steps: ["開啟 TalkBack", "啟動臺北好行", "尋找切換版本的設定"],
    expected: "使用者可以自行選擇使用標準版或視障介面。",
    actual: "沒有切換選項。",
    srLog: "視障好行 首頁\n路線搜尋 按鈕",
    reportedAt: "2026-06-10", assessedAt: "2026-06-11", closedAt: "2026-07-25",
    events: [
      ["2026-06-10", "report", "通報人", "透過本平台通報。"],
      ["2026-06-11", "assess", "數位發展部審查員", "評估為嚴重級，登錄為功能落差案件。"],
      ["2026-07-20", "fix", "機關承辦人", "回報已修正：新增「切換至標準版」選項。"],
      ["2026-07-21", "autotest", "系統", "自動回測完成，等待使用者實測。"],
      ["2026-07-25", "pass", "複驗員", "複驗通過：以 TalkBack 確認可以自行切換版本。"],
    ],
  },
  {
    title: "開啟旁白後，首頁項目無法聚焦與操作",
    service: "mrt-std", type: "操作困難", wcag: "4.1.2", task: "介面操作", severity: "block", status: "failed",
    platform: "iPhone／iOS 26", at: "VoiceOver",
    description: "標準版首頁的到站時刻、旅程規劃等卡片在 VoiceOver 下無法聚焦，只能聽到「台北捷運Go」。",
    steps: ["開啟 VoiceOver", "啟動台北捷運Go", "向右滑動瀏覽首頁"],
    expected: "每張卡片都能聚焦並念出內容。",
    actual: "焦點停在標題，無法進入卡片。",
    srLog: "台北捷運Go\n（無其他項目）",
    reportedAt: "2026-08-12", assessedAt: "2026-08-13", altProvidedAt: "2026-08-15",
    events: [
      ["2026-08-12", "report", "通報人", "透過本平台通報。"],
      ["2026-08-13", "assess", "數位發展部審查員", "評估為阻斷級，通知臺北大眾捷運股份有限公司於 30 日內修正。"],
      ["2026-08-15", "alt", "機關承辦人", "已提供替代管道：客服專線協助查詢到站時間。"],
      ["2026-09-10", "fix", "機關承辦人", "回報已修正：首頁元件加入名稱。"],
      ["2026-09-11", "autotest", "系統", "自動回測完成，等待使用者實測。"],
      ["2026-09-15", "fail", "複驗員", "複驗未通過：「到站時刻」卡片仍無法以 VoiceOver 聚焦。退回機關，繼續列管。"],
    ],
  },
  {
    title: "App 購買單程票流程無法以螢幕閱讀器完成付款",
    service: "mrt-std", type: "操作困難", wcag: "4.1.2", task: "結果確認", severity: "block", status: "fixing",
    platform: "iPhone／iOS 26", at: "VoiceOver",
    description: "2026 年 3 月新增的 App 購票功能，選擇票種後的付款按鈕沒有名稱，也無法確認是否購票成功。",
    steps: ["進入購買單程票", "選擇起訖站與張數", "嘗試付款並確認結果"],
    expected: "付款按鈕可辨識，完成後念出購票結果。",
    actual: "付款按鈕只念「按鈕」，付款後沒有任何報讀。",
    srLog: "按鈕\n按鈕\n（付款後無報讀）",
    reportedAt: "2026-09-25", assessedAt: "2026-09-26",
    events: [
      ["2026-09-25", "report", "通報人", "透過本平台通報。"],
      ["2026-09-26", "assess", "數位發展部審查員", "評估為阻斷級，通知臺北大眾捷運股份有限公司於 30 日內修正，並於 3 個工作日內提供替代管道。"],
    ],
  },
  {
    title: "文字模式只提供簡單查詢，缺少購票、票卡與擁擠度",
    service: "mrt-text", type: "功能落差", wcag: "gap", task: "資訊查找", severity: null, status: "new", gap: true,
    platform: "iPhone／iOS 26", at: "VoiceOver",
    description: "文字模式只能查詢路線與到站，標準版的購票、我的票卡與列車擁擠度都沒有，無法取代標準版。",
    steps: ["開啟文字模式", "比對與標準版的功能"],
    expected: "文字模式提供核心功能，或標準版可以順利使用。",
    actual: "多數功能只能回到標準版，但標準版只能勉強操作。",
    srLog: "文字模式\n路線查詢 按鈕\n到站時刻 按鈕",
    reportedAt: "2026-10-19",
    events: [["2026-10-19", "report", "通報人", "透過本平台通報。"]],
  },
  {
    title: "列車擁擠度只用顏色表示",
    service: "mrt-std", type: "資訊不清", wcag: "1.4.1", task: "資訊查找", severity: "normal", status: "closed",
    platform: "Android 15", at: "放大鏡",
    description: "車廂擁擠度只以綠、黃、紅色塊表示，色覺障礙者與螢幕閱讀器使用者無法得知。",
    steps: ["查詢列車到站", "查看擁擠度"],
    expected: "以文字或圖樣標示擁擠程度。",
    actual: "只有色塊。",
    srLog: "圖像\n圖像\n圖像",
    reportedAt: "2026-05-18", assessedAt: "2026-05-20", closedAt: "2026-07-30",
    events: [
      ["2026-05-18", "report", "通報人", "透過本平台通報。"],
      ["2026-05-20", "assess", "數位發展部審查員", "評估為一般級，通知於 90 日內修正。"],
      ["2026-07-24", "fix", "機關承辦人", "回報已修正：擁擠度加上「舒適、尚可、擁擠」文字。"],
      ["2026-07-25", "autotest", "系統", "自動回測完成，等待使用者實測。"],
      ["2026-07-30", "pass", "複驗員", "複驗通過。"],
    ],
  },
  {
    title: "官方網站路線圖沒有文字替代",
    service: "mrt-web", type: "資訊不清", wcag: "1.1.1", task: "資訊查找", severity: "normal", status: "retest",
    platform: "Windows 11／Edge", at: "NVDA",
    description: "官網已取得 AA 標章，但路線圖頁面只有圖片，沒有轉乘站的文字說明。",
    steps: ["開啟官網路網圖頁面", "以 NVDA 瀏覽"],
    expected: "提供路線與轉乘站的文字版本。",
    actual: "只念「路網圖」。",
    srLog: "圖形 路網圖",
    reportedAt: "2026-08-28", assessedAt: "2026-08-29",
    events: [
      ["2026-08-28", "report", "通報人", "透過本平台通報。"],
      ["2026-08-29", "assess", "數位發展部審查員", "評估為一般級，通知於 90 日內修正。"],
      ["2026-10-14", "fix", "機關承辦人", "回報已修正：新增文字版路網與轉乘資訊。"],
      ["2026-10-15", "autotest", "系統", "自動回測完成，等待使用者實測。"],
    ],
  },
  {
    title: "景點圖片沒有文字說明",
    service: "travel", type: "資訊不清", wcag: "1.1.1", task: "資訊查找", severity: "normal", status: "retest",
    platform: "Windows 11／Chrome", at: "NVDA",
    description: "景點介紹頁的照片沒有替代文字，無法得知照片內容。",
    steps: ["開啟任一景點介紹頁", "以 NVDA 瀏覽圖片"],
    expected: "照片有簡短的文字說明。",
    actual: "只念檔名。",
    srLog: "圖形 IMG_2041.jpg",
    reportedAt: "2026-05-22", assessedAt: "2026-05-23",
    events: [
      ["2026-05-22", "report", "通報人", "透過本平台通報。"],
      ["2026-05-23", "assess", "數位發展部審查員", "評估為一般級，通知臺北市政府觀光傳播局於 90 日內修正。"],
      ["2026-08-15", "fix", "機關承辦人", "回報已修正：主要景點照片補上替代文字。"],
      ["2026-08-16", "autotest", "系統", "自動回測完成，等待使用者實測。"],
    ],
  },
  {
    title: "搜尋結果的閱讀順序與畫面不一致",
    service: "ebus", type: "操作困難", wcag: "1.3.2", task: "資訊查找", severity: "normal", status: "fixing",
    platform: "Windows 11／Chrome", at: "NVDA",
    description: "查詢公車路線後，螢幕閱讀器先念出頁尾連結，才念出搜尋結果。",
    steps: ["輸入路線號碼查詢", "以 NVDA 由上往下瀏覽"],
    expected: "依畫面順序先念出搜尋結果。",
    actual: "結果被放在頁尾之後。",
    srLog: "連結 隱私權政策\n連結 網站導覽\n清單 3 項 ...",
    reportedAt: "2026-09-30", assessedAt: "2026-10-02",
    events: [
      ["2026-09-30", "report", "通報人", "透過本平台通報。"],
      ["2026-10-02", "assess", "數位發展部審查員", "評估為一般級，通知臺北市公共運輸處於 90 日內修正。"],
    ],
  },
  {
    title: "聊天室訊息內容無法被螢幕閱讀器讀取",
    service: "line-pc", type: "缺乏語音支援", wcag: "4.1.2", task: "資訊查找", severity: "block", status: "fixing",
    platform: "Windows 11", at: "NVDA",
    description: "電腦版聊天室的訊息清單沒有提供可讀內容，螢幕閱讀器無法讀取訊息與寄件人。里辦公處等公共通知也透過此管道發送。",
    steps: ["開啟 LINE 電腦版", "進入任一聊天室", "以 NVDA 瀏覽訊息"],
    expected: "可以逐則讀到寄件人、時間與訊息內容。",
    actual: "只念「清單」，沒有任何訊息內容。",
    srLog: "清單\n（無項目可讀）",
    reportedAt: "2026-07-02", assessedAt: "2026-07-03", altProvidedAt: "2026-07-08",
    events: [
      ["2026-07-02", "report", "通報人", "透過本平台通報。"],
      ["2026-07-03", "assess", "數位發展部審查員", "評估為阻斷級。民間企業自願登錄，過渡期期限為建議期限。"],
      ["2026-07-08", "alt", "企業窗口", "企業回覆：建議改用手機版 App 搭配 TalkBack 或 VoiceOver。"],
      ["2026-08-15", "note", "企業窗口", "企業回覆：已列入改善規劃。"],
    ],
  },
  {
    title: "官方帳號推播的公共通知無法閱讀",
    service: "line-pc", type: "資訊不清", wcag: "1.1.1", task: "文件閱讀", severity: "serious", status: "fixing",
    platform: "Windows 11", at: "NVDA",
    description: "里辦公處與公所透過官方帳號發送的公告多為圖片，電腦版也無法讀取文字訊息，視障者無法得知公共資訊。",
    steps: ["加入里辦公處官方帳號", "開啟最新公告"],
    expected: "公告提供文字內容或替代管道。",
    actual: "無法讀取。",
    srLog: "（無項目可讀）",
    reportedAt: "2026-09-18", assessedAt: "2026-09-19",
    events: [
      ["2026-09-18", "report", "通報人", "透過本平台通報。"],
      ["2026-09-19", "assess", "數位發展部審查員", "評估為嚴重級。另建議發布公告的機關同步提供網頁或簡訊等等效管道。"],
    ],
  },
  {
    title: "設定中部分切換開關的報讀名稱與畫面文字不一致",
    service: "win11", type: "資訊不清", wcag: "2.5.3", task: "介面操作", severity: "normal", status: "closed",
    platform: "Windows 11", at: "NVDA",
    description: "設定頁部分切換開關念出的名稱與畫面文字不同，語音控制使用者無法以畫面文字啟動。",
    steps: ["開啟設定", "以 NVDA 瀏覽切換開關"],
    expected: "報讀名稱包含畫面上的文字。",
    actual: "名稱與畫面文字不一致。",
    srLog: "切換按鈕 開啟 ToggleSwitch1",
    reportedAt: "2026-06-03", assessedAt: "2026-06-04", closedAt: "2026-08-12",
    events: [
      ["2026-06-03", "report", "通報人", "透過本平台通報。"],
      ["2026-06-04", "assess", "數位發展部審查員", "評估為一般級。民間企業自願登錄，期限為建議期限。"],
      ["2026-08-05", "fix", "企業窗口", "企業回報已於更新中修正。"],
      ["2026-08-06", "autotest", "系統", "自動回測完成，等待使用者實測。"],
      ["2026-08-12", "pass", "複驗員", "複驗通過。"],
    ],
  },
  {
    title: "小工具面板的卡片無法以鍵盤逐一瀏覽",
    service: "win11", type: "操作困難", wcag: "2.1.1", task: "介面操作", severity: "serious", status: "retest",
    platform: "Windows 11", at: "NVDA",
    description: "開啟小工具面板後，部分卡片無法以 Tab 或方向鍵到達。",
    steps: ["按 Windows 鍵加 W", "以 Tab 與方向鍵瀏覽"],
    expected: "每張卡片都能以鍵盤到達。",
    actual: "焦點跳過部分卡片。",
    srLog: "小工具\n（略過兩張卡片）",
    reportedAt: "2026-08-25", assessedAt: "2026-08-26",
    events: [
      ["2026-08-25", "report", "通報人", "透過本平台通報。"],
      ["2026-08-26", "assess", "數位發展部審查員", "評估為嚴重級。民間企業自願登錄，期限為建議期限。"],
      ["2026-10-12", "fix", "企業窗口", "企業回報已修正。"],
      ["2026-10-13", "autotest", "系統", "自動回測完成，等待使用者實測。"],
    ],
  },
  {
    title: "登入需辨識圖形驗證碼，沒有替代方式",
    service: "bank-app", type: "操作困難", wcag: "3.3.8", task: "介面操作", severity: "block", status: "fixing",
    platform: "Android 15", at: "TalkBack",
    description: "網路銀行 App 登入時要求辨識扭曲文字圖片，沒有語音或其他驗證方式。",
    steps: ["開啟 App", "輸入帳號密碼", "進行圖形驗證"],
    expected: "提供不依賴認知測試的驗證方式。",
    actual: "無法完成登入。",
    srLog: "圖像\n編輯方塊 驗證碼",
    reportedAt: "2026-10-08", assessedAt: "2026-10-09",
    events: [
      ["2026-10-08", "report", "通報人", "透過本平台通報。"],
      ["2026-10-09", "assess", "數位發展部審查員", "評估為阻斷級。民間企業自願登錄，期限為建議期限。"],
    ],
  },
  {
    title: "結帳按鈕沒有可讀名稱",
    service: "shop-web", type: "缺乏語音支援", wcag: "4.1.2", task: "結果確認", severity: "serious", status: "closed",
    platform: "Windows 11／Chrome", at: "NVDA",
    description: "購物車頁的結帳按鈕只有圖示，螢幕閱讀器只念「按鈕」。",
    steps: ["加入商品至購物車", "前往結帳"],
    expected: "按鈕念出「前往結帳」。",
    actual: "只念「按鈕」。",
    srLog: "按鈕",
    reportedAt: "2026-07-14", assessedAt: "2026-07-15", closedAt: "2026-08-20",
    events: [
      ["2026-07-14", "report", "通報人", "透過本平台通報。"],
      ["2026-07-15", "assess", "數位發展部審查員", "評估為嚴重級。民間企業自願登錄，期限為建議期限。"],
      ["2026-08-14", "fix", "企業窗口", "企業回報已修正。"],
      ["2026-08-15", "autotest", "系統", "自動回測完成，等待使用者實測。"],
      ["2026-08-20", "pass", "複驗員", "複驗通過。"],
    ],
  },
];

// ---------- 其餘模擬案件 ----------
const TEMPLATES = [
  ["按鈕缺少可讀名稱，只念出「按鈕」", "缺乏語音支援", "4.1.2", "介面操作"],
  ["圖片沒有替代文字", "資訊不清", "1.1.1", "資訊查找"],
  ["表單錯誤訊息沒有被報讀", "缺乏語音支援", "3.3.1", "介面操作"],
  ["焦點順序混亂，無法依序操作", "操作困難", "2.4.3", "介面操作"],
  ["彈出視窗無法以鍵盤關閉", "操作困難", "2.1.2", "介面操作"],
  ["文字與背景對比不足，低視能者難以閱讀", "資訊不清", "1.4.3", "資訊查找"],
  ["放大至 200% 後內容被截斷", "資訊不清", "1.4.4", "資訊查找"],
  ["狀態更新沒有被報讀", "缺乏語音支援", "4.1.3", "結果確認"],
  ["需要滑動手勢才能操作，沒有替代方式", "操作困難", "2.5.1", "介面操作"],
  ["觸控目標太小，容易誤觸", "操作困難", "2.5.8", "介面操作"],
  ["下載的說明文件是掃描影像，無法閱讀", "資訊不清", "1.1.1", "文件閱讀"],
  ["連結文字只寫「點此」，無法判斷目的", "資訊不清", "2.4.4", "資訊查找"],
  ["頁面標題沒有標記為標題，無法快速瀏覽", "其他", "1.3.1", "資訊查找"],
  ["操作逾時前沒有提醒，也無法延長", "其他", "2.2.1", "結果確認"],
];
const GAP_TEMPLATES = [
  ["友善版本缺少標準版的查詢功能", "功能落差", "gap", "資訊查找"],
  ["友善版本的資訊未與標準版同步更新", "功能落差", "gap", "資訊查找"],
];
const FILLER_SERVICES = ["cme", "tw-std", "tw-std", "tw-vi", "mrt-std", "mrt-std", "mrt-text", "mrt-web", "travel", "travel", "ebus", "ebus", "bank-app", "shop-web"];
const AT_BY_CHANNEL = {
  "網站": [["Windows 11／Chrome", "NVDA"], ["Windows 11／Edge", "JAWS"], ["macOS／Safari", "VoiceOver"], ["Windows 11／Chrome", "螢幕放大"]],
  "App": [["Android 15", "TalkBack"], ["iPhone／iOS 26", "VoiceOver"], ["Android 15", "放大手勢"]],
  "桌面應用程式": [["Windows 11", "NVDA"], ["Windows 11", "JAWS"]],
};

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}
function diff(a, b) {
  const pa = a.split("-").map(Number), pb = b.split("-").map(Number);
  return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
}
const SEV_DAYS = { block: 30, serious: 60, normal: 90 };
const BASE = "2026-10-21";

function genFiller(count) {
  const r = rng(20261021);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const out = [];
  for (let i = 0; i < count; i++) {
    const sid = pick(FILLER_SERVICES);
    const svc = SERVICES.find((s) => s.id === sid);
    const tpl = svc.edition === "友善版本" && r() < 0.6 ? pick(GAP_TEMPLATES) : pick(TEMPLATES);
    const [platform, at] = pick(AT_BY_CHANNEL[svc.channel] || AT_BY_CHANNEL["網站"]);
    const reportedAt = i >= count - 5 ? addDays(BASE, -1 - Math.floor(r() * 9)) : addDays("2026-05-01", Math.floor(r() * 172));
    const age = diff(reportedAt, BASE);
    const sevRoll = r();
    const severity = sevRoll < 0.18 ? "block" : sevRoll < 0.55 ? "serious" : "normal";
    const c = {
      title: tpl[0], service: sid, type: tpl[1], wcag: tpl[2], task: tpl[3], severity, gap: tpl[1] === "功能落差",
      platform, at, description: `${svc.name}：${tpl[0]}。`, steps: ["開啟服務", "以輔助科技操作相關功能"],
      expected: "可以使用輔助科技完成操作。", actual: tpl[0] + "。", srLog: "", reportedAt, events: [],
    };
    const ev = (d, kind, actor, text) => c.events.push([d, kind, actor, text]);
    ev(reportedAt, "report", "通報人", "透過本平台通報。");
    if (age < 12 && r() < 0.55) { c.status = "new"; c.severity = null; out.push(c); continue; }
    const assessedAt = addDays(reportedAt, 1 + Math.floor(r() * 3));
    c.assessedAt = assessedAt;
    const label = { block: "阻斷級", serious: "嚴重級", normal: "一般級" }[severity];
    ev(assessedAt, "assess", "數位發展部審查員", `評估為${label}，通知負責單位於 ${SEV_DAYS[severity]} 日內修正。`);
    if (severity === "block" && r() < 0.85) {
      c.altProvidedAt = addDays(assessedAt, 1 + Math.floor(r() * 3));
      ev(c.altProvidedAt, "alt", "機關承辦人", "已提供替代管道：客服專線協助。");
    }
    const due = addDays(assessedAt, SEV_DAYS[severity]);
    // 是否已回報修正
    const fixAt = addDays(assessedAt, Math.floor(SEV_DAYS[severity] * (0.15 + r() * (r() < 0.12 ? 1.3 : 0.75))));
    if (diff(fixAt, BASE) < 0 || r() < 0.05) { c.status = "fixing"; out.push(c); continue; }
    ev(fixAt, "fix", "機關承辦人", "回報已修正。");
    ev(addDays(fixAt, 1), "autotest", "系統", "自動回測完成，等待使用者實測。");
    const retestAt = addDays(fixAt, 2 + Math.floor(r() * 4));
    if (diff(retestAt, BASE) < 0) { c.status = "retest"; out.push(c); continue; }
    if (r() < 0.16) {
      ev(retestAt, "fail", "複驗員", "複驗未通過：問題仍可重現。退回機關，繼續列管。");
      const fix2 = addDays(retestAt, 8 + Math.floor(r() * 20));
      if (diff(fix2, BASE) < 2 || r() < 0.4) { c.status = "failed"; out.push(c); continue; }
      ev(fix2, "fix", "機關承辦人", "再次回報已修正。");
      ev(addDays(fix2, 1), "autotest", "系統", "自動回測完成，等待使用者實測。");
      const re2 = addDays(fix2, 3);
      if (diff(re2, BASE) < 0) { c.status = "retest"; out.push(c); continue; }
      ev(re2, "pass", "複驗員", "複驗通過。");
      c.status = "closed"; c.closedAt = re2; out.push(c); continue;
    }
    ev(retestAt, "pass", "複驗員", "複驗通過。");
    c.status = "closed"; c.closedAt = retestAt;
    void due;
    out.push(c);
  }
  return out;
}

export function buildSeedCases() {
  const all = [...KEY_CASES.map((c) => ({ ...c })), ...genFiller(58)];
  all.sort((a, b) => (a.reportedAt < b.reportedAt ? -1 : a.reportedAt > b.reportedAt ? 1 : 0));
  return all.map((c, i) => {
    const svc = SERVICES.find((s) => s.id === c.service);
    const id = `A11Y-2026-${String(i + 1).padStart(4, "0")}`;
    const events = c.events.map(([date, kind, actor, text]) => ({ date, kind, actor, text }));
    return {
      id, title: c.title, service: c.service, agency: svc.agency, type: c.type, wcag: c.wcag, task: c.task,
      severity: c.severity, status: c.status, gap: !!c.gap, platform: c.platform, at: c.at,
      source: c.source || "platform", firstReportedAt: c.firstReportedAt || null,
      description: c.description, steps: c.steps || [], expected: c.expected || "", actual: c.actual || "", srLog: c.srLog || "",
      reportedAt: c.reportedAt, assessedAt: c.assessedAt || null, altProvidedAt: c.altProvidedAt || null,
      closedAt: c.closedAt || null, publicConsent: true, events,
    };
  });
}
