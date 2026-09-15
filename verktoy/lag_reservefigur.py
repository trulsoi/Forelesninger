"""Make a static fallback from the same s(t)=5t² example as the activity."""
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
plt.rcParams.update({"font.size": 14, "svg.fonttype": "none"})
t = np.linspace(0.4, 1.6, 301)
s = lambda t: 5*t**2
t0, h = 1.0, 0.2
fig, ax = plt.subplots(figsize=(10, 5.8), layout="constrained")
fig.patch.set_facecolor("#f9f5e9")
ax.set_facecolor("#f9f5e9")
ax.plot(t, s(t), color="#458588", linewidth=3, label="Posisjon s(t) = 5t²")
ax.plot(t, s(t0) + 10*(t-t0), "--", color="#79740e", linewidth=2.5, label="Tangent ved t = 1: 10 m/s")
ax.plot(t, s(t0) + 11*(t-t0), color="#d79921", linewidth=2.5, label="Foroversekant: 11 m/s")
ax.scatter([1, 1.2], [5, 7.2], color=["#458588", "#d79921"], s=80, zorder=5)
ax.annotate("A: (1,0 s; 5,0 m)", (1, 5), xytext=(0.52, 5.4), arrowprops={"arrowstyle":"->"})
ax.annotate("B: (1,2 s; 7,2 m)", (1.2, 7.2), xytext=(1.19, 9), arrowprops={"arrowstyle":"->"})
ax.set(xlabel="Tid t (s)", ylabel="Posisjon s (m)", xlim=(0.4,1.6), ylim=(0,13),
       title="To målepunkter gir en sekant · h = 0,2 s")
ax.grid(alpha=0.2)
ax.legend(loc="upper left", fontsize=11)
target = ROOT / "aktiviteter/numerisk-derivasjon/sekant-tangent.svg"
fig.savefig(target)
plt.close(fig)
print(target)
