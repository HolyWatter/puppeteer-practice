import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto(
    `https://search.shopping.naver.com/search/category?catId=50000194`
  );

  await page.click('#container > div > div.filter_finder__E_I19 > div.filter_finder_filter__tysdn > div.filter_finder_col__k6BKF.filter_is_fixed__xmAmM > div.filter_finder_tit__x1gjS > a')

const representBrand=  await page.$$('#container > div > div.filter_finder__E_I19 > div.filter_finder_filter__tysdn > div.filter_finder_col__k6BKF.filter_is_fixed__xmAmM > div.filter_finder_row__ILuuO > ul > li')

const respBrandList = await Promise.all(representBrand.map(async (item) => await item.$eval('span' , (el) => el.textContent)))


const generalBrand = await page.$$('#container > div > div.filter_finder__E_I19 > div.filter_finder_filter__tysdn > div.filter_finder_col__k6BKF.filter_is_fixed__xmAmM.filter_is_active__xplWw > div.filter_finder_row__ILuuO > div.filter_finder_cell__d3gHn > ul > li')
const generalBrandList = await Promise.all(generalBrand.map(async (item) => await item.$eval('span' , (el) => el.textContent)))

console.log([...respBrandList, ...generalBrandList])

  await browser.close();
})();

