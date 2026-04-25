const els = {
  bgPicker: document.getElementById('bgPicker'),
  bgHex:    document.getElementById('bgHex'),
  bgRgb:    document.getElementById('bgRgb'),
  olPicker: document.getElementById('olPicker'),
  olHex:    document.getElementById('olHex'),
  olRgba:   document.getElementById('olRgba'),
  olAlpha:  document.getElementById('olAlpha'),
  alphaPercent: document.getElementById('alphaPercent'),
  opacityLabel: document.getElementById('opacityLabel'),
  sliderFill: document.getElementById('sliderFill'),
  vBg: document.getElementById('v-bg'),
  vOl: document.getElementById('v-ol'),
  vFn: document.getElementById('v-final'),
  resHex: document.getElementById('resHex'),
  resRgb: document.getElementById('resRgb'),
  swapBtn: document.getElementById('swapBtn'),
};

const componentToHex = (c) => {
  const h = Math.round(Math.max(0, Math.min(255, c))).toString(16);
  return h.length === 1 ? '0' + h : h;
};

const rgbToHex = (r, g, b) => '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);

function parseColor(str) {
  if (!str || typeof str !== 'string') return { r: 0, g: 0, b: 0, a: 1 };
  const trimmed = str.trim();

  const rgbaMatch = trimmed.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (rgbaMatch) {
    return {
      r: parseFloat(rgbaMatch[1]),
      g: parseFloat(rgbaMatch[2]),
      b: parseFloat(rgbaMatch[3]),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(trimmed);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
      a: 1,
    };
  }

  const shortHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(trimmed);
  if (shortHex) {
    return {
      r: parseInt(shortHex[1] + shortHex[1], 16),
      g: parseInt(shortHex[2] + shortHex[2], 16),
      b: parseInt(shortHex[3] + shortHex[3], 16),
      a: 1,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

function update(origin = null) {
  const bg = origin === 'bgHex' ? parseColor(els.bgHex.value)
    : origin === 'bgRgb'  ? parseColor(els.bgRgb.value)
    : parseColor(els.bgPicker.value);

  const ol = origin === 'olHex'  ? parseColor(els.olHex.value)
    : origin === 'olRgba' ? parseColor(els.olRgba.value)
    : parseColor(els.olPicker.value);

  let alpha = parseFloat(els.olAlpha.value);

  if (origin === 'olRgba') {
    const parsed = parseColor(els.olRgba.value);
    if (els.olRgba.value.match(/rgba/i) && !isNaN(parsed.a)) {
      alpha = parsed.a;
      els.olAlpha.value = alpha;
    }
  }

  alpha = Math.max(0, Math.min(1, isNaN(alpha) ? 0.5 : alpha));

  if (origin !== 'bgPicker') els.bgPicker.value = rgbToHex(bg.r, bg.g, bg.b);
  if (origin !== 'bgHex')    els.bgHex.value    = rgbToHex(bg.r, bg.g, bg.b).toUpperCase();
  if (origin !== 'bgRgb')    els.bgRgb.value    = `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`;

  if (origin !== 'olPicker') els.olPicker.value = rgbToHex(ol.r, ol.g, ol.b);
  if (origin !== 'olHex')    els.olHex.value    = rgbToHex(ol.r, ol.g, ol.b).toUpperCase();
  if (origin !== 'olRgba')   els.olRgba.value   = `rgba(${Math.round(ol.r)}, ${Math.round(ol.g)}, ${Math.round(ol.b)}, ${alpha.toFixed(2)})`;

  const pct = Math.round(alpha * 100);
  els.alphaPercent.textContent = pct + '%';
  els.opacityLabel.textContent = pct + '% opacity';
  els.sliderFill.style.width = pct + '%';
  els.olAlpha.setAttribute('aria-valuenow', alpha);

  const rf = Math.round(ol.r * alpha + bg.r * (1 - alpha));
  const gf = Math.round(ol.g * alpha + bg.g * (1 - alpha));
  const bf = Math.round(ol.b * alpha + bg.b * (1 - alpha));

  const finalHex = rgbToHex(rf, gf, bf).toUpperCase();
  const finalRgb = `rgb(${rf}, ${gf}, ${bf})`;

  els.resHex.textContent = finalHex;
  els.resRgb.textContent = finalRgb;

  els.vBg.style.backgroundColor = `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`;
  els.vOl.style.backgroundColor = `rgba(${Math.round(ol.r)}, ${Math.round(ol.g)}, ${Math.round(ol.b)}, ${alpha})`;
  els.vFn.style.backgroundColor = finalRgb;

  const brightness = (rf * 299 + gf * 587 + bf * 114) / 1000;
  const labelColor = brightness > 140 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
  els.vFn.querySelector('.preview-label').style.color = labelColor;
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  }
}

function swapColors() {
  const bgHexVal = els.bgHex.value;
  const bgRgbVal = els.bgRgb.value;
  const bgPickerVal = els.bgPicker.value;

  els.bgPicker.value = els.olPicker.value;
  els.bgHex.value    = els.olHex.value;
  els.bgRgb.value    = els.olRgba.value.replace(/rgba?\(/, 'rgb(').split(',').slice(0,3).join(',') + ')';

  els.olPicker.value = bgPickerVal;
  els.olHex.value    = bgHexVal;

  const parsed = parseColor(bgRgbVal);
  const alpha = parseFloat(els.olAlpha.value);
  els.olRgba.value = `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(parsed.b)}, ${alpha.toFixed(2)})`;

  update();
}

[els.bgPicker, els.bgHex, els.bgRgb].forEach(el =>
  el.addEventListener('input', () => update(el.id))
);
[els.olPicker, els.olHex, els.olRgba, els.olAlpha].forEach(el =>
  el.addEventListener('input', () => update(el.id))
);

document.getElementById('copyHexBtn').addEventListener('click', function () {
  copyText(els.resHex.textContent, this);
});
document.getElementById('copyRgbBtn').addEventListener('click', function () {
  copyText(els.resRgb.textContent, this);
});

els.swapBtn.addEventListener('click', swapColors);

update();
