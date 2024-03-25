// @ts-ignore
const fs = require("fs");
// @ts-ignore
const puppeteerExtra = require("puppeteer-extra");
// @ts-ignore
const Stealth = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(Stealth());

(async () => {
   const browserObj = await puppeteerExtra.launch();
   const newpage = await browserObj.newPage();

  await newpage.goto("https://www.etsy.com/cart?ref=hdr-cart");

  try {


     const products = await newpage.evaluate(() =>
       Array.from(
         document.querySelectorAll(
           "#multi-shop-cart-list > div.wt-mt-xs-1.wt-mt-lg-0.wt-mb-xs-5.wt-position-relative > div.wt-grid.wt-position-relative.wt-pl-xs-0.wt-pr-xs-0 > ul > li > div > div.wt-p-xs-3 > ul > li"
         ),
         (e) => ({
           title: e.querySelector("a")?.textContent?.replace(/\n/g, "").trim(),
         
         })
       )
     );


     console.log(products)




    const name = await newpage.$$eval(
      "#multi-shop-cart-list > div.wt-mt-xs-1.wt-mt-lg-0.wt-mb-xs-5.wt-position-relative > div.wt-grid.wt-position-relative.wt-pl-xs-0.wt-pr-xs-0 > ul > li > div > div.wt-p-xs-3 > ul > li > div > div.wt-flex-xs-3.wt-pl-xs-2.wt-break-word.simplified-cart-min-width-0.wt-pl-md-3 > div > div.wt-grid__item-xs-5.wt-hide-xs.wt-show-md.wt-pl-xs-3 > div > div > div > p.wt-text-title-large",
      (elements) => elements.map((element) => element.textContent)
    );

    console.log(name);
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    await browserObj.close();
  }
})();
