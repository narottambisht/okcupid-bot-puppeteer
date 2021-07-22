import puppeteer, { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
import login from "./actions/login";
import sendIntros from "./actions/send-intro";

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page: Page = await browser.newPage();
  await page.goto("https://okcupid.com", {
    waitUntil: "networkidle0",
    timeout: 0,
  });
  await login(page);
  await sendIntros(page);

  // await browser.close();
})();
