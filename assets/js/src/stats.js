// 統計計算與重點指標卡片
import { isOpen, overdueDays, fixDays, retestCounts, today, STATUS, SEVERITY, serviceById, agencyById, AGENCY_TYPE, fmt, dueAt, isPrivate } from "./store.js";
import { h, caseLink, statusChip, severityChip, overdueTag } from "./ui.js";

export function computeKpis(cases) {
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

export function renderKpis(ul, cases) {
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
export function caseListItem(c, { showDue = true, extra = null } = {}) {
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

export function byAgency(cases) {
  const map = new Map();
  for (const c of cases) {
    const a = c.agency || "other";
    if (!map.has(a)) map.set(a, []);
    map.get(a).push(c);
  }
  return map;
}

export function csvRows(cases) {
  const head = ["案件編號", "服務", "負責單位", "單位類別", "問題摘要", "問題類型", "嚴重程度", "處理狀態", "通報日期", "評估日期", "改善期限", "結案日期", "逾期天數", "功能落差"];
  const rows = cases.map((c) => {
    const ag = agencyById(c.agency);
    return [c.id, serviceById(c.service)?.name || c.serviceName || "", ag?.name || c.agencyName || "", ag ? AGENCY_TYPE[ag.type] : "",
      c.title, c.type || "", c.severity ? SEVERITY[c.severity] : "未分級", STATUS[c.status], fmt(c.reportedAt), fmt(c.assessedAt),
      fmt(dueAt(c)), fmt(c.closedAt), overdueDays(c) || "", c.gap ? "是" : ""];
  });
  return [head, ...rows];
}
