// @ts-ignore
const fs = require("fs");
// @ts-ignore
const puppeteerExtra = require("puppeteer-extra");
// @ts-ignore
const Stealth = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(Stealth());

(async () => {
  // Launch Puppeteer browser
 const browserObj = await puppeteerExtra.launch();
  const newpage = await browserObj.newPage();

  try {
    // Navigate to the website
    await newpage.goto(
      "https://www.etsy.com/listing/1585223585/wooden-glasses-frame-wood-eyeglasses?click_key=777a3e71aa5509d1f2f6afad2e314907a2de5d00%3A1585223585&click_sum=ffbab8f4&ref=search2_etsys_pick_narrowing_intent_modules_etsys_pick-1&pro=1&frs=1&variation0=3951785225&variation1=3934940070",
      {
        waitUntil: "networkidle0",
      }
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



    // Function to select option by text content
    const selectedOne = async (selector, text) => {
      const selectedText = await newpage.evaluate(
        (selector, text) => {
          const select = document.querySelector(selector);
          if (!select) {
            throw new Error(`Select element '${selector}' not found.`);
          }
          const options = select.querySelectorAll("option");
          for (const option of options) {
            if (option.textContent.trim() === text) {
              option.selected = true;
              select.dispatchEvent(new Event("change", { bubbles: true }));
              return option.textContent.trim(); // Return text content of selected option
            }
          }
          throw new Error(
            `Option with text '${text}' not found in select '${selector}'.`
          );
        },
        selector,
        text
      );

      if (selectedText !== null) {
        return selectedText;
      } else {
        console.error("Option not found.");
        return null;
      }
    };

    // Example usage: Select option with text "Option Text" from the select element
    const selectedText = await selectedOne(
      'select[data-variation-number="0"]',
      "Medium"
    );

    // Function to select option by text content
    const selectedTwo = async (selector, text) => {
      const selectedText = await newpage.evaluate(
        (selector, text) => {
          const select = document.querySelector(selector);
          if (!select) {
            throw new Error(`Select element '${selector}' not found.`);
          }
          const options = select.querySelectorAll("option");
          for (const option of options) {
            if (option.textContent.trim() === text) {
              option.selected = true;
              select.dispatchEvent(new Event("change", { bubbles: true }));
              return option.textContent.trim(); // Return text content of selected option
            }
          }
          throw new Error(
            `Option with text '${text}' not found in select '${selector}'.`
          );
        },
        selector,
        text
      );

      if (selectedText !== null) {
        return selectedText;
      } else {
        console.error("Option not found.");
        return null;
      }
    };

    // Example usage: Select option with text "Option Text" from the select element
    const selectedText2 = await selectedTwo(
      'select[data-variation-number="1"]',
      "Clear Protective"
    );

    const button = await newpage.$('button[type="submit"]');

    if (button && selectedText && selectedText2 && name && imageURL && price) {
      // Add a click event listener to the button
      await newpage.evaluate((button) => {
        button.addEventListener("click", () => {
          // Navigate to the second newpage when the button is clicked

          newpage.goto("https://www.etsy.com/cart");
        });
      }, button);

      await newpage.waitForNavigation;
    } else {
      console.log('Button with type="submit" not found.');
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    // Close the browser
    await browserObj.close();
  }
})();
