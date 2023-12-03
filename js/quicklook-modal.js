/** Shopify CDN: Minification failed

Line 17:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 18:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 22:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 23:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 26:8 Transforming const to the configured target environment ("es5") is not supported yet
Line 37:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 38:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 39:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 49:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 50:4 Transforming const to the configured target environment ("es5") is not supported yet
... and 5 more hidden warnings

**/
window.onload = function () {
  let divsPopup = document.querySelectorAll(".banner-image");
  let btnsCloseQuicklook = document.querySelectorAll(".close-btn");

  divsPopup.forEach((div) => {
    div.addEventListener("click", () => {
      const divClassNames = Array.from(div.classList);
      const blockClassName = divClassNames.find((className) => className.includes("block--template"));

      if (blockClassName) {
        const quickClassName = blockClassName.replace("block--template", "quicklook--template");
        document.querySelector(`.${quickClassName}`).classList.remove("quicklook-none");
        document.querySelector(`.${quickClassName}`).classList.add("quicklook-show");

        handleQuicklookModal();
      }
    });
  });

  btnsCloseQuicklook.forEach((btn) => {
    btn.addEventListener("click", () => {
      const quicklookBlock = btn.parentElement.parentElement.parentElement.parentElement;
      const arr = Array.from(quicklookBlock.classList);
      const hasClass = arr.find((className) => className.includes("quicklook-show"));

      if (hasClass) {
        quicklookBlock.classList.remove("quicklook-show");
        quicklookBlock.classList.add("quicklook-none");
      }
    });
  });

  function handleQuicklookModal() {
    const quicklookOverlay = document.querySelector(".quicklook-show .quicklook-overlay");
    const quicklookElement = document.querySelector(".quicklook-show");

    quicklookOverlay.addEventListener("click", (event) => {
      if (event.target.closest(".quicklook-modal") === null) {
        quicklookElement.classList.remove("quicklook-show");
        quicklookElement.classList.add("quicklook-none");
      }
    });
  }

  const btnsAdd = document.querySelectorAll(".quicklook-product--add");
  btnsAdd.forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const outerForm = evt.target.closest("form");

      const formData = new FormData(outerForm);
      const formString = new URLSearchParams(formData).toString();
      const url = `${window.theme.routes.cart}/add.js`;

      themeVendor.axios
        .post(url, formString, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(function (response) {
          document.querySelector('[data-drawer="drawer-cart"]').dispatchEvent(
            new CustomEvent("theme:drawer:open", {
              detail: {
                variant: response.data,
                reinit: true,
              },
              bubbles: true,
            })
          );
        })
        .catch(function (error) {
          console.warn(error);
        });
    });
  });
};
