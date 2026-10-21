/* 自動產生的檔案，請勿直接修改。原始碼在 assets/js/src，修改後執行 python tools/bundle.py */
(function () {
"use strict";
const __m = {};
const __pages = {};
__m.data = (function () {
// 模擬資料：機關、服務與案件。所有內容皆為模擬，部分情境參考公開報導。
const SEED_VERSION = "2026-10-21-v1";

const AGENCIES = [
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

const SERVICES = [
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

const WCAG = {
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

function buildSeedCases() {
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

return { SEED_VERSION, AGENCIES, SERVICES, WCAG, buildSeedCases };
})();
__m.store = (function () {
// 資料存取、日期計算與模擬身分。資料只存在使用者自己的瀏覽器。
const { AGENCIES, SERVICES, WCAG, SEED_VERSION, buildSeedCases } = __m.data;


const KEY_CASES = "a11ytrack:cases";
const KEY_VERSION = "a11ytrack:version";
const KEY_ROLE = "a11ytrack:role";
let memory = null; // 瀏覽器不允許儲存時的備援
let storageOk = true;

function readStorage(key) {
  try { return window.localStorage.getItem(key); } catch { storageOk = false; return null; }
}
function writeStorage(key, value) {
  try { window.localStorage.setItem(key, value); return true; } catch { storageOk = false; return false; }
}
function storageAvailable() { readStorage(KEY_VERSION); return storageOk; }

function loadCases() {
  if (memory) return memory;
  const ver = readStorage(KEY_VERSION);
  const raw = readStorage(KEY_CASES);
  if (ver === SEED_VERSION && raw) {
    try { memory = JSON.parse(raw); return memory; } catch { /* 重新建立 */ }
  }
  memory = buildSeedCases();
  saveCases(memory);
  writeStorage(KEY_VERSION, SEED_VERSION);
  return memory;
}
function saveCases(cases) {
  memory = cases;
  writeStorage(KEY_CASES, JSON.stringify(cases));
}
function resetData() {
  memory = buildSeedCases();
  saveCases(memory);
  writeStorage(KEY_VERSION, SEED_VERSION);
}
function getCase(id) { return loadCases().find((c) => c.id === id) || null; }
function updateCase(id, fn) {
  const cases = loadCases();
  const c = cases.find((x) => x.id === id);
  if (!c) return null;
  fn(c);
  saveCases(cases);
  return c;
}
function addCase(data) {
  const cases = loadCases();
  const year = today().slice(0, 4);
  const nums = cases.map((c) => Number(c.id.split("-")[2]) || 0);
  const id = `A11Y-${year}-${String(Math.max(0, ...nums) + 1).padStart(4, "0")}`;
  const svc = serviceById(data.service);
  const c = {
    id, severity: null, status: "new", gap: false, source: "platform", firstReportedAt: null,
    assessedAt: null, altProvidedAt: null, closedAt: null, srLog: "", events: [],
    ...data, agency: svc ? svc.agency : data.agency,
  };
  c.events.push({ date: today(), kind: "report", actor: "通報人", text: "透過本平台通報。" });
  cases.push(c);
  saveCases(cases);
  return c;
}

// ---------- 模擬身分 ----------
const ROLES = {
  public: "民眾",
  reviewer: "數位發展部審查員",
  agency: "機關承辦人",
  tester: "複驗員",
};
function getRole() {
  const raw = readStorage(KEY_ROLE);
  try { const r = JSON.parse(raw); if (r && ROLES[r.role]) return r; } catch { /* 預設 */ }
  return { role: "public", agency: "dot" };
}
function setRole(role, agency) { writeStorage(KEY_ROLE, JSON.stringify({ role, agency })); }
function roleLabel(r = getRole()) {
  return r.role === "agency" ? `${ROLES.agency}（${agencyById(r.agency)?.name || ""}）` : ROLES[r.role];
}

// ---------- 查表 ----------
function serviceById(id) { return SERVICES.find((s) => s.id === id) || null; }
function agencyById(id) { return AGENCIES.find((a) => a.id === id) || null; }
const AGENCY_TYPE = { gov: "政府機關", soe: "公營事業", private: "民間企業（示範）" };
const STATUS = {
  new: "待評估",
  fixing: "改善中",
  retest: "待複驗",
  failed: "複驗未通過（列管中）",
  closed: "已結案",
};
const STATUS_ORDER = ["new", "fixing", "retest", "failed", "closed"];
const SEVERITY = { block: "阻斷", serious: "嚴重", normal: "一般" };
const SEVERITY_DESC = {
  block: "無法自主完成任務",
  serious: "需他人協助或改走其他管道",
  normal: "可完成，但明顯耗時或容易出錯",
};
const SEV_DAYS = { block: 30, serious: 60, normal: 90 };
const TYPES = ["操作困難", "資訊不清", "缺乏語音支援", "功能落差", "其他"];
const TASKS = ["資訊查找", "文件閱讀", "介面操作", "結果確認"];
function wcagLabel(code) {
  if (!code) return "未指定";
  if (code === "gap") return WCAG.gap;
  return `${code} ${WCAG[code] || ""}`.trim();
}

// ---------- 日期 ----------
function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function toUTC(iso) { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); }
function addDays(iso, n) { return new Date(toUTC(iso) + n * 86400000).toISOString().slice(0, 10); }
function addWorkdays(iso, n) {
  let d = iso, left = n;
  while (left > 0) {
    d = addDays(d, 1);
    const wd = new Date(toUTC(d)).getUTCDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return d;
}
function diffDays(a, b) { return Math.round((toUTC(b) - toUTC(a)) / 86400000); }
function fmt(iso) { return iso ? iso.replace(/-/g, "/") : "—"; }

// ---------- 推導欄位 ----------
function dueAt(c) { return c.assessedAt && c.severity ? addDays(c.assessedAt, SEV_DAYS[c.severity]) : null; }
function altDueAt(c) { return c.assessedAt && c.severity === "block" ? addWorkdays(c.assessedAt, 3) : null; }
function isOpen(c) { return c.status !== "closed"; }
function overdueDays(c) {
  const due = dueAt(c);
  if (!isOpen(c) || !due) return 0;
  const n = diffDays(due, today());
  return n > 0 ? n : 0;
}
function altOverdueDays(c) {
  const due = altDueAt(c);
  if (!isOpen(c) || !due || c.altProvidedAt) return 0;
  const n = diffDays(due, today());
  return n > 0 ? n : 0;
}
function daysLeft(c) { const due = dueAt(c); return due ? diffDays(today(), due) : null; }
function isPrivate(c) { return agencyById(c.agency)?.type === "private"; }
function fixDays(c) { return c.closedAt && c.assessedAt ? diffDays(c.assessedAt, c.closedAt) : null; }
function retestCounts(cases) {
  let pass = 0, fail = 0;
  cases.forEach((c) => c.events.forEach((e) => { if (e.kind === "pass") pass++; if (e.kind === "fail") fail++; }));
  return { pass, fail, total: pass + fail };
}

return { AGENCIES, SERVICES, WCAG, storageAvailable, loadCases, saveCases, resetData, getCase, updateCase, addCase, ROLES, getRole, setRole, roleLabel, serviceById, agencyById, AGENCY_TYPE, STATUS, STATUS_ORDER, SEVERITY, SEVERITY_DESC, SEV_DAYS, TYPES, TASKS, wcagLabel, today, addDays, addWorkdays, diffDays, fmt, dueAt, altDueAt, isOpen, overdueDays, altOverdueDays, daysLeft, isPrivate, fixDays, retestCounts };
})();
__m.ui = (function () {
// 共用介面元件。所有使用者輸入一律以文字節點插入，不使用 innerHTML。
const { STATUS, SEVERITY, getRole, roleLabel, resetData, storageAvailable, overdueDays, altOverdueDays, isPrivate } = __m.store;

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, String(v));
  }
  for (const ch of children.flat()) {
    if (ch === null || ch === undefined || ch === false) continue;
    el.append(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

const SVG_NS = "http://www.w3.org/2000/svg";
function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) el.setAttribute(k, String(v));
  for (const ch of children.flat()) {
    if (ch === null || ch === undefined) continue;
    el.append(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

function statusChip(c) {
  return h("span", { class: `chip status-${c.status}` }, STATUS[c.status]);
}
function severityChip(c) {
  if (!c.severity) return h("span", { class: "chip sev-none" }, "未分級");
  return h("span", { class: `chip sev-${c.severity}` }, SEVERITY[c.severity]);
}
function overdueTag(c) {
  const n = overdueDays(c);
  const alt = altOverdueDays(c);
  const frag = document.createDocumentFragment();
  if (n > 0) frag.append(h("span", { class: "tag-overdue" }, isPrivate(c) ? `超過建議期限 ${n} 天` : `已逾期 ${n} 天`));
  if (alt > 0) frag.append(h("span", { class: "tag-overdue" }, `替代管道逾期 ${alt} 天`));
  return frag;
}

let liveTimer = null;
function announce(message) {
  const live = document.getElementById("live");
  if (!live) return;
  live.textContent = "";
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => { live.textContent = message; }, 120);
}

function focusEl(el) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus();
}

function param(name) { return new URLSearchParams(window.location.search).get(name); }

// 跨頁訊息：例如重設資料後重新載入，在主內容最上方顯示並取得焦點
function flash(message) {
  try { window.sessionStorage.setItem("a11ytrack:flash", message); } catch { /* 忽略 */ }
}
function showFlash() {
  let msg = null;
  try { msg = window.sessionStorage.getItem("a11ytrack:flash"); window.sessionStorage.removeItem("a11ytrack:flash"); } catch { /* 忽略 */ }
  if (!msg) return;
  const main = document.getElementById("main");
  const box = h("div", { class: "notice notice-success", id: "flash", tabindex: "-1" }, h("p", {}, msg));
  main.prepend(box);
  const go = () => setTimeout(() => box.focus(), 0);
  if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
}

function initResetDialog() {
  const btn = document.getElementById("reset-btn");
  const dlg = document.getElementById("reset-dialog");
  if (!btn || !dlg || typeof dlg.showModal !== "function") return;
  const cancel = dlg.querySelector("[data-cancel]");
  const confirm = dlg.querySelector("[data-confirm]");
  btn.addEventListener("click", () => { dlg.showModal(); cancel.focus(); });
  cancel.addEventListener("click", () => dlg.close());
  confirm.addEventListener("click", () => {
    resetData();
    dlg.close();
    flash("模擬資料已重設為初始狀態。");
    window.location.reload();
  });
  dlg.addEventListener("close", () => btn.focus());
}

function initCommon() {
  const r = getRole();
  const roleEl = document.getElementById("role-name");
  if (roleEl) roleEl.textContent = roleLabel(r);
  if (!storageAvailable()) {
    const main = document.getElementById("main");
    main.prepend(h("div", { class: "notice notice-warn" }, h("p", {}, "此瀏覽器不允許儲存資料，模擬操作在離開頁面後不會保留。")));
  }
  initResetDialog();
  showFlash();
}

function caseLink(c) {
  return h("a", { href: `case.html?id=${encodeURIComponent(c.id)}` }, c.id);
}

// 可捲動的資料表容器：鍵盤可聚焦，並有名稱
let capId = 0;
function tableRegion(label, table) {
  const cap = table.querySelector("caption");
  if (cap) {
    if (!cap.id) cap.id = `tcap-${++capId}`;
    return h("div", { class: "table-wrap", role: "region", "aria-labelledby": cap.id, tabindex: "0" }, table);
  }
  return h("div", { class: "table-wrap", role: "region", "aria-label": label, tabindex: "0" }, table);
}

function downloadCSV(filename, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

return { h, svg, statusChip, severityChip, overdueTag, announce, focusEl, param, flash, initCommon, caseLink, tableRegion, downloadCSV };
})();
__m.forms = (function () {
// 表單驗證：錯誤訊息以 aria-describedby 連結欄位，送出時焦點移到錯誤摘要
const { h } = __m.ui;

function addDescribedBy(el, id) {
  const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
  if (!ids.includes(id)) el.setAttribute("aria-describedby", [id, ...ids].join(" "));
}
function removeDescribedBy(el, id) {
  const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter((x) => x && x !== id);
  if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
  else el.removeAttribute("aria-describedby");
}

function clearError(target) {
  const id = `${target.id}-error`;
  document.getElementById(id)?.remove();
  removeDescribedBy(target, id);
  target.removeAttribute("aria-invalid");
}

function clearErrors(form) {
  form.querySelectorAll(".error-msg").forEach((e) => e.remove());
  form.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
  form.querySelectorAll("[aria-describedby]").forEach((e) => {
    const ids = e.getAttribute("aria-describedby").split(/\s+/).filter((x) => x && !x.endsWith("-error"));
    if (ids.length) e.setAttribute("aria-describedby", ids.join(" "));
    else e.removeAttribute("aria-describedby");
  });
}

// target：輸入欄位，或一組選項的 fieldset
function setError(target, message) {
  const id = `${target.id}-error`;
  document.getElementById(id)?.remove();
  const msg = h("span", { class: "error-msg", id }, message);
  if (target.tagName === "FIELDSET") {
    target.querySelector("legend").after(msg);
    addDescribedBy(target, id);
  } else {
    target.before(msg);
    target.setAttribute("aria-invalid", "true");
    addDescribedBy(target, id);
  }
}

// errors: [{ target, focus, message, label }]
function showSummary(box, errors) {
  box.replaceChildren(
    h("h2", {}, `有 ${errors.length} 個欄位需要修正`),
    h("ul", {}, errors.map((e) => h("li", {},
      h("a", { href: `#${e.focus.id}`, onclick: (ev) => { ev.preventDefault(); e.focus.focus(); } }, `${e.label}：${e.message}`)))),
  );
  box.hidden = false;
  box.focus();
}

function hideSummary(box) { box.hidden = true; box.replaceChildren(); }

// 動作表單用：沒有摘要時，直接把焦點移到第一個錯誤欄位
function focusFirst(errors) { if (errors.length) errors[0].focus.focus(); }

function checkedValue(form, name) {
  const el = form.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

return { clearError, clearErrors, setError, showSummary, hideSummary, focusFirst, checkedValue };
})();
__m.charts = (function () {
// 無障礙圖表：SVG 以 role="img" 提供名稱與摘要，並一律附上資料表。
// 顏色之外另以標記形狀、線型與文字標示區分資料系列。
// 圖表依容器的實際寬度繪製，文字維持真實像素大小，不會因縮放而變小。
const { h, svg, tableRegion } = __m.ui;

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

function dataTable(caption, headers, rows) {
  const table = h("table", { class: "data-table" },
    h("caption", {}, caption),
    h("thead", {}, h("tr", {}, headers.map((t, i) => h("th", { scope: "col", class: i ? "num" : null }, t)))),
    h("tbody", {}, rows.map((r) => h("tr", {}, r.map((v, i) => (i === 0 ? h("th", { scope: "row" }, v) : h("td", { class: "num" }, v)))))),
  );
  return h("details", { class: "chart-data" }, h("summary", {}, "以表格檢視資料"), tableRegion(caption, table));
}

function card(title, summary, drawSvg, table, extra) {
  const tid = nextId("chart-title");
  const did = nextId("chart-desc");
  const holder = h("div", { class: "chart-holder" });
  let lastW = 0;
  const draw = (w) => {
    w = Math.max(240, Math.floor(w));
    if (Math.abs(w - lastW) < 6) return;
    lastW = w;
    const s = drawSvg(w);
    s.setAttribute("role", "img");
    s.setAttribute("aria-labelledby", `${tid} ${did}`);
    s.setAttribute("focusable", "false");
    holder.replaceChildren(s);
  };
  draw(520);
  if ("ResizeObserver" in window) {
    new ResizeObserver((entries) => { for (const e of entries) draw(e.contentRect.width); }).observe(holder);
  }
  return h("section", { class: "chart-card" },
    h("h3", { id: tid }, title),
    h("p", { id: did, class: "chart-summary" }, summary),
    holder,
    extra || null,
    table,
  );
}

// 水平長條圖：寬度不足時，標籤改放在長條上方
function barChart({ title, items, unit = "件" }) {
  const max = Math.max(1, ...items.map((d) => d.value));
  const draw = (width) => {
    const stacked = width < 440;
    const rowH = stacked ? 54 : 40;
    const left = stacked ? 0 : 160;
    const right = 52;
    const height = items.length * rowH + 12;
    const g = svg("svg", { viewBox: `0 0 ${width} ${height}`, width, height, class: "chart chart-bar" });
    items.forEach((d, i) => {
      const y = 6 + i * rowH;
      const w = Math.max(2, ((width - left - right) * d.value) / max);
      const barY = stacked ? y + 24 : y + 6;
      const barH = stacked ? 22 : rowH - 14;
      g.append(
        stacked
          ? svg("text", { x: 0, y: y + 14, class: "axis-label" }, d.label)
          : svg("text", { x: left - 10, y: y + rowH / 2, class: "axis-label", "text-anchor": "end", "dominant-baseline": "middle" }, d.label),
        svg("rect", { x: left, y: barY, width: w, height: barH, class: "bar series-1", rx: 4 }),
        svg("text", { x: left + w + 8, y: barY + barH / 2, class: "value-label", "dominant-baseline": "middle" }, `${d.value}`),
      );
    });
    return g;
  };
  const summary = items.map((d) => `${d.label} ${d.value} ${unit}`).join("、") + "。";
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["項目", `數量（${unit}）`], items.map((d) => [d.label, d.value])));
}

const MARKERS = ["circle", "square", "triangle", "diamond"];
function marker(kind, x, y, cls) {
  const s = 5;
  if (kind === "square") return svg("rect", { x: x - s, y: y - s, width: s * 2, height: s * 2, class: cls });
  if (kind === "triangle") return svg("polygon", { points: `${x},${y - s - 1} ${x + s + 1},${y + s} ${x - s - 1},${y + s}`, class: cls });
  if (kind === "diamond") return svg("polygon", { points: `${x},${y - s - 1} ${x + s + 1},${y} ${x},${y + s + 1} ${x - s - 1},${y}`, class: cls });
  return svg("circle", { cx: x, cy: y, r: s, class: cls });
}

// 折線圖：多系列
function lineChart({ title, categories, series, unit = "件" }) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const step = Math.ceil(max / 5 / 5) * 5 || 1;
  const yMax = step * 5;
  const draw = (width) => {
    const height = Math.round(Math.min(320, Math.max(230, width * 0.55)));
    const left = 40, right = 16, top = 14, bottom = 34;
    const x = (i) => left + (i * (width - left - right)) / Math.max(1, categories.length - 1);
    const y = (v) => top + (height - top - bottom) * (1 - v / yMax);
    const g = svg("svg", { viewBox: `0 0 ${width} ${height}`, width, height, class: "chart chart-line" });
    for (let t = 0; t <= 5; t++) {
      const v = step * t;
      g.append(svg("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), class: "grid" }),
        svg("text", { x: left - 8, y: y(v), class: "axis-label small", "text-anchor": "end", "dominant-baseline": "middle" }, v));
    }
    categories.forEach((c, i) => g.append(svg("text", { x: x(i), y: height - 10, class: "axis-label small", "text-anchor": "middle" }, c)));
    series.forEach((s, si) => {
      g.append(svg("polyline", { points: s.values.map((v, i) => `${x(i)},${y(v)}`).join(" "), class: `line series-${si + 1} dash-${si + 1}`, fill: "none" }));
      s.values.forEach((v, i) => g.append(marker(MARKERS[si % 4], x(i), y(v), `marker series-${si + 1}`)));
    });
    return g;
  };
  const legend = h("ul", { class: "legend" }, series.map((s, si) => {
    const sw = svg("svg", { viewBox: "0 0 36 14", width: 36, height: 14, "aria-hidden": "true", focusable: "false" },
      svg("line", { x1: 2, x2: 34, y1: 7, y2: 7, class: `line series-${si + 1} dash-${si + 1}` }),
      marker(MARKERS[si % 4], 18, 7, `marker series-${si + 1}`));
    return h("li", {}, sw, s.name);
  }));
  const last = categories.length - 1;
  const summary = `${categories[0]}至${categories[last]}。` + series.map((s) => `${s.name}由 ${s.values[0]} ${unit}變為 ${s.values[last]} ${unit}`).join("；") + "。";
  const rows = categories.map((c, i) => [c, ...series.map((s) => s.values[i])]);
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["月份", ...series.map((s) => s.name)], rows), legend);
}

// 環圈圖：區塊之間以背景色分隔，圖例附數值與百分比
function donutChart({ title, items, unit = "件" }) {
  const size = 240, r = 100, inner = 62, cx = size / 2, cy = size / 2;
  const total = items.reduce((a, d) => a + d.value, 0) || 1;
  const draw = () => {
    const g = svg("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, class: "chart chart-donut" });
    let angle = -Math.PI / 2;
    items.forEach((d, i) => {
      if (!d.value) return;
      const a2 = angle + (2 * Math.PI * d.value) / total;
      const large = a2 - angle > Math.PI ? 1 : 0;
      const p = (rad, rr) => `${cx + rr * Math.cos(rad)},${cy + rr * Math.sin(rad)}`;
      const path = d.value === total
        ? `M ${p(0, r)} A ${r} ${r} 0 1 1 ${p(Math.PI, r)} A ${r} ${r} 0 1 1 ${p(0, r)} Z M ${p(0, inner)} A ${inner} ${inner} 0 1 0 ${p(Math.PI, inner)} A ${inner} ${inner} 0 1 0 ${p(0, inner)} Z`
        : `M ${p(angle, r)} A ${r} ${r} 0 ${large} 1 ${p(a2, r)} L ${p(a2, inner)} A ${inner} ${inner} 0 ${large} 0 ${p(angle, inner)} Z`;
      g.append(svg("path", { d: path, class: `slice series-${i + 1}` }));
      angle = a2;
    });
    g.append(svg("text", { x: cx, y: cy - 4, class: "donut-total", "text-anchor": "middle" }, total),
      svg("text", { x: cx, y: cy + 20, class: "axis-label small", "text-anchor": "middle" }, unit));
    return g;
  };
  const pct = (v) => `${Math.round((v / total) * 1000) / 10}%`;
  const legend = h("ul", { class: "legend legend-values" }, items.map((d, i) => h("li", {},
    svg("svg", { viewBox: "0 0 14 14", width: 14, height: 14, "aria-hidden": "true", focusable: "false" }, svg("rect", { x: 1, y: 1, width: 12, height: 12, class: `slice series-${i + 1}` })),
    `${d.label}：${d.value} ${unit}（${pct(d.value)}）`)));
  const summary = `共 ${total} ${unit}。` + items.map((d) => `${d.label} ${pct(d.value)}`).join("、") + "。";
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["類型", `數量（${unit}）`, "比例"], items.map((d) => [d.label, d.value, pct(d.value)])), legend);
}

return { barChart, lineChart, donutChart };
})();
__m.stats = (function () {
// 統計計算與重點指標卡片
const { isOpen, overdueDays, fixDays, retestCounts, today, STATUS, SEVERITY, serviceById, agencyById, AGENCY_TYPE, fmt, dueAt, isPrivate } = __m.store;
const { h, caseLink, statusChip, severityChip, overdueTag } = __m.ui;

function computeKpis(cases) {
  const month = today().slice(0, 7);
  const total = cases.length;
  const open = cases.filter(isOpen).length;
  const overdue = cases.filter((c) => overdueDays(c) > 0).length;
  const newThisMonth = cases.filter((c) => c.reportedAt.slice(0, 7) === month).length;
  const rt = retestCounts(cases);
  const fixed = cases.map(fixDays).filter((d) => d !== null);
  const avgFix = fixed.length ? Math.round(fixed.reduce((a, b) => a + b, 0) / fixed.length) : 0;
  const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);
  return { total, open, overdue, newThisMonth, rt, avgFix, openPct: pct(open, total), overduePct: pct(overdue, total), passRate: pct(rt.pass, rt.total) };
}

function renderKpis(ul, cases) {
  const k = computeKpis(cases);
  const item = (cls, label, value, note) => h("li", { class: `kpi ${cls}` },
    h("p", { class: "kpi-label" }, label), h("p", { class: "kpi-value" }, value), h("p", { class: "kpi-note" }, note));
  ul.replaceChildren(
    item("kpi-blue", "通報案件總數", `${k.total} 件`, `本月新增 ${k.newThisMonth} 件`),
    item("kpi-green", "尚未結案", `${k.open} 件`, `占總數約 ${k.openPct}%`),
    item("kpi-red", "逾期案件", `${k.overdue} 件`, `占總數約 ${k.overduePct}%`),
    item("kpi-purple", "複驗通過率", `${k.passRate}%`, `累積複驗 ${k.rt.total} 次，通過 ${k.rt.pass} 次`),
    item("kpi-plain", "平均改善天數", `${k.avgFix} 天`, "自評估分級到複驗通過"),
  );
}

// 案件清單項目（首頁、工作台、儀表板共用）
function caseListItem(c, { showDue = true, extra = null } = {}) {
  const svc = serviceById(c.service);
  const due = dueAt(c);
  return h("li", {},
    h("p", { class: "ev-head" }, caseLink(c), `　${c.title}`),
    h("p", { class: "case-meta" },
      h("span", {}, `${svc?.name || c.serviceName || "其他服務"}｜${agencyById(c.agency)?.name || c.agencyName || "未指定單位"}`),
      statusChip(c), severityChip(c),
      showDue && due && isOpen(c) ? h("span", {}, `${isPrivate(c) ? "建議期限" : "改善期限"} ${fmt(due)}`) : null,
      overdueTag(c), extra),
  );
}

function byAgency(cases) {
  const map = new Map();
  for (const c of cases) {
    const a = c.agency || "other";
    if (!map.has(a)) map.set(a, []);
    map.get(a).push(c);
  }
  return map;
}

function csvRows(cases) {
  const head = ["案件編號", "服務", "負責單位", "單位類別", "問題摘要", "問題類型", "嚴重程度", "處理狀態", "通報日期", "評估日期", "改善期限", "結案日期", "逾期天數", "功能落差"];
  const rows = cases.map((c) => {
    const ag = agencyById(c.agency);
    return [c.id, serviceById(c.service)?.name || c.serviceName || "", ag?.name || c.agencyName || "", ag ? AGENCY_TYPE[ag.type] : "",
      c.title, c.type || "", c.severity ? SEVERITY[c.severity] : "未分級", STATUS[c.status], fmt(c.reportedAt), fmt(c.assessedAt),
      fmt(dueAt(c)), fmt(c.closedAt), overdueDays(c) || "", c.gap ? "是" : ""];
  });
  return [head, ...rows];
}

return { computeKpis, renderKpis, caseListItem, byAgency, csvRows };
})();
__pages['index'] = function () {
const { loadCases, fmt } = __m.store;
const { initCommon, h } = __m.ui;
const { renderKpis, caseListItem } = __m.stats;
const { setError, clearError } = __m.forms;

initCommon();
const cases = loadCases();
renderKpis(document.getElementById("home-kpis"), cases);

const recent = [...cases].sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1)).slice(0, 5);
document.getElementById("recent-cases").replaceChildren(...recent.map((c) => caseListItem(c)));

const closed = cases.filter((c) => c.closedAt).sort((a, b) => (a.closedAt < b.closedAt ? 1 : -1)).slice(0, 5);
document.getElementById("recent-closed").replaceChildren(...closed.map((c) =>
  caseListItem(c, { showDue: false, extra: h("span", {}, `結案 ${fmt(c.closedAt)}`) })));

const track = document.getElementById("track-form");
const input = document.getElementById("track-id");
track.addEventListener("submit", (e) => {
  input.value = input.value.trim().toUpperCase();
  clearError(input);
  if (!input.value) {
    e.preventDefault();
    setError(input, "請輸入案件編號");
    input.focus();
  }
});

};
__pages['report'] = function () {
const { SERVICES, AGENCY_TYPE, TYPES, agencyById, serviceById, addCase, updateCase, addWorkdays, today, fmt } = __m.store;
const { initCommon, h, focusEl } = __m.ui;
const { setError, clearError, clearErrors, showSummary, hideSummary, checkedValue } = __m.forms;

initCommon();

const form = document.getElementById("report-form");
const summary = document.getElementById("error-summary");
const sel = document.getElementById("f-service");
const otherBox = document.getElementById("other-fields");
const otherInput = document.getElementById("f-service-other");
const agencyOut = document.getElementById("f-agency");

// 服務選單：依單位類別分組
sel.append(h("option", { value: "" }, "請選擇服務"));
for (const type of ["gov", "soe", "private"]) {
  const group = h("optgroup", { label: AGENCY_TYPE[type] });
  SERVICES.filter((s) => agencyById(s.agency).type === type).forEach((s) => group.append(h("option", { value: s.id }, s.name)));
  sel.append(group);
}
sel.append(h("optgroup", { label: "其他" }, h("option", { value: "other" }, "其他（服務不在清單中）")));

// 問題類型與輔助科技
const typeBox = document.getElementById("f-types");
TYPES.forEach((t, i) => typeBox.append(h("div", { class: "choice" },
  h("input", { type: "radio", id: `f-type-${i}`, name: "type", value: t }),
  h("label", { for: `f-type-${i}` }, t === "功能落差" ? "功能落差（友善版本缺少標準版的功能）" : t))));
const atBox = document.getElementById("f-at");
["NVDA", "JAWS", "VoiceOver", "TalkBack", "螢幕放大", "高對比或反白", "語音控制", "點字顯示器"].forEach((t, i) =>
  atBox.append(h("div", { class: "choice" }, h("input", { type: "checkbox", id: `f-at-${i}`, name: "at", value: t }), h("label", { for: `f-at-${i}` }, t))));

function updateService() {
  const v = sel.value;
  otherBox.hidden = v !== "other";
  otherInput.required = v === "other";
  if (v === "other") otherInput.setAttribute("aria-required", "true"); else otherInput.removeAttribute("aria-required");
  const svc = serviceById(v);
  agencyOut.textContent = svc ? `${agencyById(svc.agency).name}（${AGENCY_TYPE[agencyById(svc.agency).type]}）` : v === "other" ? "請在下方填寫" : "尚未選擇服務";
}
sel.addEventListener("change", updateService);
updateService();

const field = (id) => document.getElementById(id);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// 修正後即時移除該欄位的錯誤（不打斷輸入，也不額外播報）
form.addEventListener("input", (e) => {
  const t = e.target;
  if (t.getAttribute("aria-invalid") === "true" && t.value.trim()) clearError(t);
});
form.addEventListener("change", (e) => {
  if (e.target.name === "impact") clearError(field("f-impact-group"));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors(form);
  const errors = [];
  const req = (id, label, message) => {
    const el = field(id);
    if (!el.value.trim()) { setError(el, message); errors.push({ focus: el, label, message }); }
  };
  if (!sel.value) { setError(sel, "請選擇服務名稱"); errors.push({ focus: sel, label: "服務名稱", message: "請選擇服務名稱" }); }
  if (sel.value === "other") req("f-service-other", "其他服務名稱", "請填寫服務名稱");
  req("f-location", "問題網址或畫面位置", "請填寫網址或畫面位置");
  if (!checkedValue(form, "impact")) {
    const fs = field("f-impact-group");
    setError(fs, "請選擇這個問題對你的影響");
    errors.push({ focus: field("f-imp-block"), label: "對你的影響", message: "請選擇這個問題對你的影響" });
  }
  req("f-title", "問題摘要", "請用一句話說明問題");
  req("f-desc", "詳細說明", "請說明發生了什麼事");
  req("f-name", "姓名", "請填寫姓名");
  const email = field("f-email");
  if (!email.value.trim()) { setError(email, "請填寫電子郵件"); errors.push({ focus: email, label: "電子郵件", message: "請填寫電子郵件" }); }
  else if (!isEmail(email.value.trim())) { setError(email, "電子郵件格式不正確，例如 name@example.com"); errors.push({ focus: email, label: "電子郵件", message: "格式不正確，例如 name@example.com" }); }

  if (errors.length) { showSummary(summary, errors); return; }
  hideSummary(summary);

  const v = sel.value;
  const svc = serviceById(v);
  const at = [...form.querySelectorAll('input[name="at"]:checked')].map((x) => x.value).join("、");
  const files = [...field("f-file").files].map((f) => f.name);
  const type = checkedValue(form, "type") || "其他";
  const c = addCase({
    title: field("f-title").value.trim(),
    service: svc ? svc.id : "other",
    serviceName: svc ? null : otherInput.value.trim(),
    agency: svc ? svc.agency : null,
    agencyName: svc ? null : field("f-agency-other").value.trim() || null,
    edition: svc ? svc.edition : checkedValue(form, "edition"),
    type, gap: type === "功能落差",
    wcag: null,
    task: checkedValue(form, "task"),
    reportedImpact: checkedValue(form, "impact"),
    platform: field("f-platform").value.trim() || "未填寫",
    at: at || "未填寫",
    location: field("f-location").value.trim(),
    description: field("f-desc").value.trim(),
    steps: field("f-steps").value.split("\n").map((s) => s.trim()).filter(Boolean),
    expected: field("f-expected").value.trim(),
    actual: "",
    srLog: field("f-srlog").value.trim(),
    attachments: files,
    reportedAt: today(),
    publicConsent: field("f-consent").checked,
    reporter: { name: field("f-name").value.trim(), email: email.value.trim(), tel: field("f-tel").value.trim(), contact: checkedValue(form, "contact") },
  });
  if (field("f-alt").checked) updateCase(c.id, (x) => x.events.push({ date: today(), kind: "note", actor: "通報人", text: "通報人表示需要替代管道協助。" }));

  const due = addWorkdays(today(), 3);
  form.hidden = true;
  const done = field("report-done");
  field("done-body").replaceChildren(
    h("p", {}, "你的案件編號是 ", h("strong", {}, c.id), "。請記下這個編號，用來查詢處理進度。"),
    h("h3", {}, "接下來會發生什麼"),
    h("ol", {},
      h("li", {}, `數位發展部審查員會在 ${fmt(due)} 前完成評估分級，並通知負責單位。`),
      h("li", {}, "負責單位依等級在期限內改善；阻斷級問題須先提供替代管道。"),
      h("li", {}, "機關回報修正後，由複驗員以輔助科技實測，確認可用才結案。")),
    h("div", { class: "btn-row" },
      h("a", { class: "btn", href: `case.html?id=${encodeURIComponent(c.id)}` }, "查看案件進度"),
      h("a", { class: "btn btn-secondary", href: "report.html" }, "再通報一件")),
  );
  done.hidden = false;
  focusEl(field("done-title"));
  document.title = `通報已送出｜無障礙改善追蹤平台（模擬）`;
});


};
__pages['cases'] = function () {
const { loadCases, SERVICES, AGENCIES, AGENCY_TYPE, STATUS, STATUS_ORDER, SEVERITY, TYPES, serviceById, agencyById, dueAt, overdueDays, fmt, isPrivate } = __m.store;
const { initCommon, h, caseLink, statusChip, severityChip, overdueTag, announce, focusEl, tableRegion, downloadCSV } = __m.ui;
const { csvRows } = __m.stats;

initCommon();
const all = loadCases();
const form = document.getElementById("filter-form");
const F = (id) => document.getElementById(id);

function fill(select, options) {
  select.replaceChildren(h("option", { value: "" }, "全部"), ...options.map(([v, t]) => h("option", { value: v }, t)));
}
fill(F("f-agency"), AGENCIES.map((a) => [a.id, a.name]));
fill(F("f-service"), SERVICES.map((s) => [s.id, s.name]).concat([["other", "其他服務"]]));
fill(F("f-status"), STATUS_ORDER.map((s) => [s, STATUS[s]]));
fill(F("f-severity"), [["block", "阻斷"], ["serious", "嚴重"], ["normal", "一般"], ["none", "未分級"]]);
fill(F("f-type"), TYPES.map((t) => [t, t]));
fill(F("f-kind"), Object.entries(AGENCY_TYPE));

const FIELDS = { q: "q", agency: "f-agency", service: "f-service", status: "f-status", severity: "f-severity", type: "f-type", kind: "f-kind" };
const CHECKS = { overdue: "f-overdue", gap: "f-gap" };

function readParams() {
  const p = new URLSearchParams(window.location.search);
  for (const [k, id] of Object.entries(FIELDS)) F(id).value = p.get(k) || "";
  for (const [k, id] of Object.entries(CHECKS)) F(id).checked = p.get(k) === "1";
}
function writeParams() {
  const p = new URLSearchParams();
  for (const [k, id] of Object.entries(FIELDS)) if (F(id).value) p.set(k, F(id).value);
  for (const [k, id] of Object.entries(CHECKS)) if (F(id).checked) p.set(k, "1");
  const qs = p.toString();
  history.replaceState(null, "", qs ? `cases.html?${qs}` : "cases.html");
}

const SEV_RANK = { block: 0, serious: 1, normal: 2 };
const COLUMNS = [
  { key: "id", label: "案件編號", sort: (a, b) => a.id.localeCompare(b.id), dirs: { ascending: "由小到大", descending: "由大到小" } },
  { key: "service", label: "服務與負責單位" },
  { key: "title", label: "問題摘要" },
  { key: "severity", label: "嚴重程度", sort: (a, b) => (SEV_RANK[a.severity] ?? 3) - (SEV_RANK[b.severity] ?? 3), dirs: { ascending: "由重到輕", descending: "由輕到重" } },
  { key: "reportedAt", label: "通報日期", sort: (a, b) => a.reportedAt.localeCompare(b.reportedAt), dirs: { ascending: "由舊到新", descending: "由新到舊" } },
  { key: "due", label: "改善期限", sort: (a, b) => (dueAt(a) || "9999").localeCompare(dueAt(b) || "9999"), dirs: { ascending: "由近到遠", descending: "由遠到近" } },
  { key: "status", label: "處理狀態", sort: (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status), dirs: { ascending: "依流程順序", descending: "依流程倒序" } },
];
let sortKey = "reportedAt";
let sortDir = "descending";

function filtered() {
  const v = (id) => F(id).value;
  const q = v("q").trim().toLowerCase();
  return all.filter((c) => {
    if (v("f-agency") && c.agency !== v("f-agency")) return false;
    if (v("f-service") && c.service !== v("f-service")) return false;
    if (v("f-status") && c.status !== v("f-status")) return false;
    if (v("f-severity") && (c.severity || "none") !== v("f-severity")) return false;
    if (v("f-type") && c.type !== v("f-type")) return false;
    if (v("f-kind") && agencyById(c.agency)?.type !== v("f-kind")) return false;
    if (F("f-overdue").checked && overdueDays(c) === 0) return false;
    if (F("f-gap").checked && !c.gap) return false;
    if (q) {
      const hay = [c.id, c.title, c.description, serviceById(c.service)?.name, c.serviceName, agencyById(c.agency)?.name, c.agencyName].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function sorted(list) {
  const col = COLUMNS.find((c) => c.key === sortKey);
  const out = [...list].sort(col.sort);
  return sortDir === "descending" ? out.reverse() : out;
}

let current = [];
function render() {
  current = sorted(filtered());
  F("results-heading").textContent = `搜尋結果：${current.length} 件`;
  F("results-count").textContent = current.length === all.length ? `顯示全部 ${all.length} 件案件。` : `共 ${all.length} 件案件中，有 ${current.length} 件符合條件。`;
  const root = F("results");
  if (!current.length) { root.replaceChildren(h("p", {}, "沒有符合條件的案件。請放寬篩選條件，或按「清除篩選」。")); return; }
  const head = h("tr", {}, COLUMNS.map((col) => {
    const th = h("th", { scope: "col" });
    if (col.sort) {
      if (col.key === sortKey) th.setAttribute("aria-sort", sortDir);
      th.append(h("button", { type: "button", class: "sort-btn", "data-key": col.key, onclick: () => toggleSort(col.key) },
        col.label, h("span", { class: "sort-ind", "aria-hidden": "true" }, col.key === sortKey ? (sortDir === "ascending" ? "（升冪）" : "（降冪）") : "")));
    } else th.append(col.label);
    return th;
  }));
  const rows = current.map((c) => {
    const due = dueAt(c);
    return h("tr", {},
      h("th", { scope: "row" }, caseLink(c)),
      h("td", {}, serviceById(c.service)?.name || c.serviceName || "其他服務", h("br"), h("span", { class: "muted" }, agencyById(c.agency)?.name || c.agencyName || "未指定單位")),
      h("td", {}, c.title, c.gap ? h("span", {}, " ", h("span", { class: "tag-gap" }, "功能落差")) : null),
      h("td", {}, severityChip(c)),
      h("td", {}, fmt(c.reportedAt)),
      h("td", {}, due ? `${fmt(due)}${isPrivate(c) ? "（建議）" : ""}` : "評估後訂定", h("br"), overdueTag(c)),
      h("td", {}, statusChip(c)),
    );
  });
  const table = h("table", { class: "data-table" },
    h("caption", { class: "visually-hidden" }, "案件列表，可按欄位標題排序"),
    h("thead", {}, head), h("tbody", {}, rows));
  root.replaceChildren(tableRegion("案件列表", table));
}

function toggleSort(key) {
  if (sortKey === key) sortDir = sortDir === "ascending" ? "descending" : "ascending";
  else { sortKey = key; sortDir = key === "reportedAt" || key === "id" ? "descending" : "ascending"; }
  render();
  F("results").querySelector(`button[data-key="${key}"]`)?.focus();
  const col = COLUMNS.find((c) => c.key === key);
  announce(`已依${col.label}${col.dirs[sortDir]}排序。`);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  writeParams();
  render();
  focusEl(F("results-heading"));
});
F("clear-filters").addEventListener("click", () => {
  form.reset();
  for (const id of Object.values(FIELDS)) F(id).value = "";
  writeParams();
  render();
  focusEl(F("results-heading"));
});
F("export-btn").addEventListener("click", () => {
  downloadCSV(`無障礙案件_${new Date().toISOString().slice(0, 10)}.csv`, csvRows(current));
  announce(`已下載 ${current.length} 件案件的 CSV 檔。`);
});

readParams();
render();

};
__pages['case'] = function () {
const { getCase, updateCase, getRole, roleLabel, AGENCIES, AGENCY_TYPE, WCAG, SEVERITY, SEVERITY_DESC, SEV_DAYS, STATUS, serviceById, agencyById, dueAt, altDueAt, overdueDays, altOverdueDays, isPrivate, today, fmt, wcagLabel, addDays } = __m.store;
const { initCommon, h, param, statusChip, severityChip, overdueTag, focusEl } = __m.ui;
const { setError, clearErrors, focusFirst, checkedValue } = __m.forms;

initCommon();
const id = (param("id") || "").trim().toUpperCase();
const titleEl = document.getElementById("case-title");
const root = document.getElementById("case-root");
const statusBox = document.getElementById("status-box");
const SITE = "無障礙改善追蹤平台（模擬）";

const KIND = {
  legacy: "舊制申訴", report: "通報", assess: "評估分級", alt: "提供替代管道", note: "回覆與意見",
  fix: "回報已修正", autotest: "自動回測", pass: "複驗通過", fail: "複驗未通過", remind: "逾期督促",
};

function showStatus(message) {
  const box = h("div", { class: "notice notice-success", tabindex: "-1" }, h("p", {}, message));
  statusBox.replaceChildren(box);
  box.focus();
}

function dl(items) {
  return h("dl", { class: "summary-grid" }, items.filter(Boolean).map(([k, v]) => h("div", {}, h("dt", {}, k), h("dd", {}, v))));
}

function section(idBase, title, ...children) {
  return h("section", { class: "card" }, h("h2", { id: idBase }, title), ...children);
}

function field(labelText, control, hint) {
  const hintId = hint ? `${control.id}-hint` : null;
  if (hintId) control.setAttribute("aria-describedby", hintId);
  return h("div", { class: "field" }, h("label", { for: control.id }, labelText), hint ? h("span", { class: "hint", id: hintId }, hint) : null, control);
}

function radios(name, legend, options, required) {
  const fs = h("fieldset", { id: `${name}-group` }, h("legend", {}, legend, required ? h("span", { class: "visually-hidden" }, "（必填）") : null));
  options.forEach(([value, label, hint], i) => {
    const rid = `${name}-${i}`;
    const hid = hint ? `${rid}-hint` : null;
    fs.append(h("div", { class: "choice" },
      h("input", { type: "radio", id: rid, name, value, "aria-describedby": hid }),
      h("div", {}, h("label", { for: rid }, label), hint ? h("span", { class: "hint", id: hid }, hint) : null)));
  });
  return fs;
}

function addEvent(c, kind, actor, text) { c.events.push({ date: today(), kind, actor, text }); }

// ---------- 處理動作 ----------
function reviewerActions(c) {
  const out = [];
  if (c.status === "new") {
    const sevGroup = radios("a-sev", "評定等級", ["block", "serious", "normal"].map((s) => [s, SEVERITY[s],
      `${SEVERITY_DESC[s]}。${SEV_DAYS[s]} 日內修正${s === "block" ? "，3 個工作日內提供替代管道" : ""}。`]), true);
    const gap = h("input", { type: "checkbox", id: "a-gap", checked: c.gap || c.type === "功能落差" });
    const wcag = h("select", { id: "a-wcag" }, h("option", { value: "" }, "未指定"), Object.keys(WCAG).map((k) => h("option", { value: k, selected: c.wcag === k }, wcagLabel(k))));
    const agencySel = c.agency ? null : h("select", { id: "a-agency" }, h("option", { value: "" }, "請選擇"), AGENCIES.map((a) => h("option", { value: a.id }, a.name)));
    const note = h("textarea", { id: "a-note" });
    const f = h("form", { novalidate: true },
      h("h3", {}, "評估分級"),
      c.reportedImpact ? h("p", {}, `通報人自評：${SEVERITY_DESC[c.reportedImpact]}。`) : null,
      sevGroup,
      agencySel ? field("負責單位", agencySel, "通報人選擇「其他服務」，請指定負責單位。") : null,
      field("對應準則", wcag),
      h("div", { class: "choice" }, gap, h("label", { for: "a-gap" }, "登錄為功能落差案件（友善版本缺少標準版的功能）")),
      field("審查意見", note, "選填。會公開在處理歷程中。"),
      h("button", { type: "submit" }, "完成評估並通知負責單位"));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(f);
      const errs = [];
      const sev = checkedValue(f, "a-sev");
      if (!sev) { setError(sevGroup, "請選擇等級"); errs.push({ focus: f.querySelector("#a-sev-0") }); }
      if (agencySel && !agencySel.value) { setError(agencySel, "請指定負責單位"); errs.push({ focus: agencySel }); }
      if (errs.length) { focusFirst(errs); return; }
      updateCase(c.id, (x) => {
        x.severity = sev; x.assessedAt = today(); x.status = "fixing"; x.gap = gap.checked; x.wcag = wcag.value || null;
        if (agencySel) x.agency = agencySel.value;
        const ag = agencyById(x.agency);
        const due = addDays(today(), SEV_DAYS[sev]);
        addEvent(x, "assess", ROLE_ACTOR.reviewer, `評估為${SEVERITY[sev]}級，通知${ag?.name || "負責單位"}於 ${fmt(due)} 前${isPrivate(x) ? "（建議期限）" : ""}修正${sev === "block" ? "，並於 3 個工作日內提供替代管道" : ""}。${note.value.trim() ? `審查意見：${note.value.trim()}` : ""}`);
      });
      rerender(`已完成評估：${SEVERITY[sev]}級，並通知負責單位。`);
    });
    out.push(f);
    return out;
  }
  if (c.status === "closed") return [h("p", {}, "本案已結案，不需要處理。")];
  const od = overdueDays(c), aod = altOverdueDays(c);
  if (od || aod) {
    const btn = h("button", { type: "button", class: "btn-danger" }, "發出逾期督促通知");
    btn.addEventListener("click", () => {
      updateCase(c.id, (x) => addEvent(x, "remind", ROLE_ACTOR.reviewer,
        `${od ? `已逾改善期限 ${od} 天` : `替代管道已逾期 ${aod} 天`}，通知${agencyById(x.agency)?.name || "負責單位"}及其上級機關，並於儀表板公開逾期情形。`));
      rerender("已發出逾期督促通知。");
    });
    out.push(h("h3", {}, "逾期督促"), h("p", {}, od ? `本案已逾改善期限 ${od} 天。` : `替代管道已逾期 ${aod} 天。`), btn);
  }
  out.push(noteForm(c, "reviewer", "新增審查意見"));
  return out;
}

const ROLE_ACTOR = { reviewer: "數位發展部審查員", agency: "機關承辦人", tester: "複驗員" };

function noteForm(c, role, title) {
  const ta = h("textarea", { id: `a-note-${role}` });
  const f = h("form", { novalidate: true }, h("h3", {}, title), field("內容", ta), h("button", { type: "submit", class: "btn-secondary" }, "送出"));
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(f);
    if (!ta.value.trim()) { setError(ta, "請填寫內容"); ta.focus(); return; }
    updateCase(c.id, (x) => addEvent(x, "note", isPrivate(x) && role === "agency" ? "企業窗口" : ROLE_ACTOR[role], ta.value.trim()));
    rerender("已送出，內容已加入處理歷程。");
  });
  return f;
}

function agencyActions(c, r) {
  if (c.agency !== r.agency) {
    return [h("p", {}, `本案由${agencyById(c.agency)?.name || "其他單位"}負責，不屬於你目前模擬的單位（${agencyById(r.agency)?.name}）。`),
      h("p", {}, h("a", { href: "workbench.html" }, "到處理工作台切換單位"))];
  }
  if (c.status === "new") return [h("p", {}, "本案正在等待審查員評估分級，評估後才會訂定改善期限。")];
  if (c.status === "retest") return [h("p", {}, "你已回報修正，正在等待複驗員實測。"), noteForm(c, "agency", "補充說明")];
  if (c.status === "closed") return [h("p", {}, "本案已結案。")];
  const out = [];
  const actor = isPrivate(c) ? "企業窗口" : "機關承辦人";
  if (c.severity === "block" && !c.altProvidedAt) {
    const ta = h("textarea", { id: "a-alt" });
    const f = h("form", { novalidate: true }, h("h3", {}, "提供替代管道"),
      h("p", {}, `阻斷級問題須在 ${fmt(altDueAt(c))} 前提供替代管道。`),
      field("替代管道說明", ta, "例如：客服專線人工協助、臨櫃協助、提供可讀取格式文件。"),
      h("button", { type: "submit" }, "登錄替代管道"));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(f);
      if (!ta.value.trim()) { setError(ta, "請說明提供的替代管道"); ta.focus(); return; }
      updateCase(c.id, (x) => { x.altProvidedAt = today(); addEvent(x, "alt", actor, `已提供替代管道：${ta.value.trim()}`); });
      rerender("已登錄替代管道。");
    });
    out.push(f);
  }
  const fix = h("textarea", { id: "a-fix" });
  const ver = h("input", { type: "text", id: "a-ver" });
  const f2 = h("form", { novalidate: true }, h("h3", {}, "回報已修正"),
    c.status === "failed" ? h("p", {}, "上次複驗未通過，請依複驗說明修正後再回報。") : null,
    field("修正說明", fix, "說明修正了什麼，方便複驗員確認。"),
    field("修正版本或上線日期", ver, "選填。"),
    h("button", { type: "submit" }, "回報已修正，送交複驗"));
  f2.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(f2);
    if (!fix.value.trim()) { setError(fix, "請填寫修正說明"); fix.focus(); return; }
    updateCase(c.id, (x) => {
      addEvent(x, "fix", actor, `回報已修正：${fix.value.trim()}${ver.value.trim() ? `（${ver.value.trim()}）` : ""}`);
      addEvent(x, "autotest", "系統", "自動回測完成（模擬），等待使用者實測。");
      x.status = "retest";
    });
    rerender("已回報修正，案件轉為待複驗。");
  });
  out.push(f2, noteForm(c, "agency", "回覆說明（不改變狀態）"));
  return out;
}

function testerActions(c) {
  if (c.status !== "retest") return [h("p", {}, c.status === "closed" ? "本案已結案。" : "本案目前不需要複驗；機關回報修正後才會進入待複驗。")];
  const result = radios("a-result", "複驗結果", [["pass", "通過：可以使用輔助科技自主完成任務"], ["fail", "未通過：問題仍可重現"]], true);
  const at = h("select", { id: "a-at" }, ["NVDA", "JAWS", "VoiceOver", "TalkBack", "螢幕放大", "其他"].map((t) => h("option", { value: t, selected: (c.at || "").includes(t) }, t)));
  const note = h("textarea", { id: "a-result-note" });
  const f = h("form", { novalidate: true }, h("h3", {}, "登錄複驗結果"),
    h("p", {}, "請依原本的重現步驟，以通報人使用的輔助科技實測。"),
    result, field("使用的輔助科技", at), field("說明", note, "未通過時必填，請描述仍會發生的情形。"),
    h("button", { type: "submit" }, "登錄複驗結果"));
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(f);
    const v = checkedValue(f, "a-result");
    const errs = [];
    if (!v) { setError(result, "請選擇複驗結果"); errs.push({ focus: f.querySelector("#a-result-0") }); }
    if (v === "fail" && !note.value.trim()) { setError(note, "未通過時請說明情形"); errs.push({ focus: note }); }
    if (errs.length) { focusFirst(errs); return; }
    updateCase(c.id, (x) => {
      if (v === "pass") {
        addEvent(x, "pass", ROLE_ACTOR.tester, `複驗通過（${at.value}）。${note.value.trim()}`);
        x.status = "closed"; x.closedAt = today();
      } else {
        addEvent(x, "fail", ROLE_ACTOR.tester, `複驗未通過（${at.value}）：${note.value.trim()} 退回負責單位，繼續列管。`);
        x.status = "failed";
      }
    });
    rerender(v === "pass" ? "複驗通過，本案已結案。" : "已登錄複驗未通過，案件退回負責單位繼續列管。");
  });
  return [f];
}

// ---------- 主畫面 ----------
function render(c) {
  const r = getRole();
  const svc = serviceById(c.service);
  const ag = agencyById(c.agency);
  const due = dueAt(c);
  const altDue = altDueAt(c);
  const privateCase = isPrivate(c);
  titleEl.textContent = `${c.id}：${c.title}`;
  document.title = `${c.id} ${c.title}｜${SITE}`;

  const hideContent = !c.publicConsent && r.role === "public";
  const parts = [];
  parts.push(h("p", { class: "case-meta" }, statusChip(c), severityChip(c), overdueTag(c),
    c.gap ? h("span", { class: "tag-gap" }, "功能落差") : null,
    privateCase ? h("span", { class: "tag-gap" }, "民間企業自願登錄") : null));
  if (c.source === "migrated") {
    parts.push(h("div", { class: "notice notice-warn" }, h("p", {},
      `本案自現行無障礙申訴專區移轉。首次申訴日為 ${fmt(c.firstReportedAt)}，舊制兩度只回覆「已去函要求改善」，移轉時已近三年半。`)));
  }
  parts.push(section("h-info", "案件資訊", dl([
    ["服務", svc?.name || c.serviceName || "其他服務"],
    ["版本", svc?.edition || c.edition || "未填寫"],
    ["負責單位", ag ? `${ag.name}（${AGENCY_TYPE[ag.type]}）` : c.agencyName || "待審查員指定"],
    svc ? ["委外廠商", svc.vendor] : null,
    ["服務形式", svc?.channel || "未填寫"],
    ["問題類型", c.type || "未填寫"],
    ["對應準則", wcagLabel(c.wcag)],
    ["發生步驟", c.task || "未填寫"],
    ["裝置與系統", c.platform],
    ["輔助科技", c.at],
    ["通報日期", fmt(c.reportedAt)],
    ["評估日期", fmt(c.assessedAt)],
    [privateCase ? "建議改善期限" : "改善期限", due ? fmt(due) : "評估後訂定"],
    c.severity === "block" ? ["替代管道", c.altProvidedAt ? `已於 ${fmt(c.altProvidedAt)} 提供` : `應於 ${fmt(altDue)} 前提供`] : null,
    ["結案日期", fmt(c.closedAt)],
  ])));

  if (hideContent) {
    parts.push(section("h-content", "問題內容", h("p", {}, "通報人未同意公開問題內容，公開頁面只顯示處理進度。")));
  } else {
    parts.push(section("h-content", "問題內容",
      h("p", {}, c.description),
      c.location ? h("p", {}, h("strong", {}, "網址或畫面位置："), c.location) : null,
      c.steps?.length ? [h("h3", {}, "重現步驟"), h("ol", {}, c.steps.map((s) => h("li", {}, s)))] : null,
      c.expected ? [h("h3", {}, "預期結果"), h("p", {}, c.expected)] : null,
      c.actual ? [h("h3", {}, "實際情形"), h("p", {}, c.actual)] : null,
      c.srLog ? [h("h3", {}, "報讀紀錄"), h("pre", { class: "sr-log" }, c.srLog)] : null,
      c.attachments?.length ? [h("h3", {}, "附件（模擬，未上傳）"), h("ul", {}, c.attachments.map((n) => h("li", {}, n)))] : null,
    ));
  }

  parts.push(section("h-timeline", "處理歷程", h("ol", { class: "timeline" }, c.events.map((e) =>
    h("li", { class: `ev-${e.kind}` },
      h("p", { class: "ev-head" }, h("time", { datetime: e.date }, fmt(e.date)), `　${KIND[e.kind] || e.kind}（${e.actor}）`),
      h("p", {}, e.text))))));

  let actions;
  if (r.role === "reviewer") actions = reviewerActions(c);
  else if (r.role === "agency") actions = agencyActions(c, r);
  else if (r.role === "tester") actions = testerActions(c);
  else actions = [h("p", {}, "你目前的模擬身分是民眾，只能檢視案件。"), h("p", {}, h("a", { href: "workbench.html" }, "到處理工作台切換身分"), "，就能體驗評估分級、機關改善與複驗。")];
  parts.push(h("section", { class: "card", id: "actions" },
    h("h2", { id: "actions-title", tabindex: "-1" }, "處理動作"),
    h("p", { class: "muted" }, `目前模擬身分：${roleLabel(r)}`),
    ...actions));
  root.replaceChildren(...parts);
}

function rerender(message) {
  const c = getCase(id);
  render(c);
  showStatus(message);
}

const c = getCase(id);
if (!c) {
  titleEl.textContent = "找不到案件";
  document.title = `找不到案件｜${SITE}`;
  root.replaceChildren(h("p", {}, id ? `找不到案件編號「${id}」。請確認編號是否正確。` : "沒有指定案件編號。"),
    h("p", {}, h("a", { href: "cases.html" }, "回到案件查詢")));
} else {
  render(c);
  // 從工作台連過來時，把焦點放在「處理動作」標題（等瀏覽器完成錨點捲動後再設定）
  if (window.location.hash === "#actions") {
    const go = () => setTimeout(() => focusEl(document.getElementById("actions-title")), 0);
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
  }
}
void STATUS;

};
__pages['dashboard'] = function () {
const { loadCases, STATUS, STATUS_ORDER, TYPES, agencyById, AGENCY_TYPE, isOpen, overdueDays, altOverdueDays, fixDays, today, fmt, addDays } = __m.store;
const { initCommon, h, tableRegion, downloadCSV, announce } = __m.ui;
const { renderKpis, caseListItem, byAgency, csvRows } = __m.stats;
const { barChart, lineChart, donutChart } = __m.charts;

initCommon();
const cases = loadCases();
renderKpis(document.getElementById("kpis"), cases);

// 處理進度
const progress = barChart({
  title: "目前案件處理進度",
  items: STATUS_ORDER.map((s) => ({ label: STATUS[s], value: cases.filter((c) => c.status === s).length })),
});

// 各單位每月新增（近 6 個月）
const months = [];
for (let i = 5; i >= 0; i--) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - i);
  months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
}
const groups = byAgency(cases);
const top = [...groups.entries()].filter(([a]) => a !== "other").sort((a, b) => b[1].length - a[1].length).slice(0, 3);
const series = top.map(([a, list]) => ({ name: agencyById(a)?.name || a, values: months.map((m) => list.filter((c) => c.reportedAt.startsWith(m)).length) }));
series.push({ name: "全部單位合計", values: months.map((m) => cases.filter((c) => c.reportedAt.startsWith(m)).length) });
const monthly = lineChart({ title: "各單位每月新增案件", categories: months.map((m) => `${Number(m.slice(5))}月`), series });

// 問題類型
const types = donutChart({ title: "案件問題類型", items: TYPES.map((t) => ({ label: t, value: cases.filter((c) => (c.type || "其他") === t).length })) });

// 嚴重程度（未結案）
const open = cases.filter(isOpen);
const severity = barChart({
  title: "未結案件的嚴重程度",
  items: [["block", "阻斷"], ["serious", "嚴重"], ["normal", "一般"], [null, "未分級"]].map(([k, label]) => ({ label, value: open.filter((c) => c.severity === k).length })),
});
document.getElementById("charts").replaceChildren(progress, monthly, types, severity);

// 各單位改善情形
const rows = [...groups.entries()].map(([a, list]) => {
  const ag = agencyById(a);
  const fixed = list.map(fixDays).filter((d) => d !== null);
  let pass = 0, total = 0;
  list.forEach((c) => c.events.forEach((e) => { if (e.kind === "pass") { pass++; total++; } if (e.kind === "fail") total++; }));
  return {
    name: ag?.name || "未指定單位", kind: ag ? AGENCY_TYPE[ag.type] : "—", total: list.length,
    open: list.filter(isOpen).length, overdue: list.filter((c) => overdueDays(c) > 0).length,
    avg: fixed.length ? `${Math.round(fixed.reduce((x, y) => x + y, 0) / fixed.length)} 天` : "—",
    rate: total ? `${Math.round((pass / total) * 100)}%` : "—", id: a,
  };
}).sort((x, y) => y.overdue - x.overdue || y.open - x.open);
const table = h("table", { class: "data-table" },
  h("caption", {}, "各單位改善情形（依逾期件數排序）"),
  h("thead", {}, h("tr", {}, ["單位", "類別", "案件數", "未結案", "逾期", "平均改善天數", "複驗通過率"].map((t, i) => h("th", { scope: "col", class: i > 1 ? "num" : null }, t)))),
  h("tbody", {}, rows.map((r) => h("tr", {},
    h("th", { scope: "row" }, r.id === "other" ? r.name : h("a", { href: `cases.html?agency=${r.id}` }, r.name)),
    h("td", {}, r.kind), h("td", { class: "num" }, r.total), h("td", { class: "num" }, r.open),
    h("td", { class: "num" }, r.overdue), h("td", { class: "num" }, r.avg), h("td", { class: "num" }, r.rate)))));
document.getElementById("agency-table").replaceChildren(tableRegion("各單位改善情形", table));

// 近期改善成果
const closed = cases.filter((c) => c.closedAt).sort((a, b) => (a.closedAt < b.closedAt ? 1 : -1)).slice(0, 5);
document.getElementById("done-list").replaceChildren(...closed.map((c) => caseListItem(c, { showDue: false, extra: h("span", {}, `結案 ${fmt(c.closedAt)}`) })));

// 主管機關代辦事項
const t = today();
const overdue = cases.filter((c) => overdueDays(c) > 0).length;
const altLate = cases.filter((c) => altOverdueDays(c) > 0).length;
const waiting = cases.filter((c) => c.status === "new").length;
const retest = cases.filter((c) => c.status === "retest").length;
const failed = cases.filter((c) => c.status === "failed").length;
const soon = cases.filter((c) => isOpen(c) && c.assessedAt && overdueDays(c) === 0 && c.status !== "retest").filter((c) => {
  const days = { block: 30, serious: 60, normal: 90 }[c.severity];
  return addDays(c.assessedAt, days) <= addDays(t, 14);
}).length;
const todo = [
  [overdue, `追蹤 ${overdue} 件逾期案件，確認負責單位回應與改善時程`, "cases.html?overdue=1"],
  [altLate, `${altLate} 件阻斷級案件的替代管道已逾期，請立即督促`, "cases.html?severity=block&status=fixing"],
  [waiting, `${waiting} 件新通報待評估分級（3 個工作日內）`, "cases.html?status=new"],
  [retest, `安排複驗員實測 ${retest} 件待複驗案件`, "cases.html?status=retest"],
  [failed, `${failed} 件複驗未通過，確認負責單位的再修正計畫`, "cases.html?status=failed"],
  [soon, `${soon} 件案件將在 14 天內到期`, "cases.html?status=fixing"],
].filter(([n]) => n > 0);
document.getElementById("todo-list").replaceChildren(...(todo.length ? todo.map(([, text, href]) => h("li", {}, h("a", { href }, text))) : [h("li", {}, "目前沒有待辦事項。")]));

document.getElementById("export-all").addEventListener("click", () => {
  downloadCSV(`無障礙改善追蹤報表_${t}.csv`, csvRows(cases));
  announce(`已下載報表，共 ${cases.length} 件案件。`);
});

};
__pages['agencies'] = function () {
const { loadCases, SERVICES, AGENCY_TYPE, agencyById, serviceById, isOpen, overdueDays } = __m.store;
const { initCommon, h, tableRegion } = __m.ui;

initCommon();
const cases = loadCases();

const rows = SERVICES.map((s) => {
  const list = cases.filter((c) => c.service === s.id);
  let pass = 0, total = 0;
  list.forEach((c) => c.events.forEach((e) => { if (e.kind === "pass") { pass++; total++; } if (e.kind === "fail") total++; }));
  const ag = agencyById(s.agency);
  return h("tr", {},
    h("th", { scope: "row" }, h("a", { href: `cases.html?service=${s.id}` }, s.name)),
    h("td", {}, ag.name), h("td", {}, AGENCY_TYPE[ag.type]), h("td", {}, s.channel), h("td", {}, s.edition), h("td", {}, s.badge),
    h("td", { class: "num" }, list.length), h("td", { class: "num" }, list.filter(isOpen).length),
    h("td", { class: "num" }, list.filter((c) => overdueDays(c) > 0).length),
    h("td", { class: "num" }, total ? `${Math.round((pass / total) * 100)}%` : "—"));
});
const table = h("table", { class: "data-table" },
  h("caption", {}, "服務一覽：標章狀態與通報情形"),
  h("thead", {}, h("tr", {}, ["服務", "營運單位", "類別", "形式", "版本", "標章狀態", "案件數", "未結案", "逾期", "複驗通過率"].map((t, i) => h("th", { scope: "col", class: i > 5 ? "num" : null }, t)))),
  h("tbody", {}, rows));
document.getElementById("service-table").replaceChildren(
  tableRegion("服務一覽", table),
  h("p", { class: "muted" }, "標章狀態除臺北捷運公司官方網站與 App Store 標示外，皆為模擬資料。"));

const pairs = SERVICES.filter((s) => s.friendlyOf).map((fr) => {
  const std = serviceById(fr.friendlyOf);
  const gaps = cases.filter((c) => c.service === fr.id && c.gap);
  const stdOpen = cases.filter((c) => c.service === std.id && isOpen(c));
  return h("section", { class: "card" },
    h("h3", { id: `pair-${fr.id}` }, `${fr.name} 與 ${std.name}`),
    h("ul", {},
      h("li", {}, `功能落差案件 ${gaps.length} 件，其中未結案 ${gaps.filter(isOpen).length} 件。`),
      h("li", {}, `標準版未結案 ${stdOpen.length} 件。友善版本存在，不代表標準版可以不改善。`)),
    h("p", {}, h("a", { href: `cases.html?service=${fr.id}&gap=1` }, `查看${fr.name}的功能落差案件`), "　",
      h("a", { href: `cases.html?service=${std.id}` }, `查看${std.name}的案件`)));
});
document.getElementById("pair-list").replaceChildren(...pairs);

};
__pages['workbench'] = function () {
const { loadCases, getRole, setRole, roleLabel, AGENCIES, isOpen, overdueDays, altOverdueDays, dueAt } = __m.store;
const { initCommon, h, announce } = __m.ui;
const { caseListItem } = __m.stats;

initCommon();
const form = document.getElementById("role-form");
const agencySel = document.getElementById("r-agency-select");
const agencyField = document.getElementById("agency-field");
const status = document.getElementById("role-status");
agencySel.replaceChildren(...AGENCIES.map((a) => h("option", { value: a.id }, a.name)));

function syncForm() {
  const r = getRole();
  form.querySelector(`input[value="${r.role}"]`).checked = true;
  agencySel.value = r.agency || "dot";
  agencyField.hidden = r.role !== "agency";
}
form.addEventListener("change", (e) => {
  if (e.target.name === "role") agencyField.hidden = e.target.value !== "agency";
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const role = form.querySelector('input[name="role"]:checked').value;
  setRole(role, agencySel.value);
  const label = roleLabel(getRole());
  document.getElementById("role-name").textContent = label;
  status.textContent = `已切換為：${label}。下方已更新待處理案件。`;
  announce(`已切換為${label}。`);
  renderTasks();
});

function list(title, idBase, items, empty) {
  return h("section", { class: "card" },
    h("h2", { id: idBase }, `${title}（${items.length} 件）`),
    items.length ? h("ul", { class: "list-plain task-list" }, items.map((c) => {
      const li = caseListItem(c);
      li.querySelector("a").setAttribute("href", `case.html?id=${encodeURIComponent(c.id)}#actions`);
      return li;
    })) : h("p", {}, empty));
}
const byDue = (a, b) => (dueAt(a) || "9999").localeCompare(dueAt(b) || "9999");

function renderTasks() {
  const cases = loadCases();
  const r = getRole();
  const root = document.getElementById("tasks");
  if (r.role === "public") {
    root.replaceChildren(h("section", { class: "card" },
      h("h2", { id: "t-public" }, "民眾可以做的事"),
      h("ul", {},
        h("li", {}, h("a", { href: "report.html" }, "通報無障礙問題")),
        h("li", {}, h("a", { href: "cases.html" }, "查詢案件處理進度")),
        h("li", {}, h("a", { href: "dashboard.html" }, "查看各單位的改善情形"))),
      h("p", {}, "想體驗完整流程，可以依序切換為審查員、機關承辦人與複驗員，處理同一件案件。")));
    return;
  }
  if (r.role === "reviewer") {
    root.replaceChildren(
      list("待評估分級", "t-new", cases.filter((c) => c.status === "new"), "目前沒有待評估的案件。"),
      list("已逾改善期限", "t-overdue", cases.filter((c) => overdueDays(c) > 0).sort((a, b) => overdueDays(b) - overdueDays(a)), "目前沒有逾期案件。"),
      list("替代管道逾期", "t-alt", cases.filter((c) => altOverdueDays(c) > 0), "目前沒有替代管道逾期的案件。"),
      list("複驗未通過、列管中", "t-failed", cases.filter((c) => c.status === "failed"), "目前沒有複驗未通過的案件。"));
    return;
  }
  if (r.role === "agency") {
    const mine = cases.filter((c) => c.agency === r.agency);
    root.replaceChildren(
      list("需要改善", "t-fix", mine.filter((c) => c.status === "fixing" || c.status === "failed").sort(byDue), "目前沒有需要改善的案件。"),
      list("等待審查員評估", "t-wait", mine.filter((c) => c.status === "new"), "目前沒有。"),
      list("已回報修正、等待複驗", "t-retest", mine.filter((c) => c.status === "retest"), "目前沒有。"));
    return;
  }
  root.replaceChildren(
    list("待複驗", "t-test", cases.filter((c) => c.status === "retest").sort((a, b) => a.id.localeCompare(b.id)), "目前沒有待複驗的案件。"),
    list("近期結案", "t-closed", cases.filter((c) => !isOpen(c)).sort((a, b) => (a.closedAt < b.closedAt ? 1 : -1)).slice(0, 5), "目前沒有。"));
}

syncForm();
renderTasks();

};
__pages['about'] = function () {
const { initCommon } = __m.ui;
initCommon();

};
const page = document.body && document.body.getAttribute("data-page");
if (page && __pages[page]) __pages[page]();
})();
