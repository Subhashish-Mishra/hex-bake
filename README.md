# Solid Overlay Calc

**Live demo → [solidoverlaycalc.github.io](https://solidoverlaycalc.github.io)** *(update with your actual Pages URL)*

A precision **alpha blending calculator** that resolves the exact solid color produced when a semi-transparent overlay sits over a solid background. Zero dependencies. Pure HTML + CSS + JS.

![Solid Overlay Calc screenshot](https://via.placeholder.com/860x480/0d1526/38bdf8?text=Solid+Overlay+Calc)

---

## What It Does

Given:
- A **solid base color** (background)
- A **semi-transparent overlay color** (with configurable opacity)

It computes the **resulting flat solid color** using the standard Porter-Duff alpha compositing formula:

```
C_final = C_overlay × α + C_background × (1 − α)
```

Applied independently to each R, G, B channel.

---

## Features

- 🎨 **Color picker + HEX + RGB/RGBA** inputs — all stay in sync
- 🎚️ **Smooth alpha slider** with fill track and live percentage display
- 👁️ **Dual live preview** — stacked layers view and the resolved solid
- 📋 **One-click copy** for HEX and RGB output values
- 🔄 **Swap button** to instantly flip background and overlay
- 📐 **Formula card** explaining the math with color-coded variables
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- ♿ **Accessible** — ARIA labels, semantic HTML, keyboard navigable

---

## Use Cases

- Finding the equivalent `background-color` CSS value for `rgba()` overlays on a known background
- Matching colors when you can't use transparency in your target format (PDF, SVG export, canvas)
- UI design token generation — verifying contrast ratios on overlaid tints

---

## Getting Started

```bash
git clone https://github.com/<your-username>/Solid_Overlay_Calc.git
cd Solid_Overlay_Calc
# Open index.html in your browser — no build step required
```

---

## Deploying to GitHub Pages

1. Push to a `main` branch on GitHub
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch`, branch `main`, root `/`
4. Your site will be live at `https://<your-username>.github.io/Solid_Overlay_Calc/`

---

## Project Structure

```
Solid_Overlay_Calc/
├── index.html    # Markup + semantic structure
├── style.css     # Design system & component styles
└── app.js        # Calculator logic, copy, swap, sync
```

---

## License

MIT
