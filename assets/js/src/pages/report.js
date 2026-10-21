import { SERVICES, AGENCY_TYPE, TYPES, agencyById, serviceById, addCase, updateCase, addWorkdays, today, fmt } from "../store.js";
import { initCommon, h, focusEl } from "../ui.js";
import { setError, clearError, clearErrors, showSummary, hideSummary, checkedValue } from "../forms.js";

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

// 人機驗證：Cloudflare Turnstile。api.js 以 render=explicit 在 app.js 之前載入；載入或顯示失敗時 captchaId 為 null
const captchaGroup = field("f-captcha-group");
const captchaBox = field("f-turnstile");
let captchaId = null;
try {
  if (window.turnstile) captchaId = window.turnstile.render(captchaBox, {
    sitekey: captchaBox.dataset.sitekey,
    language: "zh-tw",
    size: "flexible",
    callback: () => clearError(captchaGroup),
    "error-callback": () => { setError(captchaGroup, "人機驗證發生錯誤，請重新整理頁面再試一次"); return true; },
  }) ?? null;
} catch { /* 送出時提示無法載入 */ }
function captchaToken() {
  if (captchaId == null) return "";
  try { return window.turnstile.getResponse(captchaId) || ""; } catch { return ""; }
}

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
  if (!captchaToken()) {
    const message = captchaId == null ? "人機驗證無法載入，請確認網路連線後重新整理頁面" : "請完成人機驗證";
    setError(captchaGroup, message);
    errors.push({ focus: captchaBox, label: "人機驗證", message });
  }

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

