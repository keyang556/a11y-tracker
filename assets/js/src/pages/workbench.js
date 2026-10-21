import { loadCases, getRole, setRole, roleLabel, AGENCIES, isOpen, overdueDays, altOverdueDays, dueAt } from "../store.js";
import { initCommon, h, announce } from "../ui.js";
import { caseListItem } from "../stats.js";

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
