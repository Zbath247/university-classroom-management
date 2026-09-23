// client/js/theme.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Dark/Light Mode Theme Engine & Bilingual UI Switcher Controller
//          Digital University of Cambodia · University Classroom Management System
// ─────────────────────────────────────────────────────────────────────────────

(function (window) {
  'use strict';

  const THEME_KEY = 'duc_theme';

  /**
   * Determine initial theme:
   * 1. Stored preference
   * 2. OS prefers-color-scheme
   * 3. Fallback to 'light'
   */
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme attribute to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update any theme toggle buttons on the page
    updateThemeToggleUI(theme);

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('duc:themechange', { detail: { theme } }));
  }

  /**
   * Toggle between light and dark modes
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
  }

  /**
   * Update visual state of theme buttons in DOM
   */
  function updateThemeToggleUI(theme) {
    const isDark = theme === 'dark';
    const buttons = document.querySelectorAll('.btn-theme-toggle');
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? (window.I18n ? window.I18n.t('theme.light') : 'Light Mode') : (window.I18n ? window.I18n.t('theme.dark') : 'Dark Mode'));
      btn.classList.toggle('is-dark', isDark);

      const iconSpan = btn.querySelector('.theme-toggle-icon');
      if (iconSpan) {
        if (window.AppIcons) {
          iconSpan.innerHTML = isDark
            ? window.AppIcons.get('sun', { size: 18, color: '#f59e0b' })
            : window.AppIcons.get('moon', { size: 18, color: '#1e3a8a' });
        } else {
          iconSpan.textContent = isDark ? '☀️' : '🌙';
        }
      }
    });
  }

  /**
   * Build single language toggle button HTML (just like dark/light toggle)
   */
  function createLanguageToggleHTML() {
    const currentLang = window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km');
    const isKm = currentLang === 'km';
    const flag = isKm ? '🇰🇭' : '🇬🇧';
    const label = isKm ? 'ខ្មែរ' : 'EN';
    const nextLangTitle = isKm ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ';

    return `
      <button type="button" class="btn-lang-toggle" id="app-lang-toggle" aria-label="${nextLangTitle}" title="${nextLangTitle}">
        <span class="lang-toggle-flag">${flag}</span>
        <span class="lang-toggle-label">${label}</span>
      </button>
    `;
  }

  /**
   * Update visual state of single language toggle button in DOM
   */
  function updateLanguageToggleUI(lang) {
    const isKm = lang === 'km';
    const buttons = document.querySelectorAll('.btn-lang-toggle');
    buttons.forEach(btn => {
      const nextLangTitle = isKm ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ';
      btn.setAttribute('aria-label', nextLangTitle);
      btn.setAttribute('title', nextLangTitle);
      const flagSpan = btn.querySelector('.lang-toggle-flag');
      const labelSpan = btn.querySelector('.lang-toggle-label');
      if (flagSpan) flagSpan.textContent = isKm ? '🇰🇭' : '🇬🇧';
      if (labelSpan) labelSpan.textContent = isKm ? 'ខ្មែរ' : 'EN';
    });
  }

  /**
   * Toggle between Khmer and English
   */
  function toggleLanguage() {
    const current = window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km');
    const next = current === 'km' ? 'en' : 'km';
    if (window.I18n) {
      window.I18n.setLanguage(next);
    }
    updateLanguageToggleUI(next);
    return next;
  }

  /**
   * Build theme toggle button HTML
   */
  function createThemeToggleHTML() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = currentTheme === 'dark';
    const icon = isDark
      ? (window.AppIcons ? window.AppIcons.get('sun', { size: 18, color: '#f59e0b' }) : '☀️')
      : (window.AppIcons ? window.AppIcons.get('moon', { size: 18, color: '#1e3a8a' }) : '🌙');
    const tooltip = isDark
      ? (window.I18n ? window.I18n.t('theme.light') : 'Light Mode')
      : (window.I18n ? window.I18n.t('theme.dark') : 'Dark Mode');

    return `
      <button type="button" class="btn-theme-toggle ${isDark ? 'is-dark' : ''}" id="app-theme-toggle" aria-label="${tooltip}" title="${tooltip}">
        <span class="theme-toggle-icon">${icon}</span>
      </button>
    `;
  }

  /**
   * Bind event listeners for injected controls
   */
  function bindControlsEvents(container) {
    // Theme toggles
    const themeBtns = container.querySelectorAll('.btn-theme-toggle');
    themeBtns.forEach(themeBtn => {
      if (!themeBtn.dataset.bound) {
        themeBtn.dataset.bound = 'true';
        themeBtn.addEventListener('click', () => {
          toggleTheme();
        });
      }
    });

    // Language toggles
    const langBtns = container.querySelectorAll('.btn-lang-toggle');
    langBtns.forEach(langBtn => {
      if (!langBtn.dataset.bound) {
        langBtn.dataset.bound = 'true';
        langBtn.addEventListener('click', (e) => {
          e.preventDefault();
          toggleLanguage();
        });
      }
    });
  }

  /**
   * Auto-inject controls cluster into sidebar and topbar for full mobile + desktop access
   */
  function injectControls(targetContainer) {
    let container = targetContainer;

    if (!container) {
      // 1. If page has a sidebar (Dashboard pages)
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        let wrapper = sidebar.querySelector('#sidebar-controls');
        if (!wrapper) {
          wrapper = document.createElement('div');
          wrapper.id = 'sidebar-controls';
          wrapper.className = 'sidebar-controls';
          wrapper.innerHTML = `
            <div class="app-controls-cluster" id="app-controls-cluster">
              ${createLanguageToggleHTML()}
              ${createThemeToggleHTML()}
            </div>
          `;

          const sidebarFooter = sidebar.querySelector('.sidebar-footer');
          if (sidebarFooter) {
            sidebar.insertBefore(wrapper, sidebarFooter);
          } else {
            sidebar.appendChild(wrapper);
          }
        }
        bindControlsEvents(wrapper);

        // Also inject topbar quick language/theme switcher (crucial for mobile phones!)
        const topbarRight = document.querySelector('.topbar-right');
        if (topbarRight && !topbarRight.querySelector('.topbar-controls-cluster')) {
          const topbarCluster = document.createElement('div');
          topbarCluster.className = 'topbar-controls-cluster';
          topbarCluster.innerHTML = `
            ${createLanguageToggleHTML()}
            ${createThemeToggleHTML()}
          `;
          topbarRight.insertBefore(topbarCluster, topbarRight.firstChild);
          bindControlsEvents(topbarCluster);
        }

        updateLanguageToggleUI(window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km'));
        updateThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'light');
        return;
      }

      // 2. Standalone pages (e.g., login page)
      const loginControls = document.getElementById('login-top-controls');
      if (loginControls) {
        container = loginControls;
      } else {
        const topbarRight = document.querySelector('.topbar-right');
        if (topbarRight) container = topbarRight;
      }
    }

    if (!container) return;

    // Check if cluster already exists
    let cluster = container.querySelector('#app-controls-cluster');
    if (!cluster) {
      cluster = document.createElement('div');
      cluster.id = 'app-controls-cluster';
      cluster.className = 'app-controls-cluster';
      cluster.innerHTML = `
        ${createLanguageToggleHTML()}
        ${createThemeToggleHTML()}
      `;

      container.appendChild(cluster);
      bindControlsEvents(cluster);
    }
  }

  // Early execution to prevent flash of wrong theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Re-sync on language change
  window.addEventListener('duc:langchange', (e) => {
    const lang = e.detail?.lang;
    updateLanguageToggleUI(lang);
    updateThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'light');
  });

  // Global ThemeManager API
  window.ThemeManager = {
    getTheme: () => document.documentElement.getAttribute('data-theme') || 'light',
    applyTheme,
    toggleTheme,
    injectControls,
    updateThemeToggleUI,
    updateLanguageToggleUI,
    toggleLanguage
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectControls();
    });
  } else {
    injectControls();
  }

})(window);
