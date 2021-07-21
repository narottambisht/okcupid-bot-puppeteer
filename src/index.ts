import puppeteer, { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
import login from "./actions/login";

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: [
      "--start-maximized", // you can also use '--start-fullscreen'
    ],
  });
  const page: Page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://okcupid.com", {
    waitUntil: "networkidle0",
    timeout: 0,
  });
  await login(page);
  console.log("control back");

  // await browser.close();
})();
