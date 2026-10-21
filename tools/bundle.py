"""把 assets/js/src 的模組打包成一般 script：assets/js/app.js。

打包後不需要 type="module"，因此直接雙擊開啟 HTML（file://）也能執行，
放上 GitHub Pages 也一樣可以使用。修改 src 內的程式後，在網站根目錄執行：

    python tools/bundle.py
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "js", "src")
OUT = os.path.join(ROOT, "assets", "js", "app.js")

MODULES = ["data", "store", "ui", "forms", "charts", "stats"]  # 依相依順序
PAGES = ["index", "report", "cases", "case", "dashboard", "agencies", "workbench", "about"]

IMPORT_RE = re.compile(r'import\s*\{([^}]*)\}\s*from\s*"([^"]+)";', re.S)


def convert_imports(code):
    def repl(m):
        names = [n.strip() for n in m.group(1).split(",") if n.strip()]
        mod = os.path.splitext(os.path.basename(m.group(2)))[0]
        parts = [n.replace(" as ", ": ") for n in names]
        return "const { " + ", ".join(parts) + " } = __m." + mod + ";"
    code = IMPORT_RE.sub(repl, code)
    if re.search(r"^\s*import\b", code, re.M) or "import(" in code:
        raise SystemExit("不支援的 import 寫法")
    return code


def convert_exports(code):
    names = []
    def reexport(m):
        names.extend(n.strip() for n in m.group(1).split(",") if n.strip())
        return ""
    code = re.sub(r"^export\s*\{([^}]*)\};?\s*$", reexport, code, flags=re.M)
    for m in re.finditer(r"^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)", code, re.M):
        names.append(m.group(1))
    code = re.sub(r"^export\s+", "", code, flags=re.M)
    return code, names


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


parts = [
    "/* 自動產生的檔案，請勿直接修改。原始碼在 assets/js/src，修改後執行 python tools/bundle.py */",
    "(function () {",
    '"use strict";',
    "const __m = {};",
    "const __pages = {};",
]
for name in MODULES:
    code = convert_imports(read(os.path.join(SRC, f"{name}.js")))
    code, names = convert_exports(code)
    parts.append(f"__m.{name} = (function () {{\n{code}\nreturn {{ {', '.join(names)} }};\n}})();")
for name in PAGES:
    code = convert_imports(read(os.path.join(SRC, "pages", f"{name}.js")))
    code, names = convert_exports(code)
    if names:
        raise SystemExit(f"頁面 {name} 不應有 export")
    parts.append(f"__pages[{name!r}] = function () {{\n{code}\n}};")
parts.append("""const page = document.body && document.body.getAttribute("data-page");
if (page && __pages[page]) __pages[page]();
})();""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(parts) + "\n")
print("wrote", os.path.relpath(OUT, ROOT))
