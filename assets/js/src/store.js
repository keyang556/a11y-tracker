// 資料存取、日期計算與模擬身分。資料只存在使用者自己的瀏覽器。
import { AGENCIES, SERVICES, WCAG, SEED_VERSION, buildSeedCases } from "./data.js";

export { AGENCIES, SERVICES, WCAG };

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
export function storageAvailable() { readStorage(KEY_VERSION); return storageOk; }

export function loadCases() {
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
export function saveCases(cases) {
  memory = cases;
  writeStorage(KEY_CASES, JSON.stringify(cases));
}
export function resetData() {
  memory = buildSeedCases();
  saveCases(memory);
  writeStorage(KEY_VERSION, SEED_VERSION);
}
export function getCase(id) { return loadCases().find((c) => c.id === id) || null; }
export function updateCase(id, fn) {
  const cases = loadCases();
  const c = cases.find((x) => x.id === id);
  if (!c) return null;
  fn(c);
  saveCases(cases);
  return c;
}
export function addCase(data) {
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
export const ROLES = {
  public: "民眾",
  reviewer: "數位發展部審查員",
  agency: "機關承辦人",
  tester: "複驗員",
};
export function getRole() {
  const raw = readStorage(KEY_ROLE);
  try { const r = JSON.parse(raw); if (r && ROLES[r.role]) return r; } catch { /* 預設 */ }
  return { role: "public", agency: "dot" };
}
export function setRole(role, agency) { writeStorage(KEY_ROLE, JSON.stringify({ role, agency })); }
export function roleLabel(r = getRole()) {
  return r.role === "agency" ? `${ROLES.agency}（${agencyById(r.agency)?.name || ""}）` : ROLES[r.role];
}

// ---------- 查表 ----------
export function serviceById(id) { return SERVICES.find((s) => s.id === id) || null; }
export function agencyById(id) { return AGENCIES.find((a) => a.id === id) || null; }
export const AGENCY_TYPE = { gov: "政府機關", soe: "公營事業", private: "民間企業（示範）" };
export const STATUS = {
  new: "待評估",
  fixing: "改善中",
  retest: "待複驗",
  failed: "複驗未通過（列管中）",
  closed: "已結案",
};
export const STATUS_ORDER = ["new", "fixing", "retest", "failed", "closed"];
export const SEVERITY = { block: "阻斷", serious: "嚴重", normal: "一般" };
export const SEVERITY_DESC = {
  block: "無法自主完成任務",
  serious: "需他人協助或改走其他管道",
  normal: "可完成，但明顯耗時或容易出錯",
};
export const SEV_DAYS = { block: 30, serious: 60, normal: 90 };
export const TYPES = ["操作困難", "資訊不清", "缺乏語音支援", "功能落差", "其他"];
export const TASKS = ["資訊查找", "文件閱讀", "介面操作", "結果確認"];
export function wcagLabel(code) {
  if (!code) return "未指定";
  if (code === "gap") return WCAG.gap;
  return `${code} ${WCAG[code] || ""}`.trim();
}

// ---------- 日期 ----------
export function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function toUTC(iso) { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); }
export function addDays(iso, n) { return new Date(toUTC(iso) + n * 86400000).toISOString().slice(0, 10); }
export function addWorkdays(iso, n) {
  let d = iso, left = n;
  while (left > 0) {
    d = addDays(d, 1);
    const wd = new Date(toUTC(d)).getUTCDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return d;
}
export function diffDays(a, b) { return Math.round((toUTC(b) - toUTC(a)) / 86400000); }
export function fmt(iso) { return iso ? iso.replace(/-/g, "/") : "—"; }

// ---------- 推導欄位 ----------
export function dueAt(c) { return c.assessedAt && c.severity ? addDays(c.assessedAt, SEV_DAYS[c.severity]) : null; }
export function altDueAt(c) { return c.assessedAt && c.severity === "block" ? addWorkdays(c.assessedAt, 3) : null; }
export function isOpen(c) { return c.status !== "closed"; }
export function overdueDays(c) {
  const due = dueAt(c);
  if (!isOpen(c) || !due) return 0;
  const n = diffDays(due, today());
  return n > 0 ? n : 0;
}
export function altOverdueDays(c) {
  const due = altDueAt(c);
  if (!isOpen(c) || !due || c.altProvidedAt) return 0;
  const n = diffDays(due, today());
  return n > 0 ? n : 0;
}
export function daysLeft(c) { const due = dueAt(c); return due ? diffDays(today(), due) : null; }
export function isPrivate(c) { return agencyById(c.agency)?.type === "private"; }
export function fixDays(c) { return c.closedAt && c.assessedAt ? diffDays(c.assessedAt, c.closedAt) : null; }
export function retestCounts(cases) {
  let pass = 0, fail = 0;
  cases.forEach((c) => c.events.forEach((e) => { if (e.kind === "pass") pass++; if (e.kind === "fail") fail++; }));
  return { pass, fail, total: pass + fail };
}
