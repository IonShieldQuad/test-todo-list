import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static project entrypoint references its style and app modules", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(html, /href="styles\.css"/);
  assert.match(html, /type="module" src="app\.js"/);
  assert.match(html, /<h1>Список <span>задач<\/span><\/h1>/);
  assert.match(css, /\.page-shell/);
  assert.match(app, /STORAGE_KEY/);
});
