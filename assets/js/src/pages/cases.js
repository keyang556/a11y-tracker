import { loadCases, SERVICES, AGENCIES, AGENCY_TYPE, STATUS, STATUS_ORDER, SEVERITY, TYPES, serviceById, agencyById, dueAt, overdueDays, fmt, isPrivate } from "../store.js";
import { initCommon, h, caseLink, statusChip, severityChip, overdueTag, announce, focusEl, tableRegion, downloadCSV } from "../ui.js";
import { csvRows } from "../stats.js";

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
