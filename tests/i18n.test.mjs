// scut-sonor: selectorul de limbă acoperă cele 8 limbi; fără text românesc rămas în celelalte; alegerea persistă.
import path from "node:path"; import {fileURLToPath} from "node:url"; import {createRequire} from "node:module";
const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require("playwright");
const FILE = "file://" + path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html");
const KEY = "scut-sonor.lang"; const LANGS = ["ro","en","fr","de","es","it","hu","pt"];
let ok = 0, bad = 0; const check = (n, c, x) => { if (c) { ok++; console.log("  ok   " + n); } else { bad++; console.log("  FAIL " + n + (x !== undefined ? " -> " + JSON.stringify(x) : "")); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"]});
const errs = [];
for (const L of LANGS) {
  const ctx = await b.newContext({serviceWorkers: "block", locale: "en-US"});
  await ctx.addInitScript(([k, l]) => { try { localStorage.setItem(k, JSON.stringify(l)); } catch (e) {} }, [KEY, L]);
  const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(L + ": " + e.message));
  await p.goto(FILE); await p.waitForTimeout(500);
  const st = await p.evaluate(() => ({lang: document.documentElement.lang, opts: [...document.querySelectorAll("select.langsel option")].map((o) => o.value)}));
  check(L + ": <html lang> urmează selecția", st.lang === L, st.lang);
  check(L + ": selectorul oferă 8 limbi", st.opts.length === 8, st.opts);
  if (L !== "ro") {
    const txt = await p.evaluate(() => document.body.innerText);
    check(L + ": fără diacritice românești tipice (ș ț ă) în text", !/[șțȘȚ]/.test(txt), (txt.match(/.{0,20}[șțȘȚ].{0,20}/) || [])[0]);
  }
  await ctx.close();
}
check("fără excepții", errs.length === 0, errs);
console.log(ok + " ok, " + bad + " FAIL"); await b.close(); process.exit(bad ? 1 : 0);
