// @ts-ignore
const fs = require("fs");
// @ts-ignore
const puppeteerExtra = require("puppeteer-extra");
// @ts-ignore
const Stealth = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(Stealth());

(async () => {
  const browserObj = await puppeteerExtra.launch({ headless: false });
  const newpage = await browserObj.newPage();

   console.log("Page loaded successfully.");


  await newpage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await newpage.goto(
      "https://www.etsy.com/c/accessories/sunglasses-and-eyewear/glasses?explicit=1&ref=catcard-59-498579841"
    );

    const products = await newpage.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#content > div > div.wt-bg-white.wt-grid__item-md-12.wt-pl-xs-1.wt-pr-xs-0.wt-pr-md-1.wt-pl-lg-0.wt-pr-lg-0.wt-mt-xs-0.wt-overflow-x-hidden.wt-bb-xs-1 > div > div.wt-mt-xs-2.wt-text-black > div.wt-grid.wt-pl-xs-0.wt-pr-xs-0.search-listings-group > div > div.wt-bg-white.wt-display-block.wt-pb-xs-2.wt-mt-xs-0 > div > div > div > ol > li > div"
        ),
        (e) => ({
          title: e.querySelector("h2")?.textContent?.replace(/\n/g, "").trim(),
          price: e.querySelector("p")?.textContent?.replace(/\n/g, "").trim(),
          link: e.querySelector("a")?.href,
          image: e.querySelector("img")?.getAttribute("src") || "",
        })
      )
    );

    console.log(products);

    // Define a function to scroll to the bottom of the page
    const scrollPageToBottom = async () => {
      await newpage.evaluate(async () => {
        await new Promise((resolve, reject) => {
          const distance = 100; // Distance to scroll in pixels
          let totalHeight = 0;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve(clearInterval)
            }
          }, 100); // Scroll speed in milliseconds
        });
      });
    };

    // Scroll multiple times to load more content
    for (let i = 0; i < 1; i++) {
      console.log("Scrolling...");
      await scrollPageToBottom();
    }

    console.log("Infinite scrolling completed.");

    fs.writeFile("files/products.json", JSON.stringify(products), (err) => {
      if (err) throw err;
      console.log("File saved");
    });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browserObj.close();
  }
})();
