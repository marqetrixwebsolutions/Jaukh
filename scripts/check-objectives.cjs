const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  try {
    for (const scenario of ["desktop", "mobile", "reduced", "short"]) {
      const mobile = scenario === "mobile";
      const pinned = scenario === "desktop";
      const context = await browser.newContext({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1440, height: scenario === "short" ? 650 : 1000 },
        hasTouch: mobile,
        isMobile: mobile,
        reducedMotion: scenario === "reduced" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await page.waitForTimeout(4500);
      const section = page.locator("#objectives");
      const gallery = section.getByRole("region");
      const cards = section.locator("[data-objective-card]");
      assert.equal(await cards.count(), 7);
      assert.equal(
        await section.getAttribute("data-mode"),
        pinned ? "pinned" : "native",
      );
      assert(
        await page.evaluate(() => {
          const section = document.querySelector("#objectives");
          return Boolean(
            section.compareDocumentPosition(
              document.querySelector("#reserve"),
            ) & Node.DOCUMENT_POSITION_FOLLOWING,
          );
        }),
      );
      if (pinned) {
        // Verify the transition itself, not just a jump to Objectives.
        const transition = await page.evaluate(() => {
          const plate = document.querySelector(".plate-section");
          const spacer = plate.parentElement;
          const menu = document.querySelector("#menu");
          return {
            plateEnd:
              spacer.getBoundingClientRect().top +
              scrollY +
              spacer.offsetHeight -
              plate.offsetHeight,
            menuTop: menu.getBoundingClientRect().top + scrollY,
          };
        });
        await page.evaluate(
          (y) => window.scrollTo(0, y),
          transition.plateEnd - 100,
        );
        await page.waitForTimeout(1200);
        assert(
          (await section.locator("header").boundingBox()).y > 900,
          "Objectives must stay below the pinned plates",
        );
        await page.evaluate(
          (y) => window.scrollTo(0, y),
          transition.menuTop - 120,
        );
        await page.waitForTimeout(1200);
        const menu = await page.locator("#menu").boundingBox();
        assert(
          menu.y > 80 && menu.y < 150,
          "Menu must appear after the plates",
        );
        assert(
          (await section.locator("header").boundingBox()).y >
            menu.y + menu.height,
          "Objectives must not cover the menu",
        );
        assert.equal(
          await section
            .locator("header")
            .evaluate((el) => getComputedStyle(el.parentElement).position),
          "sticky",
        );
        const start = Number(await section.getAttribute("data-scroll-start"));
        const naturalTop = await section.evaluate(
          (el) => el.getBoundingClientRect().top + scrollY,
        );
        assert(
          Math.abs(naturalTop - start - 90) < 5,
          "Pin must start after all preceding sections",
        );
        await page.evaluate((y) => window.scrollTo(0, y), start + 3);
      } else {
        await section.scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(1200);
      const initial = await cards
        .first()
        .locator("img")
        .evaluate((el) => getComputedStyle(el).transform);
      await gallery.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(
        () =>
          Math.round(
            Number(document.querySelector("#objectives").dataset.progress) * 6,
          ) === 1,
      );
      await page.waitForTimeout(1100);
      if (pinned) {
        assert.notEqual(
          await cards
            .first()
            .locator("img")
            .evaluate((el) => getComputedStyle(el).transform),
          initial,
          "Images should counter-move inside the track",
        );
        const heading = await section.locator("header").boundingBox();
        const panel = await cards.first().boundingBox();
        assert(
          heading.y > 85 && panel.y + panel.height < 1000,
          "Gallery content must fit below the header",
        );
      }
      await page.keyboard.press("ArrowLeft");
      await page.waitForFunction(
        () =>
          Number(document.querySelector("#objectives").dataset.progress) < 0.03,
      );
      for (let index = 0; index < 7; index++) {
        await page.waitForFunction((i) => {
          const img = document.querySelectorAll("[data-objective-image]")[i];
          return img.complete && img.naturalWidth > 0;
        }, index);
        if (index < 6) {
          await page.keyboard.press("ArrowRight");
          await page.waitForFunction(
            (i) =>
              Math.round(
                Number(document.querySelector("#objectives").dataset.progress) *
                  6,
              ) === i,
            index + 1,
          );
          await page.waitForTimeout(850);
        }
      }
      assert(Number(await section.getAttribute("data-progress")) > 0.98);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "No page-wide horizontal overflow",
      );
      if (scenario === "reduced") {
        assert(
          await cards
            .locator("img")
            .evaluateAll((images) =>
              images.every((el) => getComputedStyle(el).transform === "none"),
            ),
        );
      }
      if (mobile) {
        // A real touch gesture must move the native gallery independently of Lenis.
        const rect = await gallery.boundingBox();
        const cdp = await context.newCDPSession(page);
        const x = 90,
          y = Math.max(120, rect.y + 100);
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x, y }],
        });
        for (let i = 1; i <= 10; i++) {
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: x + i * 24, y }],
          });
          await page.waitForTimeout(20);
        }
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await page.waitForTimeout(1100);
        assert(
          Number(await section.getAttribute("data-progress")) < 0.95,
          "Swiping should reveal the previous objective",
        );
      }
      if (pinned || mobile)
        await page.screenshot({
          path: `output/previews/objectives-${scenario}.png`,
        });
      await page
        .getByRole("button", { name: "Reserve your table", exact: true })
        .click();
      assert(
        await page.getByRole("dialog", { name: "Plan your visit" }).isVisible(),
      );
      await page.getByRole("button", { name: "Close dialog" }).click();
      assert.equal(errors.length, 0, errors.join("\n"));
      console.log(
        `${scenario}: seven objectives, navigation, images, layout and CTA passed`,
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
