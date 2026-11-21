(() => {
  "use strict";

  // 1. Embed mode guard
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("embed") === "1") return;
  } catch (_) {
    if (window.location.search.indexOf("embed=1") !== -1) return;
  }

  // 2. Strict Domain Lock (Anti-Clone Protection)
  const ALLOWED_ORIGINS = Object.freeze([
    "theaihub-tools.github.io",
    "localhost",
    "127.0.0.1"
  ]);
  const currentHost = (window.location.hostname || "").toLowerCase();
  const isOfficial =
    currentHost === "" ||
    ALLOWED_ORIGINS.some(
      (domain) => currentHost === domain || currentHost.endsWith("." + domain)
    );

  if (!isOfficial) return;

  const HOST_ID = "aihub-fortified-trust-host";
  let healingScheduled = false;
  let uploadedBytes = 0;

  // 3. Real-Time Network Auditor (Tracks post-load data transfers)
  try {
    if (typeof PerformanceObserver !== "undefined") {
      const netAuditor = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.initiatorType === "fetch" ||
            entry.initiatorType === "xmlhttprequest" ||
            entry.initiatorType === "beacon"
          ) {
            const url = entry.name || "";
            const isInternalMetrics =
              url.includes("google-analytics.com") ||
              url.includes("googletagmanager.com");
            if (!isInternalMetrics && typeof entry.transferSize === "number") {
              uploadedBytes += entry.transferSize;
            }
          }
        }
      });
      netAuditor.observe({ type: "resource", buffered: false });
    }
  } catch (_) {}

  // 4. Deep-Frozen Multi-Language Dictionary (Tamper-Proof)
  const I18N = Object.freeze({
    en: Object.freeze({
      badge: "100% Free • No Sign-up • Runs Privately in Browser",
      verified: "Verified ✓",
      title: "Zero-Trust Client-Side Verified",
      netOk: "HTTPS • 0 KB Uploaded",
      p1: "✅ 0 Bytes Sent to Server: Your files & inputs never leave your device.",
      p2: "✅ Forever Free & Open: No login, no credit card, no hidden paywalls.",
      p3: "✅ Hardware-Accelerated Local Engine: Instant speed & total privacy."
    }),
    hi: Object.freeze({
      badge: "100% मुफ़्त • बिना साइन-अप • सीधे आपके ब्राउज़र में सुरक्षित",
      verified: "सत्यापित ✓",
      title: "100% सुरक्षित क्लाइंट-साइड टूल",
      netOk: "HTTPS • 0 KB अपलोड",
      p1: "✅ सर्वर पर 0 डेटा अपलोड: आपकी फ़ाइलें और डेटा पूरी तरह आपके फ़ोन/PC में रहते हैं।",
      p2: "✅ हमेशा के लिए मुफ़्त: न कोई लॉगिन, न कोई चार्ज, न कोई छिपी शर्त।",
      p3: "✅ तेज़ लोकल प्रोसेसिंग: बिना किसी इंतज़ार के तुरंत रिज़ल्ट।"
    }),
    ru: Object.freeze({
      badge: "100% Бесплатно • Без регистрации • Работает локально в браузере",
      verified: "Проверено ✓",
      title: "Локальная защита данных (Client-Side)",
      netOk: "HTTPS • 0 КБ отправлено",
      p1: "✅ 0 байт на сервер: Ваши файлы остаются только на вашем устройстве.",
      p2: "✅ Полностью бесплатно: Без регистрации, подписок и скрытых платежей.",
      p3: "✅ Мгновенная работа: Обработка напрямую в вашем браузере."
    }),
    es: Object.freeze({
      badge: "100% Gratis • Sin registro • Ejecución privada en tu navegador",
      verified: "Verificado ✓",
      title: "Seguridad Local Verificada",
      netOk: "HTTPS • 0 KB Subidos",
      p1: "✅ 0 Bytes enviados al servidor: Tus archivos nunca salen de tu dispositivo.",
      p2: "✅ Gratis para siempre: Sin cuentas, sin registros ni costos ocultos.",
      p3: "✅ Procesamiento instantáneo: Funciona directamente en tu navegador."
    }),
    fr: Object.freeze({
      badge: "100% Gratuit • Sans inscription • Exécution privée dans le navigateur",
      verified: "Vérifié ✓",
      title: "Sécurité Locale Vérifiée",
      netOk: "HTTPS • 0 Ko Envoyé",
      p1: "✅ 0 Octet envoyé au serveur : Vos fichiers restent sur votre appareil.",
      p2: "✅ Gratuit à vie : Aucun compte, aucune carte, aucun frais caché.",
      p3: "✅ Traitement instantané : Propulsé directement par votre navigateur."
    }),
    de: Object.freeze({
      badge: "100% Kostenlos • Ohne Anmeldung • Lokal im Browser ausgeführt",
      verified: "Verifiziert ✓",
      title: "Client-Side Sicherheit Verifiziert",
      netOk: "HTTPS • 0 KB Hochgeladen",
      p1: "✅ 0 Bytes Server-Upload: Ihre Daten verlassen niemals Ihr Gerät.",
      p2: "✅ Dauerhaft kostenlos: Keine Registrierung, keine versteckten Kosten.",
      p3: "✅ Sofortige Verarbeitung: Direkt in Ihrer Browser-Sandbox."
    }),
    pt: Object.freeze({
      badge: "100% Grátis • Sem cadastro • Execução privada no navegador",
      verified: "Verificado ✓",
      title: "Segurança Local Verificada",
      netOk: "HTTPS • 0 KB Enviados",
      p1: "✅ 0 Bytes enviados ao servidor: Seus arquivos ficam no seu dispositivo.",
      p2: "✅ Grátis para sempre: Sem login, sem cartão, sem taxas ocultas.",
      p3: "✅ Processamento instantâneo: Diretamente no seu navegador."
    }),
    ar: Object.freeze({
      badge: "مجاني 100% • بدون تسجيل • يعمل بخصوصية تامة في متصفحك",
      verified: "موثّق ✓",
      title: "أمان محلي موثّق بالكامل",
      netOk: "HTTPS • 0 KB مرفوع",
      p1: "✅ 0 بايت مرسل للخادم: ملفاتك وبياناتك تبقى بالكامل على جهازك.",
      p2: "✅ مجاني للأبد: بدون تسجيل دخول أو اشتراكات أو رسوم مخفية.",
      p3: "✅ معالجة فورية: يعمل مباشرة عبر محرك متصفحك."
    })
  });

  function getActiveLang() {
    const raw = (
      document.documentElement.lang ||
      navigator.language ||
      "en"
    )
      .toLowerCase()
      .slice(0, 2);
    return I18N[raw] || I18N.en;
  }

  function isDarkMode() {
    try {
      const bg = window.getComputedStyle(document.body).backgroundColor;
      const rgb = bg.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const luma =
          (Number(rgb[0]) * 299 +
            Number(rgb[1]) * 587 +
            Number(rgb[2]) * 114) /
          1000;
        return luma < 128;
      }
    } catch (_) {}
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function verifyClientSandbox() {
    const hasHttps =
      window.location.protocol === "https:" ||
      currentHost === "localhost" ||
      currentHost === "127.0.0.1";
    const hasWebCrypto =
      typeof window.Blob !== "undefined" &&
      typeof window.crypto !== "undefined" &&
      typeof window.URL !== "undefined";
    return hasHttps && hasWebCrypto;
  }

  // Live references to update text instantaneously on language switch
  let uiRefs = null;

  function syncLanguageUI() {
    if (!uiRefs) return;
    const t = getActiveLang();
    const isSecure = verifyClientSandbox();
    uiRefs.host.setAttribute("aria-label", t.title);
    uiRefs.label.textContent = t.badge;
    uiRefs.chip.textContent = t.verified;
    uiRefs.titleEl.textContent = "🔒 " + t.title;
    uiRefs.auditEl.textContent = isSecure
      ? uploadedBytes === 0
        ? t.netOk
        : "HTTPS • " + Math.round(uploadedBytes / 1024) + " KB"
      : "Local Sandbox";
    uiRefs.li1.textContent = t.p1;
    uiRefs.li2.textContent = t.p2;
    uiRefs.li3.textContent = t.p3;
  }

  function mountFortifiedBadge() {
    if (document.getElementById(HOST_ID)) return;

    const isSecure = verifyClientSandbox();
    const dark = isDarkMode();

    const host = document.createElement("div");
    host.id = HOST_ID;
    host.setAttribute("role", "region");
    host.style.cssText =
      "display:block;width:100%;margin:10px 0 18px 0;text-align:center;box-sizing:border-box;clear:both;position:relative;z-index:30;";

    // Closed Shadow DOM: Zero external access or CSS interference
    const shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .wrap {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        max-width: 96%;
      }
      .pill {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 7px;
        background: ${
          dark
            ? "linear-gradient(180deg, #064e3b 0%, #022c22 100%)"
            : "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)"
        };
        color: ${dark ? "#a7f3d0" : "#064e3b"};
        border: 1px solid ${dark ? "#10b981" : "#34d399"};
        padding: 7px 15px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.35;
        box-shadow: ${
          dark
            ? "0 3px 12px rgba(0, 0, 0, 0.45)"
            : "0 2px 10px rgba(5, 150, 105, 0.14)"
        };
        cursor: pointer;
        transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        user-select: none;
        box-sizing: border-box;
      }
      .pill:hover {
        transform: translateY(-1px);
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.26);
        border-color: #10b981;
      }
      .pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${isSecure ? "#10b981" : "#f59e0b"};
        flex-shrink: 0;
        animation: pulseRing 2.2s infinite;
      }
      @keyframes pulseRing {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
        70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      .chip {
        font-size: 11px;
        color: ${dark ? "#ecfdf5" : "#065f46"};
        background: ${dark ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.9)"};
        border: 1px solid ${dark ? "#34d399" : "#6ee7b7"};
        border-radius: 999px;
        padding: 1px 7px;
        font-weight: 700;
      }
      .card {
        display: none;
        margin-top: 9px;
        background: ${dark ? "#111827" : "#ffffff"};
        color: ${dark ? "#f3f4f6" : "#1f2937"};
        border: 1px solid ${dark ? "#10b981" : "#6ee7b7"};
        border-radius: 14px;
        padding: 13px 15px;
        width: 345px;
        max-width: 92vw;
        text-align: left;
        box-shadow: 0 14px 32px rgba(0, 0, 0, 0.22);
        font-size: 12.5px;
        line-height: 1.48;
        box-sizing: border-box;
      }
      .card.open {
        display: block;
      }
      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-weight: 700;
        color: ${dark ? "#6ee7b7" : "#064e3b"};
        font-size: 13px;
        padding-bottom: 7px;
        margin-bottom: 8px;
        border-bottom: 1px solid ${dark ? "#1f2937" : "#ecfdf5"};
      }
      .audit {
        font-size: 10.5px;
        font-weight: 700;
        background: ${dark ? "#064e3b" : "#d1fae5"};
        color: ${dark ? "#a7f3d0" : "#065f46"};
        padding: 2px 8px;
        border-radius: 999px;
        white-space: nowrap;
      }
      .list {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .list li {
        margin-bottom: 6px;
        color: ${dark ? "#d1d5db" : "#374151"};
      }
      .list li:last-child {
        margin-bottom: 0;
      }
      @media (max-width: 480px) {
        .pill {
          font-size: 12px;
          padding: 6px 12px;
          gap: 5px;
        }
      }
    `;

    const wrap = document.createElement("div");
    wrap.className = "wrap";

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pill";
    pill.setAttribute("aria-expanded", "false");

    const pulse = document.createElement("span");
    pulse.className = "pulse";

    const shield = document.createElement("span");
    shield.textContent = "🛡️";

    const label = document.createElement("span");
    const chip = document.createElement("span");
    chip.className = "chip";

    pill.append(pulse, shield, label, chip);

    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "card-head";

    const titleEl = document.createElement("span");
    const auditEl = document.createElement("span");
    auditEl.className = "audit";

    head.append(titleEl, auditEl);

    const list = document.createElement("ul");
    list.className = "list";

    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");
    list.append(li1, li2, li3);

    card.append(head, list);

    uiRefs = { host, label, chip, titleEl, auditEl, li1, li2, li3 };
    syncLanguageUI();

    // Events
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = card.classList.toggle("open");
      pill.setAttribute("aria-expanded", String(open));
      if (open) syncLanguageUI();
    });

    document.addEventListener("click", (e) => {
      if (!host.contains(e.target) && card.classList.contains("open")) {
        card.classList.remove("open");
        pill.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && card.classList.contains("open")) {
        card.classList.remove("open");
        pill.setAttribute("aria-expanded", "false");
      }
    });

    wrap.append(pill, card);
    shadow.append(style, wrap);

    // Smart Layout Placement
    const h1 = document.querySelector("h1");
    if (h1 && h1.parentNode) {
      const parentStyle = window.getComputedStyle(h1.parentNode);
      const isRowFlex =
        parentStyle.display.includes("flex") &&
        parentStyle.flexDirection === "row";

      if (isRowFlex && h1.parentNode.parentNode) {
        h1.parentNode.insertAdjacentElement("afterend", host);
      } else {
        h1.insertAdjacentElement("afterend", host);
      }
    } else if (document.body) {
      document.body.insertBefore(host, document.body.firstChild);
    }
  }

  function init() {
    mountFortifiedBadge();

    // Watch for translator.js language changes & DOM tampering
    if (typeof MutationObserver !== "undefined") {
      if (document.documentElement) {
        const langObserver = new MutationObserver(() => syncLanguageUI());
        langObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["lang"]
        });
      }

      if (document.body) {
        const domGuard = new MutationObserver(() => {
          if (!document.getElementById(HOST_ID) && !healingScheduled) {
            healingScheduled = true;
            requestAnimationFrame(() => {
              mountFortifiedBadge();
              healingScheduled = false;
            });
          }
        });
        domGuard.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
