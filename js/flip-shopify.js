var URL_IOMS = "https://api.flip.net.br/oms/",
  URL_FRONT = "https://api.flip.net.br/flip-fronts/",
  URL_ECOMM = "https://admin.flip.net.br/api/v2/parceiro/ecomm/customization/",
  URL_LP = "https://go.flip.net.br/lp/COMPANY_SLUG/PARTNER_SLUG/products",
  HAS_LP = false,
  FLIP_COMPANY_SLUG = null,
  INFLU_VAR = "influ",
  UTM_CAMPAIGN = "utm_campaign",
  FLIPNET_USER = null,
  FLIPNET_VOUCHER = null;

console.log("flip-shopify-version.2.08");

/***
 *
 * SCRIPT DO HEADER FLUTUANTE
 *
 *******************************************************/

/**
 * Busca os dados do influenciador na API do Flip
 */
const getInfluencerData = async (influencer_id) => {
  await fetch(URL_ECOMM + `${getParentSlugFromLink()}/${influencer_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    response.json().then((data) => {
      FLIPNET_USER = data.ecomm_customization;
      FLIPNET_VOUCHER = data.voucher;
      FLIP_COMPANY_SLUG = data.slug_parent;
      HAS_LP = data.ecomm_customization.partner.hasFavorite;

      if (FLIP_COMPANY_SLUG == "insiderstore") createInfluencerHeader();
      else {
        const state = localStorage.getItem("FLIP_HEADER_STATE");
        createInfluenceHeaderV2(state ? state : "opened");
      }
    });
  });
};

function extractParameterValue(url, parameterName) {
  const params = new URLSearchParams(url.split("?")[1]);
  return params.get(parameterName);
}

/**
 * Exporta as classes CSS que serÃƒÆ’Ã‚Â£o usadas no header flutuante
 */
const exportClassesToUse = (isMobile) => {
  const areaClassIsMobile = isMobile
    ? `font-size: 0.8em; height: 110px;`
    : `font-size: 0.9em; height: 90px;`;

  const partnerImgClassIsMobile = isMobile
    ? "width: 50px; height: 50px;"
    : "width: 60px; height: 60px; margin-top: 5px;";

  const partnerContainerClassIsMobile = isMobile
    ? "margin-top: 10px;"
    : "margin-bottom: 10px !important;";

  var elements = document.querySelectorAll(
    ".Header__Wrapper, .header__wrapper"
  );

  let areaPosition = "";

  elements.forEach(function (element) {
    var styles = window.getComputedStyle(element),
      position = styles.getPropertyValue("position");
    areaPosition = `position: ${position};`;
  });

  return {
    areaClass:
      areaClassIsMobile +
      `${areaPosition} left: 0; width: 100%; padding: 20px;` +
      "background: black; display: flex; align-items: center; justify-content: space-between; opacity: 0;" +
      "transition: opacity 0.5s ease-in-out; text-transform: uppercase; color: white; z-index: 2;",
    partnerImgClass:
      partnerImgClassIsMobile +
      "border-radius: 50%; object-fit: cover; object-position: center; ",
    shareCupomClass:
      "padding: 10px; margin: 0 10px; border: 1px solid white; border-radius: 20px;",
    shareIconClass: "width: 17px; cursor: pointer;",
    partnerNameClass: "margin-left: 10px;",
    partnerContainerClass:
      partnerContainerClassIsMobile + "display: flex; align-items: center;",
  };
};

/**
 * Exporta as classes CSS que serão usadas no header flutuante
 */
const exportClassesToUseV2 = (isMobile) => {
  return {
    areaClass:
      "position: fixed; bottom: 150px; left: 20px; z-index: 999; background-color: #3C3A3A; border-radius: 20px; padding: 15px 15px 20px 15px; box-shadow: 1px 1px 5px black;",
    areaClosedClass:
      "position: fixed; bottom: 150px; width: 40px; height: 40px; left: 25px; z-index: 999; border-radius: 50%; background-color: #3C3A3A;",
    partnerImg:
      "margin-left: 20px; margin-right: 10px; border-radius: 50%; width: 80px; height: 80px;",
    partnerImgClosed: `${
      isMobile ? "" : "margin-right: 10px;"
    } border-radius: 50%; width: 40px; height: 40px; cursor: pointer; box-shadow: 1px 1px 5px black; padding: 5px;`,
    partnerName:
      "color: white; font-size: 11pt !important; margin-right: 10px; margin-left: 10px; margin-bottom: 12px; margin-top: -4px; font-weight: bold; display: block; text-align: left; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important;",
    shareCupomClass:
      "padding: 10px; margin: 5px 5px 5px 5px; border: 1px solid white; border-radius: 20px; font-family: Arial, serif !important; letter-spacing: 0px !important;",
    shareIconClass: "width: 15px; cursor: pointer; margin-top: 3px;",
    shareIconLinkClass: "width: 13px; cursor: pointer; margin-top: 8px;",
    closeButton:
      "background-color: #3C3A3A; color: white; cursor: pointer; border: none; font-weight: bolder; position: absolute; right: 5; width: 25px; height: 25px; line-height: 25px; border-radius: 50%; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important; margin-top: -10px;",
  };
};

/**
 * Cria o header flutuante do influenciador
 */
const createInfluencerHeader = () => {
  const isMobile = window.innerWidth < 768, // 768px ÃƒÆ’Ã‚Â© o breakpoint do Bootstrap para dispositivos mÃƒÆ’Ã‚Â³veis
    classesToUse = exportClassesToUse(isMobile);

  const lpLink = URL_LP.replace(
    "PARTNER_SLUG",
    FLIPNET_USER.partner.slug
  ).replace("COMPANY_SLUG", FLIP_COMPANY_SLUG);

  let contentAreaFlutuanteHtml = isMobile
    ? `
    ${getHTMLCss()}
    <div id="flip-card-modal">
        <div style="${
          classesToUse.partnerContainerClass
        }; margin-bottom: 10px;">
          <img src="${FLIPNET_USER.partner_photo}" style="${
        classesToUse.partnerImgClass
      }">
          <span style="${classesToUse.partnerNameClass}">${
        FLIPNET_USER.highlight_text
      }</span>
        </div>
        LANDING_PAGE_LINK
      </div>`
    : `<div style="${classesToUse.partnerContainerClass}">
        <img src="${FLIPNET_USER.partner_photo}" style="${classesToUse.partnerImgClass}">
        <span style="${classesToUse.partnerNameClass}">${FLIPNET_USER.highlight_text}</span>
      </div>
      LANDING_PAGE_LINK`;

  if (HAS_LP)
    contentAreaFlutuanteHtml = contentAreaFlutuanteHtml.replace(
      "LANDING_PAGE_LINK",
      isMobile && FLIPNET_VOUCHER
        ? `<p style="border-bottom: 1px solid white; color: white;" onclick="window.open('${lpLink}')">MEUS PRODUTOS FAVORITOS</p>`
        : isMobile && !FLIPNET_VOUCHER
        ? `<div style="text-align: center; display: block">
            <br/>
            <p style="border-bottom: 1px solid white; color: white;" onclick="window.open('${lpLink}')">MEUS PRODUTOS FAVORITOS</p>
          </div>`
        : `<div style="text-align: center;">
            <p style="border-bottom: 1px solid white; color: white;" onclick="window.open('${lpLink}')">MEUS PRODUTOS FAVORITOS</p>
          </div>`
    );
  else
    contentAreaFlutuanteHtml = contentAreaFlutuanteHtml.replace(
      "LANDING_PAGE_LINK",
      ""
    );

  const contentVoucher = FLIPNET_VOUCHER
    ? `<div style="text-align: center;">
    <span style="margin-top: 2px; text-align: center;">${
      FLIPNET_VOUCHER.type_discount == "percent"
        ? `${FLIPNET_VOUCHER.discount}% OFF`
        : `- R$ ${FLIPNET_VOUCHER.discount}`
    }</span>        
    <div style="${classesToUse.shareCupomClass}">
          <span style="margin-top: 2px;" id="voucherNumber">${
            FLIPNET_VOUCHER.number
          }</span> 
          <img id="voucherImage" src="https://flipnet-assets.s3.sa-east-1.amazonaws.com/admin/public/copy-icon.png" style="${
            classesToUse.shareIconClass
          }">
        </div>
      </div>`
    : "";

  const areaFlutuanteHtml = `
    <div style="${classesToUse.areaClass}">
      ${contentAreaFlutuanteHtml}
      ${contentVoucher}
    </div>
  `;

  const parser = new DOMParser(),
    areaFlutuante = parser.parseFromString(areaFlutuanteHtml, "text/html").body
      .firstChild;

  setTimeout(() => (areaFlutuante.style.opacity = "1"), 500);

  if (FLIPNET_VOUCHER) copyLinkOrVoucher(areaFlutuante, "voucher");

  const mainElement = document.querySelector("main");

  // ObtÃƒÆ’Ã‚Â©m o caminho da URL atual
  let currentPath = window.location.pathname;

  if (currentPath.includes("orders") || currentPath.includes("thank_you"))
    return;

  mainElement.parentNode.insertBefore(areaFlutuante, mainElement);
};

/**
 * Cria o header flutuante V2
 * (state: opened | closed)
 * Método trabalha de forma recursiva.
 */
const createInfluenceHeaderV2 = (state) => {
  localStorage.setItem("FLIP_HEADER_STATE", state);
  const areaFlutuanteHtml = getHTMLContent(state),
    mainElement = document.querySelector("main"),
    currentPath = window.location.pathname;

  const parser = new DOMParser(),
    areaFlutuante = parser.parseFromString(areaFlutuanteHtml, "text/html").body
      .firstChild;

  areaFlutuante.style.transform = "scale(0)";
  areaFlutuante.style.transition = "transform 0.3s ease";

  const btnAction = areaFlutuante.querySelector(
    state == "opened" ? "#closeButton" : "#openButton"
  );

  btnAction.addEventListener("click", () => {
    areaFlutuante.style.opacity = "0";
    if (state == "closed") createInfluenceHeaderV2("opened");
    else createInfluenceHeaderV2("closed");
  });

  setTimeout(() => {
    areaFlutuante.style.transform = "scale(1)";
    areaFlutuante.style.opacity = "1";
  }, 100);

  if (state == "opened" && FLIPNET_VOUCHER)
    copyLinkOrVoucher(areaFlutuante, "voucher");
  else if (state == "opened" && !FLIPNET_VOUCHER)
    copyLinkOrVoucher(areaFlutuante, "link");

  if (currentPath.includes("orders") || currentPath.includes("thank_you"))
    return;

  mainElement.parentNode.insertBefore(areaFlutuante, mainElement);
};

/**
 * Copia o código do voucher para a área de transferência
 */
const getHTMLContent = (type) => {
  const isMobile = window.innerWidth < 768,
    classesToUse = exportClassesToUseV2(isMobile);

  return type == "opened"
    ? `
    ${getHTMLCss()}
  <div style="${classesToUse.areaClass}" id="flip-card-modal">
    <button id="closeButton" style="${classesToUse.closeButton}">
      X
    </button>
    <h4 style="${classesToUse.partnerName}">${formatPartnerName(
        FLIPNET_USER.highlight_text,
        FLIPNET_VOUCHER
      )}</h4>
    <div style="display: flex; align-items: center;">
      <img src="${
        FLIPNET_USER.partner_photo
      }" alt="Foto do influenciador" style="${classesToUse.partnerImg}">
      ${
        FLIPNET_VOUCHER
          ? ButtonHasVoucher(classesToUse)
          : ButtonCopyLink(classesToUse)
      }
    </div>
  </div>
`
    : `
    ${getHTMLCss()}
  <div style="${classesToUse.areaClosedClass}" id="flip-card-modal">
    <img id="openButton" src="https://flipnet-assets.s3.sa-east-1.amazonaws.com/fronts/public/arrow-right.png" 
    alt="Foto do influenciador" style="${classesToUse.partnerImgClosed}"/>
  </div>
  `;
};

const ButtonHasVoucher = (classesToUse) => {
  return `<div style="text-align: center;">  
  <p style="color: white; margin-bottom: 5px; font-weight: bold; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important;">${
    FLIPNET_VOUCHER.type_discount == "percent"
      ? `${FLIPNET_VOUCHER.discount}% OFF`
      : `- R$ ${FLIPNET_VOUCHER.discount}`
  }</p>
  <div style="${
    classesToUse.shareCupomClass
  } align-items: center;" id="voucherImage">
    <span style="color: white; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important;" id="voucherNumber">
      ${FLIPNET_VOUCHER.number}           
    </span>         
    <img id="voucherImage" src="https://flipnet-assets.s3.sa-east-1.amazonaws.com/admin/public/copy-icon.png" style="${
      classesToUse.shareIconClass
    }">     
  </div>
</div>`;
};

const ButtonCopyLink = (classesToUse) => {
  return `<div style="text-align: center;">  
  <div style="${
    classesToUse.shareCupomClass
  } align-items: center; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important;" id="voucherImage">
    <span style="color: white; text-transform: uppercase !important; font-family: Arial, serif !important; letter-spacing: 0px !important;" id="voucherNumber">
      ${"Compartilhar!"}           
    </span>        
    <img  
    src="https://flipnet-assets.s3.sa-east-1.amazonaws.com/fronts/public/share.png" 
    style="${classesToUse.shareIconLinkClass}"/>
  </div>
</div>`;
};

/**
 * Copia o código do voucher ou link para a área de transferência
 * @param {*} areaFlutuante
 * @param {*} linkOrVoucher
 * @returns
 */
const copyLinkOrVoucher = (areaFlutuante, linkOrVoucher) =>
  areaFlutuante.querySelector("#voucherImage").addEventListener("click", () => {
    const voucher =
      areaFlutuante.querySelector("#voucherImage").previousSibling;
    const voucherNumber = areaFlutuante.querySelector("#voucherNumber");

    const content =
      linkOrVoucher == "link" ? window.location.href : FLIPNET_VOUCHER.number;

    navigator.clipboard.writeText(content).then(() => {
      voucherNumber.innerHTML =
        linkOrVoucher == "link" ? "link copiado!" : "Copiado!";

      setTimeout(
        () =>
          (voucherNumber.innerHTML =
            linkOrVoucher == "link" ? "Compartilhar!" : FLIPNET_VOUCHER.number),
        1000
      );
    });
  });

const getHTMLCss = () => {
  return `<style type="text/css">
              #flip-card-modal > * {
                margin: 0;
                padding: 0;
                border: 0;
                font-size: 100%;
                font: inherit;
                vertical-align: baseline;
              }
        </style>
      `;
};

const formatPartnerName = (partnerName, hasVoucher) => {
  const length = hasVoucher == null ? 30 : 23;

  return partnerName.length > length
    ? partnerName.substring(0, length) + "..."
    : partnerName;
};

/*****************************************
 *******
 * SCRIPT DA INSIDER
 *
 ****************************************/

const GtMin = (date, minutes_to_new_session) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.abs(now.getTime() - past.getTime());
  const mins = diff / (1000 * 60);

  return mins > minutes_to_new_session;
};

const gtDaysCookie = (date, days_to_cookie) => {
  const now = new Date(),
    past = new Date(date),
    diff = Math.abs(now.getTime() - past.getTime()),
    days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days > days_to_cookie;
};

var influencer_id = getInfluencerId();

if (influencer_id) {
  updateCount(influencer_id);

  if (localStorage.getItem("influ_set_at") !== null) {
    date_set = localStorage.getItem("influ_set_at");

    if (GtMin(date_set, 30)) deleteCookie("count_influ");
  }

  setInfluencer(influencer_id);

  getInfluencerData(influencer_id);

  if (getCookie("count_influ") == "not found") setCookie("count_influ", 1);
}

if (influencer_id !== null) {
  if (
    window.location.href.includes("thank_you") ||
    window.location.href.includes("orders")
  )
    saveSafeOrderSlug(influencer_id);
}

function saveSafeOrderSlug(influencer_id) {
  if (getParentSlugFromLink() != "insiderstore") {
    if (Shopify.checkout.order_id) {
      var URL_CONVERSION =
        "api/conversion/order/" +
        getParentSlugFromLink() +
        "/" +
        influencer_id +
        "/" +
        Shopify.checkout.order_id;

    console.log(URL_CONVERSION );
      var xhr = new XMLHttpRequest();

      url = URL_FRONT + URL_CONVERSION;
      xhr.open("GET", url, true);

      xhr.onreadystatechange = function () {
        if (
          this.readyState == 4 &&
          (this.status == 200 || this.status == 204)
        ) {
          retorno = JSON.parse(this.response);
        }
      };

      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send();
    }
  }
}

function updateCount(influencer_id) {
  var URL_UPDATECOUNT =
    "v1/visitors/create?router_name=Ecommerce&url=" +
    encodeURIComponent(window.location.href) +
    "&slug=" +
    influencer_id;

  var xhr = new XMLHttpRequest();

  url = URL_IOMS + URL_UPDATECOUNT;

  xhr.open("GET", url, true);

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("sucesso update count");
    }
  };

  xhr.send();
}

function getCookie(name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return decodeURIComponent(match[2]);
  } else {
    return "not found";
  }
}

function setCookie(name, value) {
  expires = 0;
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function updateCookie(name, value) {
  expires = 0;
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function SetUrlParameters(influencer_id)
{
    var newURL = null;
    if(!getParameterByFlip(INFLU_VAR))
    {
        newURL = updateURLParameter(
            window.location.href,
            INFLU_VAR,
            influencer_id
        );
    }
    var utmCampaign = getParameterByFlip(UTM_CAMPAIGN);
    
    var baseURL = window.location.href.replace("#!", "");
    
    if(!utmCampaign)
    {
        newURL = updateURLParameter(
            baseURL,
            UTM_CAMPAIGN,
            influencer_id
        );
    }
    if(utmCampaign !== influencer_id)
    {
         newURL = updateURLParameter(
            baseURL,
            UTM_CAMPAIGN,
            influencer_id
        );
    }
   
  
   window.history.pushState("", "", newURL);
}

function updateURLParameter(url, param, paramVal) {
  var newAdditionalURL = "",
    tempArray = url.split("?"),
    baseURL = tempArray[0],
    additionalURL = tempArray[1],
    temp = "";
    
   console.log(param);

  if (additionalURL) {
    tempArray = additionalURL.split("&");
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split("=")[0] != param) {
        newAdditionalURL += temp + tempArray[i];
        temp = "&";
      }
    }
  }

  var rows_txt = temp + "" + param + "=" + paramVal;
  return baseURL + "?" + newAdditionalURL + rows_txt;
}

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}

function getParentSlugFromLink() {
  var x = location.hostname
    .replace("www.", "")
    .replace("https://", "")
    .replace("http://", "")
    .split(".");

  if (x.length <= 3) {
    console.log(x[0]);
    return x[0];
  } else {
    console.log(x[1]);
    return x[1];
  }
}

function getParameterByFlip(name, url) {
  if (!url) url = window.location.href;

  name = name.replace(/[\[\]]/g, "\\$&");

  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getInfluencerId() {
  var influencer_id = getParameterByFlip(INFLU_VAR);

  if (
    influencer_id !== null &&
    localStorage.getItem("influ_set_at") !== null &&
    influencer_id !== localStorage.getItem("influencer_id")
  ) {
    deleteCookie("count_influ");
  }

  if (influencer_id == null) {
    if (localStorage.getItem("influencer_id")) {
      date_set = localStorage.getItem("influ_set_at");
      if (date_set == null) {
        today = new Date();
        today = today.toString();
        localStorage.setItem("influ_set_at", today);
      }
      //      if (GtMin(date_set, 30 * 24 * 60)) {

      if (GtMin(date_set, 5)) {
        // console.log("Sessao expirada: ");
        influencer_id = null;
      } else {
        influencer_id = localStorage.getItem("influencer_id");

        SetUrlParameters(influencer_id);
      }
    }
  }

  return influencer_id;
}

function setInfluencer(influencer_id) {
  localStorage.setItem("influencer_id", influencer_id);

  today = new Date();
  today = today.toString();
  localStorage.setItem("influ_set_at", today);
  
  SetUrlParameters(influencer_id);
}

function queryString(parameter) {
  var loc = location.search.substring(1, location.search.length);
  var param_value = false;
  var params = loc.split("&");

  for (i = 0; i < params.length; i++) {
    param_name = params[i].substring(0, params[i].indexOf("="));
    if (param_name == parameter) {
      param_value = params[i].substring(params[i].indexOf("=") + 1);
    }
  }

  if (param_value) return param_value;
  else return false;
}

