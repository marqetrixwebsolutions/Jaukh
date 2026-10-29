const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  try {
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
      { width: 1920, height: 1080 },
    ]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://localhost:3000", {
        waitUntil: "domcontentloaded",
      });
      await page.locator(".loader").waitFor({ state: "hidden" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      const initial = await page.evaluate(() => {
        const gallery = document.querySelector(".story-gallery");
        return {
          fonts: [
            document.body,
            document.querySelector("h1"),
            document.querySelector(".story-text"),
            document.querySelector(".brand-wordmark"),
          ].map((el) => getComputedStyle(el).fontFamily),
          videoHeight: document
            .querySelector(".film-frame")
            .getBoundingClientRect().height,
          renderer: gallery.dataset.renderer,
          top:
            document
              .querySelector("#story")
              .parentElement.getBoundingClientRect().top + scrollY,
        };
      });
      assert(initial.fonts.every((font) => font.includes("Manrope")));
      assert(initial.videoHeight >= (viewport.width > 767 ? 580 : 420));
      assert.equal(initial.renderer, "webgl");
      const counts = [];
      const textOpacities = [];
      for (const progress of [0.15, 0.5, 0.95]) {
        await page.evaluate(
          ({ top, progress, distance }) =>
            window.scrollTo(0, top + distance * progress),
          {
            top: initial.top,
            progress,
            distance: Math.max(1100, viewport.height * 1.65),
          },
        );
        await page.waitForTimeout(1500);
        const state = await page.evaluate(() => {
          const gallery = document.querySelector(".story-gallery");
          const copy = document.querySelector(".story-copy");
          return {
            count: Number(gallery.dataset.visibleItems),
            progress: Number(gallery.dataset.progress),
            galleryWidth: gallery.getBoundingClientRect().width,
            copyTop: copy.getBoundingClientRect().top,
            copyBottom: copy.getBoundingClientRect().bottom,
            lineHeight: getComputedStyle(document.querySelector(".story-text"))
              .lineHeight,
            overflow: document.documentElement.scrollWidth > innerWidth,
            cardsContained: gallery.dataset.cardsContained,
            textOpacityLast: Number(
              getComputedStyle(
                document.querySelector(".story-text").lastElementChild,
              ).opacity,
            ),
          };
        });
        console.log(viewport.width, progress, state);
        counts.push(state.count);
        textOpacities.push(state.textOpacityLast);
        assert.equal(Math.round(state.galleryWidth), viewport.width);
        assert(
          state.copyTop >= 0 && state.copyBottom <= viewport.height,
          "Gallery and complete story copy must share the viewport",
        );
        assert(!state.overflow);
        assert.equal(
          state.cardsContained,
          "true",
          "Settled cards must fit inside the canvas",
        );
      }
      assert(counts[0] < counts[1] && counts[1] <= counts[2]);
      assert.equal(counts[2], 7);
      assert(
        textOpacities[2] > textOpacities[0],
        "Story words must reveal as the page scrolls",
      );
      await page.screenshot({
        path: `output/previews/story-combined-${viewport.width}.png`,
      });
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log("Story checks passed on desktop and mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
