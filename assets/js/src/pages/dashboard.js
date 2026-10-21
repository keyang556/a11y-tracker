import { loadCases, STATUS, STATUS_ORDER, TYPES, agencyById, AGENCY_TYPE, isOpen, overdueDays, altOverdueDays, fixDays, today, fmt, addDays } from "../store.js";
import { initCommon, h, tableRegion, downloadCSV, announce } from "../ui.js";
import { renderKpis, caseListItem, byAgency, csvRows } from "../stats.js";
import { barChart, lineChart, donutChart } from "../charts.js";

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
