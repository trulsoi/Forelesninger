"""Execute the teaching notebook from a fresh kernel and check numeric claims."""
import os
from pathlib import Path
import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "Uke38_Numerisk_derivasjon_arrays.ipynb"
nb = nbformat.read(path, as_version=4)
nbformat.validate(nb)
# Kernel execution avoids relying on the instructor's existing Python state.
checks = nbformat.v4.new_code_cell("""
import numpy.testing as npt
npt.assert_allclose([derivert_forover, derivert_bakover, derivert_senter], [3.64, 2.44, 3.04])
npt.assert_allclose([fart_forover, fart_bakover, fart_senter], [11, 9, 10])
npt.assert_allclose(senter - eksakt, 0.04, atol=1e-12)
npt.assert_allclose([abs(d_stor - 3), abs(d_liten - 3)], [0.04, 0.01])
npt.assert_allclose(relativ_feil, 0.04 / (3 * x_rel**2), atol=1e-12)
assert np.isfinite(relativ_feil).all()
assert len(punkter) == 101 and punkter[0] == 0 and punkter[-1] == 10
assert not plt.get_fignums(), "Figures should be shown and closed by the inline backend"
print("All numerical checks passed")
""")
nb.cells.insert(0, nbformat.v4.new_code_cell("%matplotlib inline"))
nb.cells.append(checks)
client = NotebookClient(nb, timeout=90, kernel_name="python3",
                        resources={"metadata": {"path": str(ROOT)}})
client.execute()
print(nb.cells[-1].outputs[0].text)
nb.cells.pop()
nb.cells.pop(0)
errors = [o for c in nb.cells for o in c.get("outputs", []) if o.output_type == "error"]
plots = [o for c in nb.cells for o in c.get("outputs", [])
         if "image/png" in o.get("data", {})]
assert not errors
assert len(plots) == 5, f"Expected five plots, got {len(plots)}"
nbformat.write(nb, path)
print(f"Executed {sum(c.cell_type == 'code' for c in nb.cells)} code cells; {len(plots)} plots; no errors.")
