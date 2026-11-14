// Teste funcționale Scut Sonor: moduri, emisie (Web Audio real), oprire, intensitate, mod zi, lanternă fără cameră,
// pauză la trecerea în fundal, fără rețea, fără erori.   Rulare: node tests/scut.test.mjs  (PW_ROOT, CHROMIUM_PATH opționale)
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require("playwright");
const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = "file://" + path.join(DIR, "index.html");
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log("  ok   " + n); } else { bad++; console.log("  FAIL " + n + (x !== undefined ? "  -> " + JSON.stringify(x) : "")); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required", "--use-fake-ui-for-media-stream"]});
const errs = [], net = [];
const ctx = await b.newContext({viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, serviceWorkers: "block"});
await ctx.route(/^https?:/, (r) => { net.push(r.request().url()); r.abort(); });
const p = await ctx.newPage();
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
await p.goto(FILE); await p.waitForTimeout(700);
const txt = (s) => p.evaluate((q) => document.querySelector(q).textContent, s);
check("pornește în repaus", (await txt("#status")) === "REPAUS" && (await txt("#emitLabel")) === "EMITE");
for (const [mode, label] of [["alungare", "Alungare"], ["ultra", "Ultrasunet"], ["alarma", "Alarmă"], ["test", "Test difuzor"]]) {
  await p.click(`.mode[data-mode=${mode}]`);
  check("mod " + mode + ": etichetă și aria-pressed", (await txt("#modeVal")) === label && (await p.getAttribute(`.mode[data-mode=${mode}]`, "aria-pressed")) === "true");
  await p.click("#emit"); await p.waitForTimeout(500);
  check("mod " + mode + ": emite (status, clasa live, frecvență afișată)", (await txt("#status")) === "EMITE" && (await p.evaluate(() => document.body.classList.contains("live"))) && /Hz/.test(await txt("#freqVal")), await txt("#freqVal"));
  check("mod " + mode + ": semnalul măsurat > 0", await p.evaluate(() => parseFloat(document.getElementById("meterFill").style.width) > 0), await p.evaluate(() => document.getElementById("meterFill").style.width));
  await p.click("#emit"); await p.waitForTimeout(150);
  check("mod " + mode + ": oprire curată", (await txt("#status")) === "REPAUS" && (await txt("#freqVal")) === "—");
}
// schimbarea modului în timpul emisiei
await p.click("#emit"); await p.click(".mode[data-mode=alarma]"); await p.waitForTimeout(400);
check("schimbare mod în emisie: rămâne în emisie, mod nou", (await txt("#status")) === "EMITE" && (await txt("#modeVal")) === "Alarmă");
// intensitate
await p.fill("#vol", "40"); check("intensitate: afișaj 40%", (await txt("#volOut")) === "40%");
// trecere în fundal oprește emisia
await p.evaluate(() => { Object.defineProperty(document, "hidden", {value: true, configurable: true}); document.dispatchEvent(new Event("visibilitychange")); });
await p.waitForTimeout(200);
check("în fundal: emisia se oprește", (await txt("#status")) === "REPAUS");
await p.evaluate(() => { Object.defineProperty(document, "hidden", {value: false, configurable: true}); });
// mod zi
await p.click("#dayBtn");
check("mod zi: clasa day + aria-pressed", await p.evaluate(() => document.body.classList.contains("day")) && (await p.getAttribute("#dayBtn", "aria-pressed")) === "true");
await p.click("#dayBtn");
// lanternă: fără lanternă disponibilă -> mesaj, nu blocaj
await p.evaluate(() => { Object.defineProperty(navigator, "mediaDevices", {value: undefined, configurable: true}); });
await p.click("#torch"); await p.waitForTimeout(200);
check("lanternă indisponibilă: mesaj de eroare vizibil", /nu e disponibil/i.test(await txt("#modeHint")) && (await p.getAttribute("#torch", "aria-pressed")) === "false", await txt("#modeHint"));
// fără AudioContext: mesaj
{
  const c2 = await b.newContext({serviceWorkers: "block"});
  const q = await c2.newPage();
  await q.addInitScript(() => { delete window.AudioContext; delete window.webkitAudioContext; });
  await q.goto(FILE); await q.waitForTimeout(400); await q.click("#emit");
  check("fără Web Audio: mesaj, nu buton mort", /Audio indisponibil/.test(await q.textContent("#modeHint")) && (await q.textContent("#status")) === "REPAUS");
  await c2.close();
}
check("360 px: fără defilare orizontală", await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
check("fără cereri de rețea", net.length === 0, net.slice(0, 3));
check("fără erori JS", errs.length === 0, errs.slice(0, 3));
await b.close();
console.log(ok + " ok, " + bad + " FAIL");
process.exit(bad ? 1 : 0);
