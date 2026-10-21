import { loadCases, SERVICES, AGENCY_TYPE, agencyById, serviceById, isOpen, overdueDays } from "../store.js";
import { initCommon, h, tableRegion } from "../ui.js";

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
