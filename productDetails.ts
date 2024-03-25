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

  await newpage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await newpage.goto(
      "https://www.etsy.com/listing/1112702820/personalized-silver-name-necklace-custom?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=&ref=sr_gallery-1-1&pro=1&frs=1&organic_search_click=1"
    );

    const name = await newpage.$$eval(
      "#listing-page-cart > div:nth-child(5) > h1",
      (elements) =>
        elements.map((element) => element.textContent.replace(/\n/g, "").trim())
    );

    const price = await newpage.$$eval(
      "#listing-page-cart > div:nth-child(2) > div > div > div",
      (elements) =>
        elements.map((element) =>
          element.querySelector("p").textContent.replace(/\n/g, "").trim()
        )
    );

    let imageURL;

    const imageElement = await newpage.$(
      "#photos > div.listing-page-image-carousel-component.wt-display-flex-xs.is-initialized > div.image-carousel-container.wt-position-relative.wt-flex-xs-6.wt-order-xs-2.show-scrollable-thumbnails > ul > li:nth-child(1) > img"
    );

    if (imageElement) {
      // If the image element is found, you can further manipulate it
      imageURL = await newpage.evaluate((element) => element.src, imageElement);
    } else {
      console.error("Image element not found.");
    }

    const selection = await newpage.$$eval(
      "#variation-selector-0 option",
      (elements) =>
        elements.map((element) => element.textContent.replace(/\n/g, "").trim())
    );

    const selection2 = await newpage.$$eval(
      "#variation-selector-1 option",
      (elements) =>
        elements.map((element) => element.textContent.replace(/\n/g, "").trim())
    );

    console.log(name);
    console.log(price);

    console.log(selection);
    console.log(selection2);

    fs.writeFile(
      "files/productDetails.json",
      JSON.stringify([name, price, imageURL, selection, selection2]),
      (err) => {
        if (err) throw err;
        console.log("File saved");
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browserObj.close();
  }
})();
