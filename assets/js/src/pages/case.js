import {
  getCase, updateCase, getRole, roleLabel, AGENCIES, AGENCY_TYPE, WCAG, SEVERITY, SEVERITY_DESC, SEV_DAYS, STATUS,
  serviceById, agencyById, dueAt, altDueAt, overdueDays, altOverdueDays, isPrivate, today, fmt, wcagLabel, addDays,
} from "../store.js";
import { initCommon, h, param, statusChip, severityChip, overdueTag, focusEl } from "../ui.js";
import { setError, clearErrors, focusFirst, checkedValue } from "../forms.js";

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
