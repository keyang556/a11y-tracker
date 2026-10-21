import { loadCases, fmt } from "../store.js";
import { initCommon, h } from "../ui.js";
import { renderKpis, caseListItem } from "../stats.js";
import { setError, clearError } from "../forms.js";

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
