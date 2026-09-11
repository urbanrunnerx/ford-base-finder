"""Copy only the static app into the GitHub Pages /docs publishing folder."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "dist"
destination = ROOT / "docs"

if not (source / "index.html").is_file() or not (source / "install.html").is_file():
    raise SystemExit("App entrypoint and install page are required.")

destination.mkdir(exist_ok=True)
for path in source.rglob("*"):
    if not path.is_file() or ".openai" in path.relative_to(source).parts:
        continue
    target = destination / path.relative_to(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(path, target)
(destination / ".nojekyll").write_text("")
print("GitHub Pages files prepared in docs/.")
