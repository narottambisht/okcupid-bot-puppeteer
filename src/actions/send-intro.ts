import { ElementHandle, Page } from "puppeteer";
import { _INTROMESSAGE_ } from "../utils/config";
import { sendIntroButtonXpath } from "../utils/xpath";

export default async function sendIntros(page: Page) {
  try {
    for (let i = 0; i < 100; i++) {
      await page.waitForSelector("span.cardsummary-realname");
      const chickNameElement: ElementHandle<Element> | null = await page.$(
        "span.cardsummary-realname"
      );
      const chickName = await page.evaluate(
        (element) => element.innerText,
        chickNameElement
      );
      await page.evaluate(() => {
        const viewProfileSpan = document.getElementsByClassName(
          "cardsummary-profile-link"
        );
        const viewProfile = viewProfileSpan[0].getElementsByTagName("a");
        viewProfile[0].click();
      });
      // await page.click("span.cardsummary-profile-link a", { delay: 2000 }); // view profile link click
      await page.waitForXPath(sendIntroButtonXpath, { visible: true });
      const sendIntroButton = await page.$x(sendIntroButtonXpath);
      await sendIntroButton[0].click();
      await page.waitForSelector("textarea.messenger-composer"); // wait for intro dialog box to open
      await page.type(
        "textarea.messenger-composer",
        `Hey ${chickName} ${_INTROMESSAGE_}`
      );
      await page.click("button.messenger-toolbar-send", { delay: 2000 }); // send intro button
      await page.evaluate(() => {
        const sendIntroModalCloseButton = document.getElementsByClassName(
          "connection-view-container-close-button"
        );
        (sendIntroModalCloseButton[0] as HTMLButtonElement).click();
      }); // close send-intro dialog box cross button
      console.log("Send Intro to-->", chickName);
      await page.evaluate(() => {
        const navbarAnchorElements =
          document.getElementsByClassName("navbar-link");
        for (const anchorElement of navbarAnchorElements) {
          if ((anchorElement as HTMLAnchorElement)?.href.includes("discover")) {
            (anchorElement as HTMLAnchorElement).click();
            return;
          }
        }
      });
    }
  } catch (e) {
    console.error("e", e);
  }
}
