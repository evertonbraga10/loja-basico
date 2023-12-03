/** Shopify CDN: Minification failed

Line 27:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 29:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 32:10 Transforming const to the configured target environment ("es5") is not supported yet
Line 34:10 Transforming const to the configured target environment ("es5") is not supported yet
Line 40:10 Transforming const to the configured target environment ("es5") is not supported yet
Line 46:10 Transforming const to the configured target environment ("es5") is not supported yet
Line 47:10 Transforming const to the configured target environment ("es5") is not supported yet

**/
/*
 * Story Theme
 *
 * Use this file to add custom Javascript to Story.  Keeping your custom
 * Javascript in this fill will make it easier to update Story. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 *
 */

(function () {
  // Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.

  function linksMenuNavigation() {
    const btnsDrawerMenu = document.querySelectorAll(".sliderow__title .sliderule__chevron--right");
    btnsDrawerMenu.forEach((btn) => {
      const btnElement = btn.closest("button");
      btnElement.addEventListener("click", (e) => {
        setTimeout(function () {
          const btnsMenu = Array.from(document.querySelectorAll(".is-visible"));

          const btnsVisible = btnsMenu.filter((btn) => {
            if (!btn.classList.contains("is-hidden")) {
              return btn;
            }
          });

          const btnMenuTitle = btnsVisible.find((btn) => {
            if (btn.classList.contains("sliderow__title")) {
              return btn;
            }
          });

          const linkTitleText = btnMenuTitle.querySelector(".sliderow__text span").innerText.replace(" /", "");
          const menuTitleText = btnMenuTitle.querySelector(".sliderow__text").innerText;

          if (linkTitleText !== menuTitleText) {
            btnMenuTitle.querySelector(".link-menu-hide")?.classList.remove("link-menu-hide");
          }
        }, 500);
      });
    });
  }
  linksMenuNavigation();

  // ^^ Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.
})();
