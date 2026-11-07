import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function channelToLinear(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((part) => channelToLinear(Number.parseInt(part, 16)));
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("dark-glass tokens keep the required surfaces and conservative text contrast", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const bodyContrast = contrastRatio("#eef2fb", "#1a3748");
  const secondaryContrast = contrastRatio("#b7c0d4", "#182734");

  assert.match(css, /--text:\s*#eef2fb/);
  assert.match(css, /--text-muted:\s*#b7c0d4/);
  assert.match(css, /--accent:\s*#8b7cff/);
  assert.match(css, /--on-accent:\s*#0b0c14/);
  assert.match(css, /--surface:\s*rgba\(22, 26, 36, \.55\)/);
  assert.match(css, /radial-gradient\(760px 620px at 14% 40px/);
  assert.match(css, /backdrop-filter:\s*var\(--blur-glass\)/);
  assert.match(css, /body\s*\{\s*display:\s*flow-root;/);
  assert.ok(bodyContrast >= 7, `Expected body contrast >= 7:1, got ${bodyContrast.toFixed(2)}:1`);
  assert.ok(secondaryContrast >= 4.5, `Expected secondary contrast >= 4.5:1, got ${secondaryContrast.toFixed(2)}:1`);
});
