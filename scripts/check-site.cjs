const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
fs.mkdirSync("output/previews", { recursive: true });
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: "output/previews/desktop-preview.png" });
  console.log(
    "desktop",
    await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      title: document.title,
      video: {
        ready: document.querySelector("video").readyState,
        time: document.querySelector("video").currentTime,
      },
      hero: document.querySelector("h1").textContent,
    })),
  );
  await page
    .getByRole("button", { name: "Reserve a table", exact: true })
    .click();
  await page.getByLabel("Your name").fill("Preview Guest");
  await page.getByLabel("Email address").fill("guest@example.com");
  await page.getByLabel("Date", { exact: true }).fill("2026-12-10");
  await page.getByRole("button", { name: "Save my visit" }).click();
  console.log("reservation", await page.getByRole("status").textContent());
  await page.getByRole("button", { name: "Close dialog" }).click();
  for (const id of ["ingredients", "experience", "vision", "menu"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
  }
  await page.getByRole("button", { name: /Curries/ }).click();
  await page
    .getByRole("listitem").filter({ hasText: "Butter chicken" })
    .waitFor({ state: "visible" });
  console.log(
    "menu opens",
    await page.getByRole("listitem").filter({ hasText: "Butter chicken" }).isVisible(),
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.evaluate(() => {
    const el = document.querySelector("#ingredients");
    window.scrollTo(0, el.parentElement.offsetTop + 1000);
  });
  await page.waitForTimeout(1700);
  await page.screenshot({ path: "output/previews/ingredients-preview.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "output/previews/mobile-preview.png" });
  console.log(
    "mobile overflow",
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  console.log(
    "mobile navigation",
    await page.getByRole("navigation").isVisible(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  console.log(
    "reduced motion loader hidden",
    await page.locator(".loader").isHidden(),
  );
  console.log("runtime errors", errors);
  await browser.close();
  if (errors.length) process.exitCode = 1;
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
