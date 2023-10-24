import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import "dotenv/config";

(async () => {
  const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } = process.env;

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080,
  });
  //최초 이동
  await page.goto("https://datalab.naver.com/shoppingInsight/sCategory.naver");

  //카테고리 선택
  await page.click(".select_btn");
  await page.click('a[data-cid="50000001"]');
  await page.waitForTimeout(500);

  let selectBox = await page.$$("div.select > span.select_btn");
  const secondBox = selectBox[1];
  await secondBox.click();
  await page.click('a[data-cid="50000178"]');
  await page.waitForTimeout(500);

  selectBox = await page.$$("div.select > span.select_btn");
  const thirdBox = selectBox[2];
  await thirdBox.click();
  await page.click('a[data-cid="50000656"]');
  await page.waitForTimeout(500);

  await page.click(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period > div > span"
  );
  const period = "month";

  if (period === "month")
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period > div > ul > li:nth-child(3) > a"
    );
  if (period === "week")
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period > div > ul > li:nth-child(2) > a"
    );
  if (period === "date")
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period > div > ul > li:nth-child(1) > a"
    );

  //기간 선택
  // ex 2022-05-01 ~ 2023-05-01이다
  const startDate = "2021-11-04";

  await page.click("label.period.input");

  await page.click(
    "div.set_period_target div.select.w2 span.select_btn:first-child"
  );

  const startYearElement = await page.$x(
    `//a[text()='${startDate.split("-")[0]}']`
  );
  await startYearElement[0].click();

  await page.click(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(1) > div:nth-child(2) > span"
  );

  const startMonthElement = await page.$x(
    `//a[text()='${startDate.split("-")[1]}']`
  );
  await startMonthElement[0].click();

  if (period === "date") {
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(1) > div:nth-child(3) > span"
    );

    const dateSelector = await page.$(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(1) > div:nth-child(3)"
    );
    const startDateElement = await dateSelector.$x(
      `//a[text()='${startDate.split("-")[2]}']`
    );
    await startDateElement[0].click();
  }

  const endFullDate = "2022-10-04";

  const [endYear, endMonth, endDate] = endFullDate.split("-");

  await page.click(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div.select.w2 > span"
  );

  const endYearBoxSelector = await page.$(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div.select.w2"
  );
  const endYearSelector = await endYearBoxSelector.$x(
    `//a[text()='${endYear}']`
  );

  await endYearSelector[0].click();

  await page.click(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div:nth-child(2) > span"
  );

  const endMonthBoxSelector = await page.$(
    "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div:nth-child(2)"
  );

  const endMonthSelector = await endMonthBoxSelector.$x(
    `//a[text()='${endMonth}']`
  );

  await endMonthSelector[0].click();

  if (period === "date") {
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div:nth-child(3) > span"
    );

    const endDateBoxSelector = await page.$(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(2) > div.set_period_target > span:nth-child(3) > div:nth-child(3)"
    );

    const endDateSelector = await endDateBoxSelector.$x(
      `//a[text()='${endDate}']`
    );

    await endDateSelector[0].click();
  }

  const gender = "";

  if (gender === "m")
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(4) > div > div > span:nth-child(3)"
    );
  if (gender === "f")
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(4) > div > div > span:nth-child(2)"
    );
  if (!gender)
    await page.click(
      "#content > div.section_instie_area.space_top > div > div.section.insite_inquiry > div > div > div:nth-child(4) > div > div > span:nth-child(1)"
    );

  const ages = ["50", "60", "10", "20"];

  await Promise.all(
    ages.map(async (item) => {
      await page.click(`input[value="${item}"]`);
    })
  );

  await page.screenshot({
    path: "1.png",
  });

  await page.click("a.btn_submit");
  await page.waitForTimeout(2000);

  const menPercent = await page.$eval(
    "#pie_chart_gender > svg > g:nth-child(2) > g.bb-chart > g.bb-chart-arcs > g.bb-chart-arc.bb-target.bb-target-m > text",
    (element) => element.textContent
  );
  const womenPercent = await page.$eval(
    "#pie_chart_gender > svg > g:nth-child(2) > g.bb-chart > g.bb-chart-arcs > g.bb-chart-arc.bb-target.bb-target-f > text",
    (e) => e.textContent
  );

  const ageChart = await page.$$("#bar-container > ul > li");

  const list = await Promise.all(
    ageChart.map(async (item) => {
      const age = await item.$eval("div", (el) => {
        return el.textContent;
      });

      const height = await item.$eval("span > span", (el) => {
        return el.textContent.split("%")[0];
      });

      return {
        age,
        height,
      };
    })
  );

  console.log(list);

  await browser.close();
})();

const getKeyword = async (content) => {
  const $ = cheerio.load(content);

  const linkList = $(".rank_top1000_list > li");
  const result = [];

  linkList.map((i, e) => {
    const name = $(e).find("a").text();
    const rank = $(e).find("a > span").text();
    console.log(name);
    result[i] = {
      id: rank,
      title: name.split(rank)[1].split("\n")[0],
    };
  });

  return result;
};
