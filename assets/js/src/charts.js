// 無障礙圖表：SVG 以 role="img" 提供名稱與摘要，並一律附上資料表。
// 顏色之外另以標記形狀、線型與文字標示區分資料系列。
// 圖表依容器的實際寬度繪製，文字維持真實像素大小，不會因縮放而變小。
import { h, svg, tableRegion } from "./ui.js";

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

function dataTable(caption, headers, rows) {
  const table = h("table", { class: "data-table" },
    h("caption", {}, caption),
    h("thead", {}, h("tr", {}, headers.map((t, i) => h("th", { scope: "col", class: i ? "num" : null }, t)))),
    h("tbody", {}, rows.map((r) => h("tr", {}, r.map((v, i) => (i === 0 ? h("th", { scope: "row" }, v) : h("td", { class: "num" }, v)))))),
  );
  return h("details", { class: "chart-data" }, h("summary", {}, "以表格檢視資料"), tableRegion(caption, table));
}

function card(title, summary, drawSvg, table, extra) {
  const tid = nextId("chart-title");
  const did = nextId("chart-desc");
  const holder = h("div", { class: "chart-holder" });
  let lastW = 0;
  const draw = (w) => {
    w = Math.max(240, Math.floor(w));
    if (Math.abs(w - lastW) < 6) return;
    lastW = w;
    const s = drawSvg(w);
    s.setAttribute("role", "img");
    s.setAttribute("aria-labelledby", `${tid} ${did}`);
    s.setAttribute("focusable", "false");
    holder.replaceChildren(s);
  };
  draw(520);
  if ("ResizeObserver" in window) {
    new ResizeObserver((entries) => { for (const e of entries) draw(e.contentRect.width); }).observe(holder);
  }
  return h("section", { class: "chart-card" },
    h("h3", { id: tid }, title),
    h("p", { id: did, class: "chart-summary" }, summary),
    holder,
    extra || null,
    table,
  );
}

// 水平長條圖：寬度不足時，標籤改放在長條上方
export function barChart({ title, items, unit = "件" }) {
  const max = Math.max(1, ...items.map((d) => d.value));
  const draw = (width) => {
    const stacked = width < 440;
    const rowH = stacked ? 54 : 40;
    const left = stacked ? 0 : 160;
    const right = 52;
    const height = items.length * rowH + 12;
    const g = svg("svg", { viewBox: `0 0 ${width} ${height}`, width, height, class: "chart chart-bar" });
    items.forEach((d, i) => {
      const y = 6 + i * rowH;
      const w = Math.max(2, ((width - left - right) * d.value) / max);
      const barY = stacked ? y + 24 : y + 6;
      const barH = stacked ? 22 : rowH - 14;
      g.append(
        stacked
          ? svg("text", { x: 0, y: y + 14, class: "axis-label" }, d.label)
          : svg("text", { x: left - 10, y: y + rowH / 2, class: "axis-label", "text-anchor": "end", "dominant-baseline": "middle" }, d.label),
        svg("rect", { x: left, y: barY, width: w, height: barH, class: "bar series-1", rx: 4 }),
        svg("text", { x: left + w + 8, y: barY + barH / 2, class: "value-label", "dominant-baseline": "middle" }, `${d.value}`),
      );
    });
    return g;
  };
  const summary = items.map((d) => `${d.label} ${d.value} ${unit}`).join("、") + "。";
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["項目", `數量（${unit}）`], items.map((d) => [d.label, d.value])));
}

const MARKERS = ["circle", "square", "triangle", "diamond"];
function marker(kind, x, y, cls) {
  const s = 5;
  if (kind === "square") return svg("rect", { x: x - s, y: y - s, width: s * 2, height: s * 2, class: cls });
  if (kind === "triangle") return svg("polygon", { points: `${x},${y - s - 1} ${x + s + 1},${y + s} ${x - s - 1},${y + s}`, class: cls });
  if (kind === "diamond") return svg("polygon", { points: `${x},${y - s - 1} ${x + s + 1},${y} ${x},${y + s + 1} ${x - s - 1},${y}`, class: cls });
  return svg("circle", { cx: x, cy: y, r: s, class: cls });
}

// 折線圖：多系列
export function lineChart({ title, categories, series, unit = "件" }) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const step = Math.ceil(max / 5 / 5) * 5 || 1;
  const yMax = step * 5;
  const draw = (width) => {
    const height = Math.round(Math.min(320, Math.max(230, width * 0.55)));
    const left = 40, right = 16, top = 14, bottom = 34;
    const x = (i) => left + (i * (width - left - right)) / Math.max(1, categories.length - 1);
    const y = (v) => top + (height - top - bottom) * (1 - v / yMax);
    const g = svg("svg", { viewBox: `0 0 ${width} ${height}`, width, height, class: "chart chart-line" });
    for (let t = 0; t <= 5; t++) {
      const v = step * t;
      g.append(svg("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), class: "grid" }),
        svg("text", { x: left - 8, y: y(v), class: "axis-label small", "text-anchor": "end", "dominant-baseline": "middle" }, v));
    }
    categories.forEach((c, i) => g.append(svg("text", { x: x(i), y: height - 10, class: "axis-label small", "text-anchor": "middle" }, c)));
    series.forEach((s, si) => {
      g.append(svg("polyline", { points: s.values.map((v, i) => `${x(i)},${y(v)}`).join(" "), class: `line series-${si + 1} dash-${si + 1}`, fill: "none" }));
      s.values.forEach((v, i) => g.append(marker(MARKERS[si % 4], x(i), y(v), `marker series-${si + 1}`)));
    });
    return g;
  };
  const legend = h("ul", { class: "legend" }, series.map((s, si) => {
    const sw = svg("svg", { viewBox: "0 0 36 14", width: 36, height: 14, "aria-hidden": "true", focusable: "false" },
      svg("line", { x1: 2, x2: 34, y1: 7, y2: 7, class: `line series-${si + 1} dash-${si + 1}` }),
      marker(MARKERS[si % 4], 18, 7, `marker series-${si + 1}`));
    return h("li", {}, sw, s.name);
  }));
  const last = categories.length - 1;
  const summary = `${categories[0]}至${categories[last]}。` + series.map((s) => `${s.name}由 ${s.values[0]} ${unit}變為 ${s.values[last]} ${unit}`).join("；") + "。";
  const rows = categories.map((c, i) => [c, ...series.map((s) => s.values[i])]);
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["月份", ...series.map((s) => s.name)], rows), legend);
}

// 環圈圖：區塊之間以背景色分隔，圖例附數值與百分比
export function donutChart({ title, items, unit = "件" }) {
  const size = 240, r = 100, inner = 62, cx = size / 2, cy = size / 2;
  const total = items.reduce((a, d) => a + d.value, 0) || 1;
  const draw = () => {
    const g = svg("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, class: "chart chart-donut" });
    let angle = -Math.PI / 2;
    items.forEach((d, i) => {
      if (!d.value) return;
      const a2 = angle + (2 * Math.PI * d.value) / total;
      const large = a2 - angle > Math.PI ? 1 : 0;
      const p = (rad, rr) => `${cx + rr * Math.cos(rad)},${cy + rr * Math.sin(rad)}`;
      const path = d.value === total
        ? `M ${p(0, r)} A ${r} ${r} 0 1 1 ${p(Math.PI, r)} A ${r} ${r} 0 1 1 ${p(0, r)} Z M ${p(0, inner)} A ${inner} ${inner} 0 1 0 ${p(Math.PI, inner)} A ${inner} ${inner} 0 1 0 ${p(0, inner)} Z`
        : `M ${p(angle, r)} A ${r} ${r} 0 ${large} 1 ${p(a2, r)} L ${p(a2, inner)} A ${inner} ${inner} 0 ${large} 0 ${p(angle, inner)} Z`;
      g.append(svg("path", { d: path, class: `slice series-${i + 1}` }));
      angle = a2;
    });
    g.append(svg("text", { x: cx, y: cy - 4, class: "donut-total", "text-anchor": "middle" }, total),
      svg("text", { x: cx, y: cy + 20, class: "axis-label small", "text-anchor": "middle" }, unit));
    return g;
  };
  const pct = (v) => `${Math.round((v / total) * 1000) / 10}%`;
  const legend = h("ul", { class: "legend legend-values" }, items.map((d, i) => h("li", {},
    svg("svg", { viewBox: "0 0 14 14", width: 14, height: 14, "aria-hidden": "true", focusable: "false" }, svg("rect", { x: 1, y: 1, width: 12, height: 12, class: `slice series-${i + 1}` })),
    `${d.label}：${d.value} ${unit}（${pct(d.value)}）`)));
  const summary = `共 ${total} ${unit}。` + items.map((d) => `${d.label} ${pct(d.value)}`).join("、") + "。";
  return card(title, summary, draw, dataTable(`${title}（資料表）`, ["類型", `數量（${unit}）`, "比例"], items.map((d) => [d.label, d.value, pct(d.value)])), legend);
}
