const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function inspect(page, label) {
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.locator(".loader").waitFor({ state: "hidden", timeout: 15000 });
  await page.waitForTimeout(2000);
  const initial = await page.evaluate(() => {
    const film = document.querySelector(".film-section");
    const video = document.querySelector("video");
    const logo = document.querySelector(".header .brand-emblem");
    const moving = document.querySelector('.travelling-logo').getBoundingClientRect();
    const slot = document.querySelector('.hero-logo-slot').getBoundingClientRect();
    const name = document.querySelector('.hero-name');
    const restaurant = document.querySelector('.hero-restaurant');
    return {
      videoBelowFold: film.getBoundingClientRect().top >= innerHeight - 1,
      videoPaused: video.paused,
      frameWidth: document.querySelector(".film-frame").getBoundingClientRect().width,
      dishes: document.querySelectorAll(".floating-image-position").length,
      dishesVisible: [...document.querySelectorAll(".floating-image-position")].every(el => getComputedStyle(el).visibility === "visible" && Number(getComputedStyle(el).opacity) > .99),
      logoLoaded: logo.complete && logo.naturalWidth > 0,
      logoCentered: Math.abs(moving.left - slot.left) < 2 && Math.abs(moving.top - slot.top) < 2,
      titleStacked: name.getBoundingClientRect().bottom < restaurant.getBoundingClientRect().top,
      nameWeight: Number(getComputedStyle(name).fontWeight),
      noOverflow: document.documentElement.scrollWidth <= innerWidth,
      dishesSizedAndBorderless: [...document.querySelectorAll('.hero-dish')].every(el => {
        const img = el.querySelector('img');
        const style = getComputedStyle(img);
        return el.getBoundingClientRect().width <= 320 && style.borderTopWidth === '0px' && style.objectFit === 'contain' && img.complete && img.naturalWidth > 0;
      }),
    };
  });
  console.log(label, initial);
  assert(initial.videoBelowFold, "Video must start below the first screen");
  assert(initial.videoPaused, "Video must wait for scrolling");
  assert.equal(initial.dishes, 9);
  assert(initial.logoCentered && initial.titleStacked && initial.nameWeight >= 800);
  assert(initial.dishesVisible && initial.logoLoaded && initial.noOverflow);
  assert(initial.dishesSizedAndBorderless, 'All dishes must load at a bounded size without borders or cropping');
  await page.screenshot({ path: `output/previews/hero-${label}.png` });
  await page.locator(".film-section").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const scrolled = await page.evaluate(() => ({
    playing: !document.querySelector("video").paused,
    width: document.querySelector(".film-frame").getBoundingClientRect().width,
    logoDocked: (() => {
      const moving = document.querySelector('.travelling-logo').getBoundingClientRect();
      const target = document.querySelector('.header .brand-emblem').getBoundingClientRect();
      return Math.abs(moving.left - target.left) < 2 && Math.abs(moving.top - target.top) < 2 && Math.abs(moving.width - target.width) < 2;
    })(),
  }));
  console.log(label, "after scrolling", scrolled);
  assert(scrolled.playing, "Video must play when scrolled into view");
  assert(scrolled.logoDocked, 'Hero logo must move into the sticky header');
  assert(scrolled.width > initial.frameWidth, "Video must expand with scrolling");
}

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await inspect(page, "desktop");
    await page.setViewportSize({ width: 390, height: 844 });
    await inspect(page, "mobile");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.locator(".loader").waitFor({ state: "hidden" });
    await page.locator(".film-section").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    assert(await page.locator("video").evaluate(el => el.paused), "Reduced motion must keep film paused");
    assert.deepEqual(errors, []);
    console.log("Hero checks passed; no runtime errors.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
