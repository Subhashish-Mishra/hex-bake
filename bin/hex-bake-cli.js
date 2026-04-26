#!/usr/bin/env node

import { parseColorString, blendColors } from '../lib/blender-engine.js';

const commandArgs = process.argv.slice(2);

function displayHelp() {
  console.log(`
  HexBake CLI — Alpha Blending Calculator

  Usage:
    hexbake <base_color> <overlay_color> [alpha]

  Examples:
    hexbake "#FF0000" "#0000FF" 0.5
    hexbake "rgb(255,0,0)" "rgba(0,0,255,0.5)"
    hexbake "#F00" "#00F7"

  Arguments:
    base_color     Solid background color (HEX or RGB)
    overlay_color  Top layer color (HEX, RGB, or RGBA)
    alpha          Optional opacity (0.0 to 1.0), overrides alpha in overlay_color if provided
  `);
  process.exit(0);
}

if (commandArgs.length < 2 || commandArgs.includes('--help') || commandArgs.includes('-h')) {
  displayHelp();
}

const backgroundInput = commandArgs[0];
const overlayInput = commandArgs[1];
const alphaInput = commandArgs[2];

const backgroundColor = parseColorString(backgroundInput);
const overlayColor = parseColorString(overlayInput);
const alphaValue = alphaInput !== undefined ? parseFloat(alphaInput) : overlayColor.a;

const result = blendColors(backgroundColor, overlayColor, alphaValue);

console.log(`
  Background:  ${backgroundInput}
  Overlay:     ${overlayInput} (Alpha: ${alphaValue.toFixed(2)})
  -------------------------
  Result HEX:  \x1b[1m${result.hex}\x1b[0m
  Result RGB:  \x1b[1m${result.rgb}\x1b[0m
`);
