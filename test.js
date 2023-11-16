import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";
import "dotenv/config";

function priceStringToNumber(string) {
  return string
    .replace(/,/g, "")
    .replace("원", "")
    .replaceAll(" ", "")
    .replaceAll("\n", "");
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
  });
  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 2080,
  });

  await page.setExtraHTTPHeaders({
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
    "user-agent": "",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  });

  await page.goto(
    "https://www.coupang.com/vp/products/82882751?itemId=263048637&vendorItemId=3638507950&sourceType=cmgoms&omsPageId=s108431&omsPageUrl=s108431&isAddedCart="
  );

  await scrollDown(page);
  const moreSeeBtn = await page.$(".product-detail-seemore-btn");

  if (moreSeeBtn) {
    try {
      await moreSeeBtn.click();
    } catch {}
  }

  await scrollDown(page);

  // const mainThumb = await page.$$eval(
  //   ".prod-image__items > div > img",
  //   (imgs) => imgs.map((img) => img.src)
  // );

  const itagList = await page.$$(".prod-image__item__border");
  const mainThumb = [];
  for (let i of itagList) {
    await i.click();
    mainThumb.push(
      "https" +
        (await page.$eval("img.prod-image__detail", (e) =>
          e.getAttribute("src")
        ))
    );
  }

  console.log(mainThumb);

  const productTitle = await page.$eval(
    ".prod-buy-header__title",
    (e) => e.textContent
  );

  const priceList = await page.$$eval(".total-price strong", (el) => {
    return el.map((i) => i.textContent);
  });

  const priceNumberList = priceList.map((item) => priceStringToNumber(item));
  let price;

  let originalPrice;

  try {
    originalPrice = await page.$eval(
      "span.origin-price",
      (el) => el.textContent
    );
  } catch {}

  if (originalPrice) {
    price = {
      originalPrice: priceNumberList[0],
      salePrice: priceStringToNumber(originalPrice),
    };
  } else {
    if (priceNumberList.length === 1) {
      price = {
        originalPrice: priceNumberList[0],
        salePrice: priceNumberList[1],
      };
    }
    if (priceNumberList.length > 1) {
      price = {
        originalPrice: Math.max(...priceNumberList),
        salePrice: Math.min(...priceNumberList),
      };
    }
  }

  const moreAttrBtn = await page.$(".essential-info-more__btn");

  if (moreAttrBtn) {
    try {
      await moreAttrBtn.click();
    } catch {}
  }

  const thList = await page.$$eval(
    ".prod-delivery-return-policy-table th",
    (th) => {
      return th.map((e) => e.textContent);
    }
  );
  const tdList = await page.$$eval(
    ".prod-delivery-return-policy-table td",
    (td) => {
      return td.map((e) => e.textContent);
    }
  );

  const attrList = thList.map((item, idx) => {
    return {
      title: item,
      value: tdList[idx],
    };
  });

  const detailImgList = await page.$$eval(".subType-IMAGE img", (item) => {
    return item.map((e) => e.src);
  });

  const optionBtn = await page.$$(".prod-option__item");

  const option = await Promise.all(
    optionBtn.map(async (item) => {
      try {
        await item.click();

        const title = await item.$eval(
          ".prod-option__selected span.title",
          (i) => i.textContent
        );

        const optionList = await item.$$(".prod-option__list li");

        const optionArray = await Promise.all(
          optionList.map(async (el) => {
            const optionName = await el.$eval(
              ".prod-option__dropdown-item-title",
              (e) => e.textContent
            );
            let optionPrice;
            try {
              optionPrice = await el.$eval(
                ".prod-option__dropdown-item-price strong",
                (el) => el.textContent
              );
            } catch {
              optionPrice = "0";
            }
            return {
              optionName,
              optionPrice: priceStringToNumber(optionPrice),
            };
          })
        );

        if (!!optionArray.length) {
          return {
            title,
            optionList: optionArray,
          };
        }
        if (!optionArray.length) {
          return {
            title,
            optionList: [
              {
                optionName: await page.$eval(
                  ".prod-option__selected span.value",
                  (el) => el.textContent
                ),
                optionPrice: 0,
              },
            ],
          };
        }
      } catch {
        return;
      }
    })
  );

  console.log(option);

  await browser.close();
})();

async function scrollDown(page) {
  const scrollStep = 1000;

  let i = 1;
  while (true) {
    await page.evaluate((scrollStep) => {
      window.scrollBy(0, scrollStep);
    }, scrollStep);

    // 스크롤 이벤트 발생 후 잠시 대기 (필요에 따라 조절 가능)
    await page.waitForTimeout(500); // .5초 대기

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
