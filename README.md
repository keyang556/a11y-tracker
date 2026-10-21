# 政府數位服務無障礙改善追蹤平台（模擬系統）

這是「看不見的資訊障礙：政府數位服務的可近用性評估與改善工具」提案的展示原型。網站把每一個無障礙問題變成可追蹤的案件，要求負責單位在期限內改善，並由使用者實測確認後才能結案。

所有案件、機關回應、標章狀態與統計數字都是模擬資料，部分情境參考公開報導。資料只存在使用者自己的瀏覽器（localStorage），不會傳送到任何伺服器。

## 功能

| 頁面 | 內容 |
|---|---|
| 首頁 `index.html` | 重點數字、處理流程、障礙等級與期限、和現行無障礙申訴專區的比較、最新通報與改善成果、以案件編號查詢 |
| 我要通報 `report.html` | 通報表單：服務、網址或畫面位置、影響程度、問題類型、重現步驟、報讀紀錄、輔助科技、聯絡方式、公開同意。以 Cloudflare Turnstile 人機驗證防止濫用，不使用圖形驗證碼 |
| 案件查詢 `cases.html` | 依單位、服務、狀態、嚴重程度、問題類型、單位類別、逾期、功能落差篩選；可排序；可下載 CSV |
| 案件詳情 `case.html?id=...` | 案件資訊、問題內容、處理歷程時間軸，以及依模擬身分顯示的處理動作 |
| 統計儀表板 `dashboard.html` | 通報總數、尚未結案、逾期、複驗通過率、平均改善天數；處理進度、各單位每月新增、問題類型、嚴重程度圖表（皆附資料表）；各單位改善情形；主管機關代辦事項；下載報表 |
| 機關與服務 `agencies.html` | 各服務的標章狀態與通報情形；友善版本與標準版的對照 |
| 處理工作台 `workbench.html` | 切換模擬身分，查看該身分待處理的案件 |
| 關於與無障礙聲明 `about.html` | 處理規則、隱私、無障礙聲明、模擬資料說明 |

### 完整處理流程

1. **民眾**在「我要通報」送出問題，取得案件編號。
2. 到「處理工作台」切換為**數位發展部審查員**，進入案件，評定等級（阻斷 30 日、嚴重 60 日、一般 90 日），必要時登錄為功能落差案件。
3. 切換為**機關承辦人**（選擇負責單位），阻斷級先登錄替代管道，修正後回報，系統模擬自動回測。
4. 切換為**複驗員**，以輔助科技實測：通過則結案；未通過則退回機關、繼續列管。
5. 審查員可對逾期案件發出督促通知；儀表板即時反映結果。

頁尾的「重設模擬資料」可以隨時回到初始資料。

### 模擬案例

- 衛生福利部「醫事人員繼續教育積分管理系統」：自現行申訴專區移轉的案件（舊制兩度只回覆「已去函要求改善」）
- 臺北好行（標準版、視障介面）：旅程規劃無法操作、視障介面缺少功能、強制切換等
- 台北捷運Go（標準版、文字模式）與臺北捷運公司官方網站：旁白無法操作首頁、購票流程、文字模式功能不完整等
- 臺北旅遊網、臺北市公車動態資訊系統
- 民間企業示範（未來擴大適用、自願登錄）：LINE（Windows 電腦版）、Windows 11、示範網路銀行、示範電商平台

## 部署到 GitHub Pages

1. 在 GitHub 建立一個新的公開儲存庫，例如 `a11y-tracker`。
2. 把本資料夾的所有檔案上傳到儲存庫根目錄（包含 `.nojekyll` 這個檔案）。
3. 進入儲存庫的 **Settings > Pages**，在 **Build and deployment** 選擇 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`，按 **Save**。
4. 約一兩分鐘後，網站會出現在 `https://<你的帳號>.github.io/a11y-tracker/`。

本網站是純 HTML、CSS 與 JavaScript，不需要建置步驟。除了「我要通報」頁的 Cloudflare Turnstile 之外，不載入任何外部資源。

### 在自己的電腦預覽

解壓縮後，直接雙擊 `index.html` 就能開啟，第一次開啟會自動載入模擬資料。「我要通報」頁的人機驗證需要網路連線才能載入。也可以用本機伺服器預覽：

```bash
python -m http.server 8000
```

然後開啟 `http://localhost:8000/`。

## 人機驗證（Cloudflare Turnstile）

「我要通報」表單最下方使用 [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) 防止濫用。Turnstile 通常會自動完成，不需要辨識圖片或輸入文字，可以只用鍵盤與螢幕閱讀器操作。尚未通過驗證時，送出會在錯誤摘要列出「人機驗證」；Turnstile 無法載入（例如沒有網路）時，也會在錯誤摘要中說明。

本站使用 Cloudflare 官方開發者文件提供的[測試金鑰](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)。測試金鑰可以在任何網域使用（包含 `localhost`、直接開啟檔案與 GitHub Pages），不需要申請帳號：

| 種類 | 金鑰 | 行為 |
|---|---|---|
| Site key | `1x00000000000000000000AA` | 一定通過，顯示元件（**本站使用**） |
| Site key | `2x00000000000000000000AB` | 一定失敗，顯示元件 |
| Site key | `1x00000000000000000000BB` | 一定通過，不顯示元件 |
| Site key | `2x00000000000000000000BB` | 一定失敗，不顯示元件 |
| Site key | `3x00000000000000000000FF` | 一定要求互動驗證，顯示元件 |
| Secret key | `1x0000000000000000000000000000000AA` | 伺服器端驗證一定通過 |
| Secret key | `2x0000000000000000000000000000000AA` | 伺服器端驗證一定失敗 |
| Secret key | `3x0000000000000000000000000000000AA` | 回傳 token 已使用過的錯誤 |

測試 site key 產生的 token 固定是 `XXXX.DUMMY.TOKEN.XXXX`，元件下方會顯示僅供測試的提示。測試 secret key 只接受這個假 token；正式 secret key 則會拒絕它。

- Site key 寫在 `report.html` 中 `#f-turnstile` 元素的 `data-sitekey`。例如改成 `2x00000000000000000000AB`，就能測試驗證失敗時的錯誤訊息。
- 顯示與檢查的程式在 `assets/js/src/pages/report.js`，修改後請執行 `python tools/bundle.py`。
- 本站是純前端的模擬系統，只檢查瀏覽器是否取得 token，沒有在伺服器端驗證。

### 正式上線時

1. 在 Cloudflare 主控台建立 Turnstile 小工具，設定允許的網域，取得正式的 site key 與 secret key。
2. 把 `report.html` 的 `data-sitekey` 換成正式 site key。
3. 通報要送到後端伺服器，由伺服器把表單中的 `cf-turnstile-response` token 與 secret key 送到 Siteverify API（`https://challenges.cloudflare.com/turnstile/v0/siteverify`）驗證，通過才受理。Token 只能使用一次，5 分鐘後失效。
4. Secret key 只能放在伺服器端，不可以寫進前端程式或公開儲存庫。開發與自動測試時，伺服器端可以使用上表的測試 secret key。

## 無障礙

本站以 WCAG 2.2 AA 為目標，並依 [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents) 的網頁規範設計：

- 語意化 HTML 優先，每頁一個一級標題，標題層級不跳級
- 全部功能可只用鍵盤操作；提供「跳到主要內容」連結與清楚的焦點樣式
- 文字對比 4.5:1、元件與圖形 3:1 以上；支援深色模式與 Windows 高對比模式
- 狀態、嚴重程度、逾期都以文字標示，不只靠顏色；圖表另以標記形狀與線型區分，並附文字摘要與資料表
- 表單欄位都有標籤、說明與必填標示；送出錯誤時焦點移到錯誤摘要，錯誤以 `aria-describedby` 連到欄位
- 換頁、篩選、排序、處理動作後的焦點管理，以及狀態訊息播報
- 對話框使用原生 `dialog`，焦點鎖定在對話框內，關閉後回到觸發按鈕
- 不使用需要辨識圖片或輸入文字的驗證碼，通報表單改用 Cloudflare Turnstile 人機驗證（WCAG 3.3.8）
- 避免過多區域地標，表格捲動區塊可用鍵盤聚焦

檢測方式與結果見 [`docs/accessibility-testing.md`](docs/accessibility-testing.md)，檢測腳本在 `tests/audit.py`。

## 檔案結構

```text
index.html, report.html, cases.html, case.html,
dashboard.html, agencies.html, workbench.html, about.html
assets/css/style.css            樣式（淺色、深色、高對比）
assets/js/app.js                網頁實際載入的程式（由 src 自動打包）
assets/js/src/data.js           模擬資料（機關、服務、案件）
assets/js/src/store.js          資料存取、日期計算、模擬身分
assets/js/src/ui.js             共用介面元件與狀態訊息
assets/js/src/forms.js          表單驗證與錯誤摘要
assets/js/src/charts.js         無障礙圖表
assets/js/src/stats.js          統計計算
assets/js/src/pages/*.js        各頁面程式
tools/bundle.py                 修改 src 後執行，重新產生 app.js
docs/accessibility-testing.md   無障礙檢測紀錄
tests/audit.py                  檢測腳本
```

修改模擬資料或程式時，請改 `assets/js/src` 裡的檔案，再於網站根目錄執行 `python tools/bundle.py`。

## 授權

MIT
