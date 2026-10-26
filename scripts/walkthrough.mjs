import puppeteer from "puppeteer-core";

const media = "/cursor/stores/bc-848e7bb7-a4b1-48aa-a65a-8fb985f858e0/media";
const base = "http://127.0.0.1:5173";

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1020, deviceScaleFactor: 1 });
page.on("pageerror", (error) => {
  console.error("pageerror", error);
});

async function text() {
  return page.evaluate(() => document.body.innerText);
}

async function waitForText(snippet) {
  await page.waitForFunction((needle) => document.body.innerText.includes(needle), { timeout: 15000 }, snippet);
}

async function shot(name) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${media}/${name}` });
  console.log("saved", name);
}

async function setNumber(selector, value) {
  await page.$eval(
    selector,
    (element, next) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      setter?.call(element, next);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    },
    value,
  );
}

await page.goto(base, { waitUntil: "networkidle0" });
await page.waitForSelector("[data-testid='dual-entry']");
await waitForText("Quick Flight Hacker");
await waitForText("8-month planner");
await shot("home-dual-entry.png");

await page.click("[data-testid='pathway-hack']");
await page.waitForSelector("[data-testid='show-hack']");
await page.click("[data-testid='show-hack']");
await page.waitForSelector("[data-testid='savings-hero']");
await waitForText("€850");
await waitForText("€60");
await waitForText("30,000 points");
await waitForText("92% off");
const hero = await text();
if (!hero.includes("Air France Flying Blue is running a 25% promo")) {
  throw new Error("Missing why-it-works copy");
}
await shot("savings-hero-850-to-60.png");

await page.click("[data-testid='open-booking']");
await page.waitForSelector("[data-testid='booking-checklist']");
await waitForText("Move the points");
await waitForText("Open the award search");
await waitForText("Confirm and ticket");
await waitForText("30,000");
const booking = await text();
if (!booking.includes("Transfer only after you can see the seat")) {
  throw new Error("Missing transfer warning");
}
await shot("booking-checklist-3-step.png");

await page.goto(base, { waitUntil: "networkidle0" });
await page.click("[data-testid='pathway-plan']");
await page.waitForSelector("[data-testid='spend-sliders'] input[type='range']");
await waitForText("5,000");
await waitForText("Groceries");
await shot("planner-spend-sliders.png");

await setNumber('input[aria-label="Groceries amount"]', "800");
await page.waitForFunction(() => !document.body.innerText.includes("5,000 pts"), { timeout: 8000 });
const moved = await text();
if (!moved.includes("6,200")) {
  throw new Error(`Slider did not change the live plan. Saw: ${moved.slice(0, 500)}`);
}
await setNumber('input[aria-label="Groceries amount"]', "500");
await waitForText("5,000");

await page.click("[data-testid='build-roadmap']");
await page.waitForSelector("[data-testid='milestone-tracker']");
await waitForText("22,000");
await waitForText("60,000");
await waitForText("half the time");
await shot("milestone-tracker.png");

await page.click("[data-testid='tracker-booking']");
await page.waitForSelector("[data-testid='booking-checklist']");
await waitForText("Bali");
await waitForText("Move the points");

await page.goto(base, { waitUntil: "networkidle0" });
await page.click("[data-testid='demo-euro-850']");
await page.waitForSelector("[data-testid='savings-hero']");
await waitForText("€60");
await waitForText("30,000 points");

await page.goto(base, { waitUntil: "networkidle0" });
await page.click("[data-testid='demo-inr-3500']");
await page.waitForSelector("[data-testid='savings-hero']");
await waitForText("₹55,000");
await waitForText("₹3,500");

await page.goto(`${base}/hack`, { waitUntil: "networkidle0" });
await page.waitForSelector("[data-testid='copilot-dubai']");
await page.click("[data-testid='copilot-dubai']");
await page.waitForSelector("[data-testid='copilot-answer']");
await waitForText("Yes.");
await waitForText("40,000");

await page.goto(`${base}/plan?demo=bali`, { waitUntil: "networkidle0" });
await page.waitForSelector("[data-testid='spend-sliders']");
await page.goto(`${base}/book?demo=euro-850`, { waitUntil: "networkidle0" });
await page.waitForSelector("[data-testid='booking-checklist']");
await waitForText("€60");

await browser.close();
console.log("walkthrough ok");
