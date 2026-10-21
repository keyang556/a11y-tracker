// 表單驗證：錯誤訊息以 aria-describedby 連結欄位，送出時焦點移到錯誤摘要
import { h } from "./ui.js";

function addDescribedBy(el, id) {
  const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
  if (!ids.includes(id)) el.setAttribute("aria-describedby", [id, ...ids].join(" "));
}
function removeDescribedBy(el, id) {
  const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter((x) => x && x !== id);
  if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
  else el.removeAttribute("aria-describedby");
}

export function clearError(target) {
  const id = `${target.id}-error`;
  document.getElementById(id)?.remove();
  removeDescribedBy(target, id);
  target.removeAttribute("aria-invalid");
}

export function clearErrors(form) {
  form.querySelectorAll(".error-msg").forEach((e) => e.remove());
  form.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
  form.querySelectorAll("[aria-describedby]").forEach((e) => {
    const ids = e.getAttribute("aria-describedby").split(/\s+/).filter((x) => x && !x.endsWith("-error"));
    if (ids.length) e.setAttribute("aria-describedby", ids.join(" "));
    else e.removeAttribute("aria-describedby");
  });
}

// target：輸入欄位，或一組選項的 fieldset
export function setError(target, message) {
  const id = `${target.id}-error`;
  document.getElementById(id)?.remove();
  const msg = h("span", { class: "error-msg", id }, message);
  if (target.tagName === "FIELDSET") {
    target.querySelector("legend").after(msg);
    addDescribedBy(target, id);
  } else {
    target.before(msg);
    target.setAttribute("aria-invalid", "true");
    addDescribedBy(target, id);
  }
}

// errors: [{ target, focus, message, label }]
export function showSummary(box, errors) {
  box.replaceChildren(
    h("h2", {}, `有 ${errors.length} 個欄位需要修正`),
    h("ul", {}, errors.map((e) => h("li", {},
      h("a", { href: `#${e.focus.id}`, onclick: (ev) => { ev.preventDefault(); e.focus.focus(); } }, `${e.label}：${e.message}`)))),
  );
  box.hidden = false;
  box.focus();
}

export function hideSummary(box) { box.hidden = true; box.replaceChildren(); }

// 動作表單用：沒有摘要時，直接把焦點移到第一個錯誤欄位
export function focusFirst(errors) { if (errors.length) errors[0].focus.focus(); }

export function checkedValue(form, name) {
  const el = form.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}
