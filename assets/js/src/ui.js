// 共用介面元件。所有使用者輸入一律以文字節點插入，不使用 innerHTML。
import {
  STATUS, SEVERITY, getRole, roleLabel, resetData, storageAvailable,
  overdueDays, altOverdueDays, isPrivate,
} from "./store.js";

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, String(v));
  }
  for (const ch of children.flat()) {
    if (ch === null || ch === undefined || ch === false) continue;
    el.append(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

const SVG_NS = "http://www.w3.org/2000/svg";
export function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) el.setAttribute(k, String(v));
  for (const ch of children.flat()) {
    if (ch === null || ch === undefined) continue;
    el.append(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

export function statusChip(c) {
  return h("span", { class: `chip status-${c.status}` }, STATUS[c.status]);
}
export function severityChip(c) {
  if (!c.severity) return h("span", { class: "chip sev-none" }, "未分級");
  return h("span", { class: `chip sev-${c.severity}` }, SEVERITY[c.severity]);
}
export function overdueTag(c) {
  const n = overdueDays(c);
  const alt = altOverdueDays(c);
  const frag = document.createDocumentFragment();
  if (n > 0) frag.append(h("span", { class: "tag-overdue" }, isPrivate(c) ? `超過建議期限 ${n} 天` : `已逾期 ${n} 天`));
  if (alt > 0) frag.append(h("span", { class: "tag-overdue" }, `替代管道逾期 ${alt} 天`));
  return frag;
}

let liveTimer = null;
export function announce(message) {
  const live = document.getElementById("live");
  if (!live) return;
  live.textContent = "";
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => { live.textContent = message; }, 120);
}

export function focusEl(el) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus();
}

export function param(name) { return new URLSearchParams(window.location.search).get(name); }

// 跨頁訊息：例如重設資料後重新載入，在主內容最上方顯示並取得焦點
export function flash(message) {
  try { window.sessionStorage.setItem("a11ytrack:flash", message); } catch { /* 忽略 */ }
}
function showFlash() {
  let msg = null;
  try { msg = window.sessionStorage.getItem("a11ytrack:flash"); window.sessionStorage.removeItem("a11ytrack:flash"); } catch { /* 忽略 */ }
  if (!msg) return;
  const main = document.getElementById("main");
  const box = h("div", { class: "notice notice-success", id: "flash", tabindex: "-1" }, h("p", {}, msg));
  main.prepend(box);
  const go = () => setTimeout(() => box.focus(), 0);
  if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
}

function initResetDialog() {
  const btn = document.getElementById("reset-btn");
  const dlg = document.getElementById("reset-dialog");
  if (!btn || !dlg || typeof dlg.showModal !== "function") return;
  const cancel = dlg.querySelector("[data-cancel]");
  const confirm = dlg.querySelector("[data-confirm]");
  btn.addEventListener("click", () => { dlg.showModal(); cancel.focus(); });
  cancel.addEventListener("click", () => dlg.close());
  confirm.addEventListener("click", () => {
    resetData();
    dlg.close();
    flash("模擬資料已重設為初始狀態。");
    window.location.reload();
  });
  dlg.addEventListener("close", () => btn.focus());
}

export function initCommon() {
  const r = getRole();
  const roleEl = document.getElementById("role-name");
  if (roleEl) roleEl.textContent = roleLabel(r);
  if (!storageAvailable()) {
    const main = document.getElementById("main");
    main.prepend(h("div", { class: "notice notice-warn" }, h("p", {}, "此瀏覽器不允許儲存資料，模擬操作在離開頁面後不會保留。")));
  }
  initResetDialog();
  showFlash();
}

export function caseLink(c) {
  return h("a", { href: `case.html?id=${encodeURIComponent(c.id)}` }, c.id);
}

// 可捲動的資料表容器：鍵盤可聚焦，並有名稱
let capId = 0;
export function tableRegion(label, table) {
  const cap = table.querySelector("caption");
  if (cap) {
    if (!cap.id) cap.id = `tcap-${++capId}`;
    return h("div", { class: "table-wrap", role: "region", "aria-labelledby": cap.id, tabindex: "0" }, table);
  }
  return h("div", { class: "table-wrap", role: "region", "aria-label": label, tabindex: "0" }, table);
}

export function downloadCSV(filename, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
