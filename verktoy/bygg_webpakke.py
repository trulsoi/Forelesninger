"""Render slides and collect a portable web tree. Does not publish or touch Git."""
import argparse
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("output", type=Path, help="New output directory, e.g. /tmp/inga-web")
args = parser.parse_args()
output = args.output.resolve()
if output.exists():
    parser.error(f"Output already exists: {output}; choose a new directory")

slides = ROOT / "slides/numerisk-derivasjon"
subprocess.run(["quarto", "render"], cwd=slides, check=True)
target = output / "INGA1002/forelesning/03-numerisk-derivasjon"
target.mkdir(parents=True)
shutil.copy2(slides / "_site/index.html", target / "index.html")
shutil.copy2(ROOT / "Uke38_Numerisk_derivasjon_arrays.ipynb", target)
shutil.copytree(ROOT / "aktiviteter/numerisk-derivasjon",
                output / "INGA1002/aktiviteter/numerisk-derivasjon")
print(f"Web package: {output}")
