"""以 Playwright + axe-core 檢測每頁（淺色、深色、窄螢幕），並跑完整處理流程。"""
import json, sys, os, time
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
SHOTS = sys.argv[2]
AXE = open(os.environ.get("AXE_PATH", "node_modules/axe-core/axe.min.js"), encoding="utf-8").read()
os.makedirs(SHOTS, exist_ok=True)
TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]
results = {"violations": [], "checks": []}


def axe(page, label):
    page.add_script_tag(content=AXE)
    r = page.evaluate("""async (tags) => {
      const res = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations','incomplete'] });
      return { v: res.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0,5).map(n => ({ t: n.target.join(' '), s: n.failureSummary })) })),
               inc: res.incomplete.filter(i => i.id === 'color-contrast').map(i => i.nodes.length) };
    }""", TAGS)
    for v in r["v"]:
        results["violations"].append({"page": label, **v})
    return r


def check(cond, msg):
    results["checks"].append(("PASS" if cond else "FAIL", msg))


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-proxy-server"])
        errors = []
        for scheme in ["light", "dark"]:
            ctx = browser.new_context(color_scheme=scheme, viewport={"width": 1280, "height": 900}, locale="zh-TW")
            page = ctx.new_page()
            page.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type in ("error",) else None)
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            for name in ["index", "report", "cases", "case?id=A11Y-2026-0001", "dashboard", "agencies", "workbench", "about"]:
                page.goto(f"{BASE}/{name if '?' in name else name + '.html'}".replace("case?id", "case.html?id"))
                page.wait_for_load_state("networkidle")
                if name == "dashboard":
                    for d in page.query_selector_all("details"):
                        d.evaluate("el => el.open = true")
                axe(page, f"{name} [{scheme}]")
                h1 = page.locator("h1").count()
                check(h1 == 1, f"{name} [{scheme}] 只有一個 h1（{h1}）")
                safe = name.replace("?", "_").replace("=", "-")
                page.screenshot(path=f"{SHOTS}/{safe}-{scheme}.png", full_page=True)
            ctx.close()

        # 窄螢幕（320 CSS px）重排
        ctx = browser.new_context(viewport={"width": 320, "height": 800})
        page = ctx.new_page()
        for name in ["index", "report", "cases", "dashboard"]:
            page.goto(f"{BASE}/{name}.html"); page.wait_for_load_state("networkidle")
            sw = page.evaluate("document.documentElement.scrollWidth")
            check(sw <= 322, f"{name} 在 320px 寬度不需水平捲動（scrollWidth={sw}）")
            page.screenshot(path=f"{SHOTS}/{name}-mobile.png", full_page=True)
        ctx.close()

        ctx = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.goto(f"{BASE}/index.html"); page.wait_for_load_state("networkidle")
        page.keyboard.press("Tab")
        check(page.evaluate("document.activeElement.className") == "skip-link", "第一個 Tab 停在「跳到主要內容」")
        page.keyboard.press("Enter")
        check(page.evaluate("document.activeElement.id") == "main", "跳過連結把焦點移到主要內容")

        # 焦點樣式：Tab 走過整頁
        missing = []
        for _ in range(40):
            page.keyboard.press("Tab")
            info = page.evaluate("""() => { const e = document.activeElement; const s = getComputedStyle(e);
              return { tag: e.tagName, text: (e.textContent||'').trim().slice(0,20), o: s.outlineStyle, w: s.outlineWidth, bs: s.boxShadow }; }""")
            if info["tag"] != "BODY" and info["o"] == "none" and info["bs"] == "none":
                missing.append(info)
        check(not missing, f"所有可聚焦元素都有焦點樣式（缺少：{missing[:3]}）")

        # 重設對話框：焦點落在取消、Esc 關閉後回到按鈕
        page.click("#reset-btn")
        check(page.evaluate("document.activeElement.hasAttribute('data-cancel')"), "對話框開啟時焦點在「取消」")
        page.keyboard.press("Escape")
        check(page.evaluate("document.activeElement.id") == "reset-btn", "Esc 關閉對話框後焦點回到觸發按鈕")

        # 通報表單：空白送出
        page.goto(f"{BASE}/report.html"); page.wait_for_load_state("networkidle")
        # 等 Turnstile 測試金鑰自動通過，錯誤摘要才會固定是 7 個欄位
        page.wait_for_function("document.querySelector('#f-turnstile [name=cf-turnstile-response]')?.value")
        page.click("#report-form button[type=submit]")
        check(page.evaluate("document.activeElement.id") == "error-summary", "空白送出時焦點移到錯誤摘要")
        n_err = page.locator("#error-summary li").count()
        check(n_err == 7, f"錯誤摘要列出 7 個必填欄位（實際 {n_err}）")
        inv = page.evaluate("document.querySelectorAll('[aria-invalid=true]').length")
        check(inv >= 5, f"錯誤欄位標記 aria-invalid（{inv}）")
        desc = page.get_attribute("#f-email", "aria-describedby") or ""
        check("f-email-error" in desc, "錯誤訊息以 aria-describedby 連到欄位")
        page.click("#error-summary li >> nth=0 >> a")
        check(page.evaluate("document.activeElement.id") == "f-service", "點錯誤摘要的連結會跳到該欄位")
        axe(page, "report [錯誤狀態]")
        page.screenshot(path=f"{SHOTS}/report-errors.png", full_page=True)

        # 正確送出
        page.select_option("#f-service", "mrt-std")
        check("臺北大眾捷運" in page.inner_text("#f-agency"), "選擇服務後自動帶出負責單位")
        page.fill("#f-location", "首頁 > 我的票卡")
        page.check("#f-imp-block")
        page.check("#f-type-0")
        page.fill("#f-title", "我的票卡頁面無法以旁白讀取餘額")
        page.fill("#f-desc", "開啟旁白後，票卡餘額只念出「圖像」。")
        page.fill("#f-steps", "開啟 VoiceOver\n進入我的票卡")
        page.fill("#f-name", "測試者")
        page.fill("#f-email", "test@example.com")
        page.check("#f-at-2")
        page.check("#f-consent")
        page.click("#report-form button[type=submit]")
        check(page.evaluate("document.activeElement.id") == "done-title", "送出成功後焦點移到「通報已送出」")
        new_id = page.inner_text("#done-body strong")
        check(new_id.startswith("A11Y-"), f"取得新案件編號 {new_id}")
        axe(page, "report [送出成功]")

        # 案件查詢：篩選、排序
        page.goto(f"{BASE}/cases.html"); page.wait_for_load_state("networkidle")
        page.select_option("#f-status", "new")
        page.click("#filter-form button[type=submit]")
        check(page.evaluate("document.activeElement.id") == "results-heading", "套用篩選後焦點移到結果標題")
        check(new_id in page.inner_text("#results"), "新通報出現在待評估案件中")
        page.click("button.sort-btn[data-key=id]")
        check(page.evaluate("document.activeElement.dataset.key") == "id", "排序後焦點留在同一個排序按鈕")
        check(page.get_attribute("th[aria-sort]", "aria-sort") in ("ascending", "descending"), "排序欄位有 aria-sort")
        time.sleep(0.3)
        check("排序" in page.inner_text("#live"), "排序結果以狀態訊息播報")
        axe(page, "cases [篩選後]")

        # 完整流程：審查員評估
        def role(r, agency=None):
            page.goto(f"{BASE}/workbench.html"); page.wait_for_load_state("networkidle")
            page.check(f"#r-{r}")
            if agency: page.select_option("#r-agency-select", agency)
            page.click("#role-form button[type=submit]")

        role("reviewer")
        check(new_id in page.inner_text("#tasks"), "審查員工作台列出新通報")
        axe(page, "workbench [審查員]")
        page.goto(f"{BASE}/case.html?id={new_id}#actions"); page.wait_for_load_state("networkidle")
        check(page.evaluate("document.activeElement.id") == "actions-title", "從工作台進入時焦點在「處理動作」")
        page.click("#actions button[type=submit] >> nth=0")
        check(page.evaluate("document.activeElement.id") == "a-sev-0", "未選等級送出時焦點移到第一個選項")
        axe(page, "case [審查員錯誤狀態]")
        page.check("#a-sev-0")
        page.click("#actions form >> nth=0 >> button[type=submit]")
        check("已完成評估" in page.inner_text("#status-box"), "評估完成並顯示訊息")
        check(page.evaluate("document.activeElement.closest('#status-box') !== null"), "評估後焦點移到狀態訊息")
        check("改善中" in page.inner_text(".case-meta"), "狀態變為改善中")
        axe(page, "case [改善中]")

        # 機關承辦人：提供替代管道與回報修正
        role("agency", "trtc")
        page.goto(f"{BASE}/case.html?id={new_id}"); page.wait_for_load_state("networkidle")
        page.fill("#a-alt", "客服專線協助查詢票卡餘額")
        page.click("#a-alt >> xpath=ancestor::form >> button[type=submit]")
        check("已登錄替代管道" in page.inner_text("#status-box"), "機關登錄替代管道")
        page.fill("#a-fix", "票卡餘額加上文字標籤")
        page.click("#a-fix >> xpath=ancestor::form >> button[type=submit]")
        check("待複驗" in page.inner_text(".case-meta"), "機關回報修正後轉為待複驗")

        # 複驗員：未通過
        role("tester")
        page.goto(f"{BASE}/case.html?id={new_id}"); page.wait_for_load_state("networkidle")
        page.check("#a-result-1")
        page.click("#a-result-note >> xpath=ancestor::form >> button[type=submit]")
        check(page.evaluate("document.activeElement.id") == "a-result-note", "未通過但未填說明時焦點移到說明欄")
        page.fill("#a-result-note", "餘額仍只念出圖像")
        page.click("#a-result-note >> xpath=ancestor::form >> button[type=submit]")
        check("複驗未通過" in page.inner_text(".case-meta"), "複驗未通過後退回列管")

        # 機關再修正，複驗通過
        role("agency", "trtc")
        page.goto(f"{BASE}/case.html?id={new_id}"); page.wait_for_load_state("networkidle")
        page.fill("#a-fix", "改用可讀取的文字元件")
        page.click("#a-fix >> xpath=ancestor::form >> button[type=submit]")
        role("tester")
        page.goto(f"{BASE}/case.html?id={new_id}"); page.wait_for_load_state("networkidle")
        page.check("#a-result-0")
        page.click("#a-result-note >> xpath=ancestor::form >> button[type=submit]")
        check("已結案" in page.inner_text(".case-meta"), "複驗通過後結案")
        n_ev = page.locator(".timeline li").count()
        check(n_ev >= 8, f"處理歷程完整記錄（{n_ev} 筆）")
        axe(page, "case [已結案]")
        page.screenshot(path=f"{SHOTS}/case-closed.png", full_page=True)

        # 逾期督促
        role("reviewer")
        page.goto(f"{BASE}/cases.html?overdue=1"); page.wait_for_load_state("networkidle")
        first = page.locator("#results tbody tr th a").first.inner_text()
        page.goto(f"{BASE}/case.html?id={first}"); page.wait_for_load_state("networkidle")
        page.click("text=發出逾期督促通知")
        check("逾期督促" in page.inner_text(".timeline"), "審查員可發出逾期督促")

        # 重設資料：確認後重新載入，訊息取得焦點
        page.goto(f"{BASE}/dashboard.html"); page.wait_for_load_state("networkidle")
        page.click("#reset-btn")
        page.click("[data-confirm]")
        page.wait_for_load_state("networkidle"); time.sleep(0.3)
        check(page.evaluate("document.activeElement.id") == "flash", "重設後焦點移到「模擬資料已重設」訊息")
        page.goto(f"{BASE}/case.html?id={new_id}"); page.wait_for_load_state("networkidle")
        check(page.inner_text("h1") == "找不到案件", "重設後新增的案件已清除")
        n_land = page.evaluate("document.querySelectorAll('header, nav, main, footer, [role=region], section[aria-labelledby], form[role=search]').length")
        check(n_land <= 8, f"地標數量適中（{n_land}）")

        # 直接開啟檔案（file://）也要能讀到模擬資料
        site = os.environ.get("SITE_DIR") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if os.path.exists(os.path.join(site, "index.html")):
            fctx = browser.new_context()
            fp = fctx.new_page()
            fp.on("pageerror", lambda e: errors.append(f"file:// pageerror: {e}"))
            fp.goto("file://" + os.path.join(site, "index.html")); fp.wait_for_timeout(500)
            check(fp.evaluate("document.getElementById('home-kpis').children.length") == 5, "直接開啟 index.html（file://）會顯示重點數字")
            fp.goto("file://" + os.path.join(site, "cases.html")); fp.wait_for_timeout(500)
            check(fp.evaluate("document.querySelectorAll('#results tbody tr').length") > 0, "直接開啟 cases.html（file://）會列出案件")
            fctx.close()

        check(not errors, f"沒有 JavaScript 錯誤（{errors[:3]}）")
        browser.close()


run()
print(json.dumps(results, ensure_ascii=False, indent=1))
