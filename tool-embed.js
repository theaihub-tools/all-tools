/**
 * Fortified Web Tool Child SDK (Ironclad Final Edition)
 * Zero Dependencies | Anti-Clone Guard | Smart Auto-Resize | SEO Shield | Bug-Free
 */
(function (win, doc) {
  "use strict";

  // 1. एंटी-टैम्परिंग और डुप्लीकेट लोडिंग लॉक
  if (win.__WT_CHILD_SDK__) return;
  Object.defineProperty(win, "__WT_CHILD_SDK__", {
    value: true,
    writable: false,
    configurable: false
  });

  var isIframe = (win.self !== win.top);
  var urlParams = new URLSearchParams(win.location.search);
  var embedUID = urlParams.get("embed_uid");

  // 2. डोमेन और क्लोन प्रोटेक्शन
  var allowedHosts = ["theaihub-tools.github.io", "localhost", "127.0.0.1"];
  var currentHost = win.location.hostname;
  if (currentHost && allowedHosts.indexOf(currentHost) === -1 && !currentHost.endsWith(".github.io")) {
    doc.documentElement.innerHTML = "<div style='font-family:sans-serif;text-align:center;padding:50px;'><h2>Unauthorized Domain</h2><p>This tool is licensed exclusively for The AI Hub Tools.</p></div>";
    return;
  }

  // 3. एडवांस कंटेंट और सोर्स कोड प्रोटेक्शन
  doc.addEventListener("contextmenu", function (e) {
    if (e.target.closest("input, textarea, select, [contenteditable='true'], .allow-copy, pre, code, .output-box, .result-box")) return;
    e.preventDefault();
  }, false);

  doc.addEventListener("dragstart", function (e) {
    if (!e.target.closest("input, textarea")) e.preventDefault();
  }, false);

  doc.addEventListener("keydown", function (e) {
    var key = e.key ? e.key.toLowerCase() : "";
    if (
      (e.ctrlKey && (key === "u" || key === "s" || key === "p")) ||
      (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
      e.keyCode === 123
    ) {
      e.preventDefault();
      return false;
    }
  }, false);

  // 4. यूनिवर्सल प्रोटेक्शन CSS (पुराना सब सुरक्षित + height: auto जोड़ा गया)
  var style = doc.createElement("style");
  style.textContent =
    "* { box-sizing: border-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }" +
    "input, textarea, select, [contenteditable='true'], .allow-copy, pre, code, .output-box, .result-box { " +
      "-webkit-user-select: text !important; " +
      "-moz-user-select: text !important; " +
      "-ms-user-select: text !important; " +
      "user-select: text !important; " +
    "}" +
    "html.in-iframe-mode, html.in-iframe-mode body { height: auto !important; min-height: 0 !important; overflow: hidden !important; margin: 0 !important; padding-top: 4px !important; padding-bottom: 10px !important; }" +
    "html.in-iframe-mode .hide-in-embed { display: none !important; }";
  (doc.head || doc.documentElement).appendChild(style);

  // 5. iFrame हैंडशेक, SEO शील्ड और Auto-Resize इंजन
  if (isIframe) {
    doc.documentElement.classList.add("in-iframe-mode");

    // SEO शील्ड: iFrame में डुप्लीकेट कंटेंट इंडेक्सिंग रोकना
    var existingMeta = doc.querySelector("meta[name='robots']");
    if (existingMeta) {
      existingMeta.content = "noindex, follow";
    } else {
      var metaRobots = doc.createElement("meta");
      metaRobots.name = "robots";
      metaRobots.content = "noindex, follow";
      (doc.head || doc.documentElement).appendChild(metaRobots);
    }

    // केवल बाहरी (External) लिंक्स को नए टैब में खोलें (इन-पेज # लिंक्स सुरक्षित रहेंगे)
    doc.addEventListener("click", function (e) {
      var anchor = e.target.closest("a");
      if (anchor && anchor.href && anchor.href.indexOf("http") === 0 && anchor.hostname !== win.location.hostname) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
    }, false);

    // सटीक ऊंचाई मापने और पैरेंट (iframe.js) को भेजने का इंजन (पुराना + नया दोनों मिलाकर)
    var lastSentHeight = 0;
    var resizeTimer = null;

    win.__sendHeightToParent = function () {
      if (!embedUID) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var mainBox = doc.querySelector(".main-container, .tool-container, .container, .card") || doc.body;
        if (!mainBox) return;

        var boxHeight = Math.max(
          mainBox.scrollHeight,
          mainBox.offsetHeight,
          mainBox.getBoundingClientRect().height
        );
        var docHeight = Math.max(
          doc.body ? doc.body.scrollHeight : 0,
          doc.documentElement ? doc.documentElement.scrollHeight : 0
        );

        var height = Math.ceil(Math.max(boxHeight, docHeight));

        if (height > 50 && height !== lastSentHeight) {
          lastSentHeight = height;
          win.parent.postMessage({
            type: "TOOL_RESIZE_EVENT",
            uid: embedUID,
            height: height
          }, "*");
        }
      }, 40);
    };

    // पैरेंट पेज को ऊपर स्क्रॉल करने के लिए ग्लोबल हेल्पर
    win.wtScrollTop = function () {
      if (!embedUID) return;
      win.parent.postMessage({
        type: "TOOL_SCROLL_TOP",
        uid: embedUID
      }, "*");
    };

    function initChildEngine() {
      // केवल पेज के मुख्य Header, Nav और Footer को छुपाएं
      doc.querySelectorAll("body > header, body > nav, body > footer, .navbar, .site-footer").forEach(function (el) {
        el.style.display = "none";
      });

      // फालतू SEO/FAQ सेक्शन छुपाएं
      doc.querySelectorAll("h2, h3, h4, strong, b").forEach(function (el) {
        if (/key features|how to use|frequently asked|faq|about this tool/i.test(el.textContent)) {
          var featureCard = el.closest(".card, section, div");
          if (featureCard && !featureCard.querySelector("input, textarea, select, button")) {
            featureCard.style.display = "none";
          }
        }
      });

      win.__sendHeightToParent();
      setTimeout(win.__sendHeightToParent, 250);
      setTimeout(win.__sendHeightToParent, 800);

      if (win.ResizeObserver && doc.body) {
        new ResizeObserver(win.__sendHeightToParent).observe(doc.body);
      }
      if (win.MutationObserver && doc.body) {
        new MutationObserver(win.__sendHeightToParent).observe(doc.body, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }
    }

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", initChildEngine);
    } else {
      initChildEngine();
    }

    win.addEventListener("load", win.__sendHeightToParent);
    win.addEventListener("resize", win.__sendHeightToParent);
  }

  // 6. Universal Automatic Embed Code Box Generator (सभी टूल्स के लिए नया जोड़ा गया)
  function initAutoEmbedBox() {
    if (isIframe) return; // iFrame में एम्बेड होने पर बॉक्स छुपा रहेगा

    var target = doc.getElementById("auto-embed-generator");
    if (!target) {
      var cardContainer = doc.querySelector(".card, .tool-card, .main-container, .container");
      if (!cardContainer) return;
      target = doc.createElement("div");
      target.id = "auto-embed-generator";
      cardContainer.appendChild(target);
    }

    if (target.innerHTML.trim() !== "") return; // डुप्लीकेट बॉक्स बनने से रोकें

    var currentUrl = win.location.href.split('?')[0];
    var domainUrl = win.location.origin;
    var basePath = win.location.href.substring(0, win.location.href.lastIndexOf('/') + 1);
    var pageH1 = doc.querySelector("h1");
    var brandName = (pageH1 ? pageH1.textContent.trim() : doc.title.split('|')[0].trim()) + " — The AI Hub Tools";

    var embedSnippet = '<div class="tool-embed-box" data-tool-url="' + currentUrl + '" data-height="540px" data-brand-name="' + brandName + '" data-brand-url="' + domainUrl + '"></div>\n' +
                       '<script src="' + basePath + 'iframe.js" defer><\/script>';

    target.innerHTML = 
      '<div style="margin-top: 25px; padding: 14px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; font-family: inherit; text-align: left;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
          '<strong style="font-size: 13px; color: #334155;">💻 Embed this tool on your website:</strong>' +
          '<button type="button" id="autoCopyBtn" style="padding: 6px 12px; background: #3182ce; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s;">Copy Embed Code</button>' +
        '</div>' +
        '<textarea id="autoEmbedText" readonly style="width: 100%; height: 65px; font-size: 12px; font-family: monospace; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; resize: none; background: #fff; box-sizing: border-box; color: #475569;">' + 
          embedSnippet + 
        '</textarea>' +
      '</div>';

    var copyBtn = doc.getElementById("autoCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function() {
        var textArea = doc.getElementById("autoEmbedText");
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textArea.value);

        var btn = this;
        btn.innerText = "Copied! ✓";
        btn.style.background = "#38a169";

        setTimeout(function() {
          btn.innerText = "Copy Embed Code";
          btn.style.background = "#3182ce";
        }, 2200);
      });
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", initAutoEmbedBox);
  } else {
    initAutoEmbedBox();
  }
})(window, document);
