import { parseColorString, blendColors, rgbToHex, calculateBrightness } from '../lib/blender-engine.js';

const ui = {
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
  copyHexBtn: document.getElementById('copyHexBtn'),
  copyRgbBtn: document.getElementById('copyRgbBtn'),
};

function updateUI(origin = null) {
  const bg = origin === 'bgHex' ? parseColorString(ui.bgHex.value)
    : origin === 'bgRgb'  ? parseColorString(ui.bgRgb.value)
    : parseColorString(ui.bgPicker.value);

  const ol = origin === 'olHex'  ? parseColorString(ui.olHex.value)
    : origin === 'olRgba' ? parseColorString(ui.olRgba.value)
    : parseColorString(ui.olPicker.value);

  let alpha = parseFloat(ui.olAlpha.value);

  if (origin === 'olRgba') {
    const parsed = parseColorString(ui.olRgba.value);
    if (ui.olRgba.value.match(/rgba/i) && !isNaN(parsed.a)) {
      alpha = parsed.a;
      ui.olAlpha.value = alpha;
    }
  }

  alpha = Math.max(0, Math.min(1, isNaN(alpha) ? 0.5 : alpha));

  if (origin !== 'bgPicker') ui.bgPicker.value = rgbToHex(bg.r, bg.g, bg.b);
  if (origin !== 'bgHex')    ui.bgHex.value    = rgbToHex(bg.r, bg.g, bg.b).toUpperCase();
  if (origin !== 'bgRgb')    ui.bgRgb.value    = `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`;

  if (origin !== 'olPicker') ui.olPicker.value = rgbToHex(ol.r, ol.g, ol.b);
  if (origin !== 'olHex')    ui.olHex.value    = rgbToHex(ol.r, ol.g, ol.b).toUpperCase();
  if (origin !== 'olRgba')   ui.olRgba.value   = `rgba(${Math.round(ol.r)}, ${Math.round(ol.g)}, ${Math.round(ol.b)}, ${alpha.toFixed(2)})`;

  const percentage = Math.round(alpha * 100);
  ui.alphaPercent.textContent = percentage + '%';
  ui.opacityLabel.textContent = percentage + '% opacity';
  ui.sliderFill.style.width = percentage + '%';
  ui.olAlpha.setAttribute('aria-valuenow', alpha);

  const result = blendColors(bg, ol, alpha);

  ui.resHex.textContent = result.hex;
  ui.resRgb.textContent = result.rgb;

  ui.vBg.style.backgroundColor = `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`;
  ui.vOl.style.backgroundColor = `rgba(${Math.round(ol.r)}, ${Math.round(ol.g)}, ${Math.round(ol.b)}, ${alpha})`;
  ui.vFn.style.backgroundColor = result.rgb;

  const brightness = calculateBrightness(result.r, result.g, result.b);
  const labelColor = brightness > 140 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
  ui.vFn.querySelector('.preview-label').style.color = labelColor;
}

async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 2000);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 2000);
  }
}

function handleSwap() {
  const bgHexValue = ui.bgHex.value;
  const bgRgbValue = ui.bgRgb.value;
  const bgPickerValue = ui.bgPicker.value;

  ui.bgPicker.value = ui.olPicker.value;
  ui.bgHex.value    = ui.olHex.value;
  ui.bgRgb.value    = ui.olRgba.value.replace(/rgba?\(/, 'rgb(').split(',').slice(0,3).join(',') + ')';

  ui.olPicker.value = bgPickerValue;
  ui.olHex.value    = bgHexValue;

  const parsedBg = parseColorString(bgRgbValue);
  const currentAlpha = parseFloat(ui.olAlpha.value);
  ui.olRgba.value = `rgba(${Math.round(parsedBg.r)}, ${Math.round(parsedBg.g)}, ${Math.round(parsedBg.b)}, ${currentAlpha.toFixed(2)})`;

  updateUI();
}

[ui.bgPicker, ui.bgHex, ui.bgRgb].forEach(element =>
  element.addEventListener('input', () => updateUI(element.id))
);
[ui.olPicker, ui.olHex, ui.olRgba, ui.olAlpha].forEach(element =>
  element.addEventListener('input', () => updateUI(element.id))
);

ui.copyHexBtn.addEventListener('click', () => copyToClipboard(ui.resHex.textContent, ui.copyHexBtn));
ui.copyRgbBtn.addEventListener('click', () => copyToClipboard(ui.resRgb.textContent, ui.copyRgbBtn));
ui.swapBtn.addEventListener('click', handleSwap);

updateUI();
