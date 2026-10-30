const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function waitCount(page, count) {
  await page.waitForFunction(
    (expected) =>
      document.querySelectorAll("[data-dish-id]").length === expected,
    count,
  );
  await page.waitForTimeout(650);
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1440, height: 1000 },
        hasTouch: mobile,
        isMobile: mobile,
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://localhost:3000/menu", {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      await waitCount(page, 11);
      assert(
        await page
          .locator("[data-dish-id] img")
          .evaluateAll((images) =>
            images.every((img) => img.complete && img.naturalWidth > 0),
          ),
      );
      assert(
        await page.evaluate(
          () =>
            getComputedStyle(document.querySelector("main")).position ===
            "fixed",
        ),
      );
      const board = page.locator("[data-menu-board]");
      const initial = await board.evaluate(
        (el) => getComputedStyle(el).transform,
      );
      const gallery = page.getByRole("region", {
        name: /Draggable dish gallery/,
      });
      const frame = await gallery.boundingBox();
      if (mobile) {
        const cdp = await context.newCDPSession(page);
        const x = frame.width / 2,
          y = frame.y + frame.height / 2;
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x, y }],
        });
        for (let i = 1; i <= 8; i++)
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: x - i * 12, y: y - i * 5 }],
          });
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
      } else {
        await page.mouse.move(frame.width / 2, frame.y + frame.height / 2);
        await page.mouse.down();
        await page.mouse.move(
          frame.width / 2 - 220,
          frame.y + frame.height / 2 - 90,
          { steps: 15 },
        );
        await page.mouse.up();
      }
      await page.waitForTimeout(600);
      assert.notEqual(
        await board.evaluate((el) => getComputedStyle(el).transform),
        initial,
        "Drag must pan the grid",
      );
      assert(
        !(await page.getByRole("dialog").isVisible()),
        "Dragging must not open dish details",
      );
      await page.getByRole("button", { name: "Recenter dishes" }).click();
      await page.waitForTimeout(750);
      if (!mobile) {
        await gallery.focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(450);
        assert.notEqual(
          await board.evaluate((el) => getComputedStyle(el).transform),
          initial,
          "Arrow keys must pan",
        );
        await page.keyboard.press("Home");
      }
      await page.screenshot({
        path: `output/previews/menu-page-${mobile ? "mobile" : "desktop"}.png`,
      });
      const categories = page.getByRole("group", { name: "Dish category" });
      const preferences = page.getByRole("group", { name: "Dish preference" });
      await categories
        .getByRole("button", { name: "Curries", exact: true })
        .click();
      await waitCount(page, 3);
      await preferences
        .getByRole("button", { name: "Vegetarian", exact: true })
        .click();
      await waitCount(page, 1);
      await page.locator('[data-dish-id="cauliflower-curry"]').click();
      await page.getByRole("dialog").waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      assert(
        await page
          .getByRole("heading", { name: "Golden cauliflower curry" })
          .isVisible(),
      );
      await page.screenshot({
        path: `output/previews/menu-details-${mobile ? "mobile" : "desktop"}.png`,
      });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await categories
        .getByRole("button", { name: "Rice", exact: true })
        .click();
      await waitCount(page, 0);
      assert(
        await page
          .getByRole("heading", { name: "A different craving?" })
          .isVisible(),
      );
      await page.getByRole("button", { name: "Show all dishes" }).click();
      await waitCount(page, 11);
      await preferences
        .getByRole("button", { name: "Seafood", exact: true })
        .click();
      await waitCount(page, 1);
      assert.equal(
        await page.locator("[data-dish-id]").getAttribute("data-dish-id"),
        "shrimp-rice",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      console.log(
        mobile
          ? "Mobile touch, filters and details passed."
          : "Desktop drag, keyboard, filters and details passed.",
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
