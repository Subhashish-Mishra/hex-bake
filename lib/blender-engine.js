export function hexToComponent(hex) {
  return parseInt(hex, 16);
}

export function componentToHex(component) {
  const hex = Math.round(Math.max(0, Math.min(255, component))).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function parseColorString(colorString) {
  if (!colorString || typeof colorString !== 'string') {
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  const trimmedColor = colorString.trim();

  const rgbaRegex = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i;
  const rgbaMatches = trimmedColor.match(rgbaRegex);
  if (rgbaMatches) {
    return {
      r: parseFloat(rgbaMatches[1]),
      g: parseFloat(rgbaMatches[2]),
      b: parseFloat(rgbaMatches[3]),
      a: rgbaMatches[4] !== undefined ? parseFloat(rgbaMatches[4]) : 1,
    };
  }

  const hex8Regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const hex8Matches = hex8Regex.exec(trimmedColor);
  if (hex8Matches) {
    return {
      r: hexToComponent(hex8Matches[1]),
      g: hexToComponent(hex8Matches[2]),
      b: hexToComponent(hex8Matches[3]),
      a: hexToComponent(hex8Matches[4]) / 255,
    };
  }

  const hex6Regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const hex6Matches = hex6Regex.exec(trimmedColor);
  if (hex6Matches) {
    return {
      r: hexToComponent(hex6Matches[1]),
      g: hexToComponent(hex6Matches[2]),
      b: hexToComponent(hex6Matches[3]),
      a: 1,
    };
  }

  const hex3Regex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
  const hex3Matches = hex3Regex.exec(trimmedColor);
  if (hex3Matches) {
    return {
      r: hexToComponent(hex3Matches[1] + hex3Matches[1]),
      g: hexToComponent(hex3Matches[2] + hex3Matches[2]),
      b: hexToComponent(hex3Matches[3] + hex3Matches[3]),
      a: hex3Matches[4] ? hexToComponent(hex3Matches[4] + hex3Matches[4]) / 255 : 1,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

export function blendColors(baseLayer, topLayer, opacityOverride = null) {
  const opacity = opacityOverride !== null ? opacityOverride : topLayer.a;
  const finalOpacity = Math.max(0, Math.min(1, isNaN(opacity) ? 1 : opacity));

  const resultRed = Math.round(topLayer.r * finalOpacity + baseLayer.r * (1 - finalOpacity));
  const resultGreen = Math.round(topLayer.g * finalOpacity + baseLayer.g * (1 - finalOpacity));
  const resultBlue = Math.round(topLayer.b * finalOpacity + baseLayer.b * (1 - finalOpacity));

  return {
    r: resultRed,
    g: resultGreen,
    b: resultBlue,
    hex: rgbToHex(resultRed, resultGreen, resultBlue).toUpperCase(),
    rgb: `rgb(${resultRed}, ${resultGreen}, ${resultBlue})`,
  };
}

export function calculateBrightness(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}
