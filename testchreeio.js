import axios from "axios";
import * as chreeio from "cheerio";

(async () => {
  const res = await axios.get(
    "https://www.coupang.com/vp/products/18180435?itemId=73170611&vendorItemId=3119739250&q=%ED%92%80%EC%97%85%EB%B0%B4%EB%93%9C&itemsCount=36&searchId=fb2854678af341c9930469b1bfaf0f6c&rank=3&isAddedCart=",
    {
      headers: {
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
        "user-agent": "",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    }
  );

  const $ = chreeio.load(res);

  const imgList = $("#repImageContainer > div.prod-image__items");
  const imgs = [];
  imgList.map((i, e) => {
    imgs[i] = $(e).find("img").attr("src");
  });

  const title = $(".prod-buy-header__title").text();

  console.log(imgList);
  console.log(imgs);
  console.log(title);
})();
