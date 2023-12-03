
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.latest.pt-BR.9e3381227b78b7752868.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/578.latest.pt-BR.7e9120a69e9a70f03b63.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/441.latest.pt-BR.04eff29e3df2d466c911.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/598.latest.pt-BR.23521011ff03f413990d.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.pt-BR.a5dc3e7cf04c478eb982.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/731.latest.pt-BR.13d4de92b88330e8fea9.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.latest.pt-BR.4b97dd039737e8f95da8.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/844.latest.pt-BR.7fcd45ae446a9a5574e8.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/Redesign.latest.pt-BR.8e1437eefc068059bdab.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/578.latest.pt-BR.5a217062b4c1c1b8f516.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.pt-BR.e73cab4b1bb1fcdbd393.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.latest.pt-BR.5f60c0e91d9d5d6ad7d1.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/661.latest.pt-BR.f5c8a63d6ab31cfe7511.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/2316/0905/files/logo_basico.com_2015_preto_1_x320.png?v=1628806076"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  