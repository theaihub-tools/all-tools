/**
 * The AI Hub Tools - Ultimate Self-Healing & Tamper-Proof Support Engine (coffee.js v3)
 * Features: Closed Shadow DOM, Self-Healing MutationObserver, Auto UTM Attribution,
 *           Live Dark-Mode Sync, Iframe Guard, Domain Lock, GA4 Tracking
 */
(function () {
  'use strict';

  // =========================================================================
  // 1. IMMUTABLE CONFIGURATION
  // =========================================================================
  const CONFIG = Object.freeze({
    allowedDomains: Object.freeze(['theaihub-tools.github.io', 'theaihubtools.com', 'localhost', '127.0.0.1', '']),
    brandName: 'The AI Hub Tools',
    buttonText: 'Buy Me a Coffee',
    modalTitle: '☕ Keep These Tools 100% Free & Ad-Free',
    modalSubtitle: 'Every tool here runs 100% locally in your browser with zero server uploads or tracking. If this saved your time, support our independent development!',
    gumroadBaseUrl: 'https://panchal127.gumroad.com/coffee',
    globalButtonLabel: '☕ Buy Me a Coffee ($3)',
    position: 'bottom-right', // 'bottom-right' or 'bottom-left'
    dismissHours: 24,
    hostId: 'aihub-support-widget-host'
  });

  // =========================================================================
  // 2. SECURITY & ENVIRONMENT GUARDS
  // =========================================================================
  if (window.__AIHUB_COFFEE_V3_ACTIVE__) return;
  window.__AIHUB_COFFEE_V3_ACTIVE__ = true;

  // Hide inside third-party iframe embeds so tool interface remains clean
  try {
    if (window.self !== window.top) return;
  } catch (e) {
    return;
  }

  // Strict Domain Guard
  const currentHost = window.location.hostname;
  const isDomainValid = CONFIG.allowedDomains.some(
    d => currentHost === d || (d && currentHost.endsWith('.' + d))
  );
  if (!isDomainValid) return;

  // Build Dynamic UTM-Tagged Gumroad URL (Tracks exact tool source in Gumroad Analytics)
  function getTrackedGumroadUrl() {
    try {
      const url = new URL(CONFIG.gumroadBaseUrl);
      const slug = (window.location.pathname.split('/').pop() || 'home').replace(/\.html$/i, '') || 'home';
      url.searchParams.set('utm_source', 'theaihub_tools');
      url.searchParams.set('utm_medium', 'tip_jar');
      url.searchParams.set('utm_campaign', slug);
      return url.toString();
    } catch (e) {
      return CONFIG.gumroadBaseUrl;
    }
  }

  // Safe LocalStorage Helpers
  const STORAGE_KEY = 'aihub_tipjar_minimized_until';
  function getMinimizedUntil() {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch (e) {
      return 0;
    }
  }
  function setMinimizedUntil(ts) {
    try {
      localStorage.setItem(STORAGE_KEY, String(ts));
    } catch (e) {}
  }

  // GA4 Analytics Helper
  function trackEvent(actionName, label) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'tip_jar_interaction', {
          event_category: 'monetization',
          event_label: label || actionName,
          action: actionName
        });
      }
    } catch (e) {}
  }

  // Real-Time Dark Mode Detector
  function isPageDark() {
    const bodyTheme = document.body && document.body.getAttribute('data-theme');
    const htmlTheme = document.documentElement && document.documentElement.getAttribute('data-theme');
    if (bodyTheme === 'dark' || htmlTheme === 'dark') return true;
    if (bodyTheme === 'light' || htmlTheme === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // =========================================================================
  // 3. CLOSED SHADOW DOM MOUNTING & SELF-HEALING ENGINE
  // =========================================================================
  let modalRef = null;
  let modalBoxRef = null;
  let pillRef = null;

  function syncModalTheme() {
    if (!modalBoxRef) return;
    if (isPageDark()) modalBoxRef.classList.add('dark');
    else modalBoxRef.classList.remove('dark');
  }

  function mountWidget() {
    if (!document.body || document.getElementById(CONFIG.hostId)) return;

    const startMinimized = Date.now() < getMinimizedUntil();
    const hostEl = document.createElement('div');
    hostEl.id = CONFIG.hostId;
    hostEl.style.cssText = 'position:fixed;z-index:2147483640;pointer-events:none;inset:0;';
    document.body.appendChild(hostEl);

    const shadow = hostEl.attachShadow({ mode: 'closed' });
    const isLeft = CONFIG.position === 'bottom-left';
    const sideRule = isLeft ? 'left: 16px;' : 'right: 16px;';
    const trackedUrl = getTrackedGumroadUrl();

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

      .floating-wrap {
        position: fixed;
        bottom: 16px;
        ${sideRule}
        display: flex;
        align-items: center;
        gap: 6px;
        pointer-events: auto;
        z-index: 10;
        animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .coffee-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.22);
        padding: 10px 16px;
        border-radius: 50px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.32);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        user-select: none;
      }

      .coffee-pill:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(29, 78, 216, 0.42);
      }

      .coffee-pill.pulse {
        animation: gentlePulse 1.2s ease-in-out 2;
      }

      @keyframes gentlePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.25); }
      }

      .coffee-pill.compact { padding: 10px 12px; }
      .coffee-pill.compact .pill-label { display: none; }

      .min-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.85);
        color: #cbd5e1;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .min-btn:hover { background: #ef4444; color: #ffffff; }

      /* Modal Overlay */
      .modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.76);
        backdrop-filter: blur(5px);
        pointer-events: auto;
        align-items: center;
        justify-content: center;
        padding: 16px;
        z-index: 20;
      }

      .modal-overlay.open { display: flex; }

      .modal-box {
        --m-bg: #ffffff;
        --m-text: #0f172a;
        --m-muted: #475569;
        --m-border: #e2e8f0;
        --m-card: #f8fafc;
        background: var(--m-bg);
        color: var(--m-text);
        width: 100%;
        max-width: 410px;
        border-radius: 18px;
        padding: 28px 22px 22px;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.42);
        border: 1px solid var(--m-border);
        text-align: center;
        position: relative;
        animation: popIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modal-box.dark {
        --m-bg: #1e293b;
        --m-text: #f8fafc;
        --m-muted: #94a3b8;
        --m-border: #334155;
        --m-card: #0f172a;
      }

      @keyframes popIn {
        from { transform: scale(0.93); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .close-modal {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid var(--m-border);
        background: var(--m-card);
        color: var(--m-muted);
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .close-modal:hover { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }

      .badge-pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(34, 197, 94, 0.12);
        color: #16a34a;
        border: 1px solid rgba(34, 197, 94, 0.3);
        margin-bottom: 10px;
      }

      .modal-title { margin: 4px 0 10px; font-size: 18.5px; font-weight: 800; color: var(--m-text); line-height: 1.35; }
      .modal-desc { margin: 0 0 20px; font-size: 13.5px; color: var(--m-muted); line-height: 1.6; }

      .global-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 14px 18px;
        background: #ff90e8;
        color: #0f172a;
        text-decoration: none;
        font-weight: 800;
        font-size: 15px;
        border-radius: 11px;
        border: 1.5px solid #0f172a;
        box-shadow: 3px 3px 0px #0f172a;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .global-btn:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0px #0f172a; }
      .global-btn:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #0f172a; }

      .footer-note { margin-top: 16px; font-size: 11.5px; color: var(--m-muted); }
    `;

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="floating-wrap" id="floatingWrap">
        <button type="button" class="coffee-pill ${startMinimized ? 'compact' : ''}" id="openTipBtn" title="${CONFIG.buttonText}">
          <span style="font-size:15px;">☕</span>
          <span class="pill-label">${CONFIG.buttonText}</span>
        </button>
        ${!startMinimized ? '<button type="button" class="min-btn" id="minTipBtn" title="Minimize">✕</button>' : ''}
      </div>

      <div class="modal-overlay" id="tipModal" role="dialog" aria-modal="true">
        <div class="modal-box" id="modalBox">
          <button type="button" class="close-modal" id="closeModalBtn" title="Close">✕</button>
          <div class="badge-pill">🔒 100% Client-Side • Forever Free</div>
          <div style="font-size:34px; margin:2px 0;">☕💙</div>
          <h3 class="modal-title">${CONFIG.modalTitle}</h3>
          <p class="modal-desc">${CONFIG.modalSubtitle}</p>

          <a href="${trackedUrl}" target="_blank" rel="noopener noreferrer" class="global-btn" id="globalSupportLink">
            ${CONFIG.globalButtonLabel}
          </a>

          <div class="footer-note">Thank you for supporting ${CONFIG.brandName}!</div>
        </div>
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    pillRef = shadow.getElementById('openTipBtn');
    const minBtn = shadow.getElementById('minTipBtn');
    modalRef = shadow.getElementById('tipModal');
    modalBoxRef = shadow.getElementById('modalBox');
    const closeBtn = shadow.getElementById('closeModalBtn');
    const globalLink = shadow.getElementById('globalSupportLink');

    syncModalTheme();

    pillRef.addEventListener('click', () => {
      syncModalTheme();
      modalRef.classList.add('open');
      trackEvent('open_modal', window.location.pathname);
    });

    closeBtn.addEventListener('click', () => modalRef.classList.remove('open'));
    modalRef.addEventListener('click', (e) => {
      if (e.target === modalRef) modalRef.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalRef && modalRef.classList.contains('open')) {
        modalRef.classList.remove('open');
      }
    });

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        pillRef.classList.add('compact');
        minBtn.remove();
        setMinimizedUntil(Date.now() + CONFIG.dismissHours * 3600 * 1000);
        trackEvent('minimize_pill', window.location.pathname);
      });
    }

    if (globalLink) {
      globalLink.addEventListener('click', () => trackEvent('click_gumroad_support', trackedUrl));
    }
  }

  // Self-Healing & Live Theme Observer
  function startObservers() {
    if (!window.MutationObserver || !document.body) return;
    const observer = new MutationObserver(() => {
      if (!document.getElementById(CONFIG.hostId)) {
        mountWidget();
      }
      syncModalTheme();
    });
    observer.observe(document.body, { childList: true, attributes: true, attributeFilter: ['data-theme'] });
  }

  // Public Safe API (Optional: call window.AIHubSupport.pulse() when user finishes a task)
  window.AIHubSupport = Object.freeze({
    open: () => {
      if (modalRef) {
        syncModalTheme();
        modalRef.classList.add('open');
      }
    },
    pulse: () => {
      if (pillRef) {
        pillRef.classList.remove('pulse');
        void pillRef.offsetWidth;
        pillRef.classList.add('pulse');
      }
    }
  });

  function bootstrap() {
    mountWidget();
    startObservers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
