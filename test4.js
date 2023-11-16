import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto(
    `https://search.shopping.naver.com/search/all?query=노트&cat_id=&frm=NVSHATC`
  );

  const wholeCount = await page.$eval(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li.active > a > span.subFilter_num__S9sle",
    (e) => e.textContent
  );

  await scrollDown(page);

  const wholeProductPrice = await page.$$(".product_price_area__eTg7I");

  const wholePriceList = await Promise.all(
    wholeProductPrice.map(async (el) => {
      return await el.$eval("em", (el) => el.textContent);
    })
  );

  await page.click(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li:nth-child(2) > a"
  );

  await page.screenshot({
    path: "1.png",
  });

  const comparePriceCount = await page.$eval(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li.active > a > span.subFilter_num__S9sle",
    (e) => e.textContent
  );

  await page.click(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li:nth-child(3) > a"
  );

  const npayCount = await page.$eval(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li.active > a > span.subFilter_num__S9sle",
    (e) => e.textContent
  );

  await page.click(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li:nth-child(6) > a"
  );

  const overseasCount = await page.$eval(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li.active > a > span.subFilter_num__S9sle",
    (e) => e.textContent
  );

  await page.screenshot({
    path: "abc.png",
  });

  await scrollDown(page);

  const overseasProductPrice = await page.$$(".product_price_area__eTg7I");

  const overseasPriceList = await Promise.all(
    overseasProductPrice.map(async (el) => {
      return await el.$eval("em", (el) => el.textContent);
    })
  );

  console.log(wholeCount, comparePriceCount, npayCount, overseasCount);
  console.log(wholePriceList);
  console.log(overseasPriceList);

  await browser.close();
})();

async function scrollDown(page) {
  const scrollStep = 600;

  let i = 1;
  while (true) {
    await page.evaluate((scrollStep) => {
      window.scrollBy(0, scrollStep);
    }, scrollStep);

    // 스크롤 이벤트 발생 후 잠시 대기 (필요에 따라 조절 가능)
    await page.waitForTimeout(1000); // .5초 대기

    const newHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    if (newHeight <= i * scrollStep) {
      // 새로운 스크롤 높이가 이전 스크롤 높이보다 작거나 같으면 종료
      break;
    }
    i++;
  }
}
