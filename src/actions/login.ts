import readline from "readline";
import { Page } from "puppeteer";
import { ____EMAIL____, ____PASSWORD____ } from "../utils/config";

/**
 * Function to read otp from command line utility
 * @return Promise
 */
function readOTP(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter OTP: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Function to login in okcupid web app
 * @param page Page puppeteer page object
 */
export default async function login(page: Page): Promise<void> {
  await page.click("button#onetrust-accept-btn-handler"); // Click accept cookies button
  await page.click("a.splashdtf-header-signin-splashButton"); // Click signin button
  await page.type("input.login-username", ____EMAIL____); // Enter email in email/username field
  await page.type("input.login-password", ____PASSWORD____); // Enter password in email/username field
  await page.click("button.login-actions-button"); // Click next button after username & password fillup

  try {
    await page.waitForSelector("form.login-sms", { timeout: 5000 });
    if ((await page.$("form.login-sms")) !== null) {
      await page.click("button[type='submit'].login-actions-button");
      const loginOTP: string = await readOTP();
      for (const i in Array.from(loginOTP)) {
        await page.type(`input[data-index='${i}']`, loginOTP[i]);
        await page.click("button[type='submit'].login-actions-button");
        await page.waitForNavigation({ waitUntil: "networkidle0" });
      }
    }
  } catch (e) {
    console.error(e);
  }
}
