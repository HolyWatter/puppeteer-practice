import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import "dotenv/config";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.coupang.com/np/search?component=&q=%EC%9B%90%ED%94%BC%EC%8A%A4&channel=user"
  );

  await page.screenshot({
    path: "1.png",
  });
})();
