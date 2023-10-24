// https://search.shopping.naver.com/search/category?catId=50000831

import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";
import "dotenv/config";

(async () => {
  const res = await axios.get(
    "https://search.shopping.naver.com/search/category?catId=50000831"
  );

  const $ = cheerio.load(res.data);

  const bodyList = $(
    "#content > div.style_content__xWg5l > div.seller_filter_area > ul > li"
  );

  const countList = [];

  bodyList.map((i, e) => {
    const count = $(e).find("span").text();
    countList[i] = {
      field: $(e).find("a").text().split(count)[0],
      count,
    };
  });

  console.log(countList);
})();
