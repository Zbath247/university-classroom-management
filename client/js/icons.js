// client/js/icons.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Ultra-modern, crisp vector SVG icon system for DUC Classroom Portal.
//          Replaces basic informal emojis with sharp, scalable professional icons.
// ─────────────────────────────────────────────────────────────────────────────

(function (window) {
  'use strict';

  const SVG_PATHS = {
    // Navigation & Roles
    'dashboard': '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    'students': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'graduation-cap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    'teachers': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    'classes': '<path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/>',
    'subjects': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    'schedules': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2"/>',
    'attendance': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 11"/>',
    'assignments': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'resources': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><polyline points="9 14 12 17 15 14"/>',
    'profile': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',

    // Actions & CRUD
    'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    'trash': '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    'save': '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    'refresh': '<path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',

    // Feedback & Status
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'x-circle': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    'folder-open': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M2 10h20"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'award': '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    'sparkles': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',

    // Theme & Internationalization
    'sun': '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
  };

  // Mapping from classic Unicode emojis to vector SVG keys
  const EMOJI_MAP = {
    '📊': 'dashboard',
    '👥': 'students',
    '🎓': 'graduation-cap',
    '👨‍🎓': 'students',
    '👨‍🏫': 'teachers',
    '🏫': 'classes',
    '📚': 'subjects',
    '📅': 'schedules',
    '📋': 'attendance',
    '📁': 'resources',
    '📂': 'folder-open',
    '👤': 'profile',
    '🚪': 'logout',
    '➕': 'plus',
    '✏️': 'edit',
    '🗑️': 'trash',
    '🗑': 'trash',
    '🔍': 'search',
    '👁️': 'eye',
    '👁': 'eye',
    '💾': 'save',
    '✅': 'check-circle',
    '⚠️': 'alert-triangle',
    '❌': 'x-circle',
    'ℹ️': 'info',
    '⚡': 'activity',
    '🛡️': 'shield',
    '🛡': 'shield',
    '👑': 'award',
    '🔒': 'shield',
    '☀️': 'sun',
    '🌙': 'moon',
    '🌐': 'globe'
  };

  const AppIcons = {
    /**
     * Get SVG HTML string for an icon
     */
    get(name, {
      size = 18,
      color = 'currentColor',
      strokeWidth = 2,
      className = ''
    } = {}) {
      const path = SVG_PATHS[name] || SVG_PATHS['sparkles'];
      return `<svg class="app-svg-icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
    },

    /**
     * Replaces raw emojis inside elements with modern SVG icons
     */
    replaceIcons(root = document) {
      if (!root) return;

      // 1. Convert explicit data-icon attributes: <i data-icon="dashboard"></i>
      const iconPlaceholders = root.querySelectorAll('[data-icon]');
      iconPlaceholders.forEach(el => {
        const iconName = el.getAttribute('data-icon');
        const size = el.getAttribute('data-size') || 18;
        const color = el.getAttribute('data-color') || 'currentColor';
        el.innerHTML = AppIcons.get(iconName, { size, color });
      });

      // 2. Convert .nav-icon containing emojis
      const navIcons = root.querySelectorAll('.nav-icon');
      navIcons.forEach(el => {
        const text = el.textContent.trim();
        if (EMOJI_MAP[text]) {
          el.innerHTML = AppIcons.get(EMOJI_MAP[text], { size: 18 });
        }
      });

      // 3. Convert .stat-icon containing emojis
      const statIcons = root.querySelectorAll('.stat-icon');
      statIcons.forEach(el => {
        const text = el.textContent.trim();
        if (EMOJI_MAP[text]) {
          el.innerHTML = AppIcons.get(EMOJI_MAP[text], { size: 26, strokeWidth: 2 });
        }
      });

      // 4. Convert empty states icon: .empty-state-icon
      const emptyIcons = root.querySelectorAll('.empty-state-icon');
      emptyIcons.forEach(el => {
        const text = el.textContent.trim();
        if (EMOJI_MAP[text]) {
          el.innerHTML = AppIcons.get(EMOJI_MAP[text], { size: 48, strokeWidth: 1.5 });
        }
      });

      // 5. Convert action buttons in tables (e.g. "✏️ Edit", "🗑️")
      const actionButtons = root.querySelectorAll('button, a.btn');
      actionButtons.forEach(btn => {
        // Edit button with "✏️ Edit"
        if (btn.innerHTML.includes('✏️')) {
          btn.innerHTML = btn.innerHTML.replace('✏️', AppIcons.get('edit', { size: 14, className: 'btn-icon-svg' }));
        }
        // Trash button with "🗑️" or "🗑"
        if (btn.innerHTML.includes('🗑️') || btn.innerHTML.includes('🗑')) {
          btn.innerHTML = btn.innerHTML.replace(/🗑️|🗑/g, AppIcons.get('trash', { size: 14, className: 'btn-icon-svg' }));
        }
        // View button with "👁️"
        if (btn.innerHTML.includes('👁️') || btn.innerHTML.includes('👁')) {
          btn.innerHTML = btn.innerHTML.replace(/👁️|👁/g, AppIcons.get('eye', { size: 14, className: 'btn-icon-svg' }));
        }
        // Add button with "➕"
        if (btn.innerHTML.includes('➕')) {
          btn.innerHTML = btn.innerHTML.replace('➕', AppIcons.get('plus', { size: 14, className: 'btn-icon-svg' }));
        }
        // Save button with "💾"
        if (btn.innerHTML.includes('💾')) {
          btn.innerHTML = btn.innerHTML.replace('💾', AppIcons.get('save', { size: 14, className: 'btn-icon-svg' }));
        }
        // Download button with "⬇️"
        if (btn.innerHTML.includes('⬇️')) {
          btn.innerHTML = btn.innerHTML.replace('⬇️', AppIcons.get('download', { size: 14, className: 'btn-icon-svg' }));
        }
      });
    },

    /**
     * Start observing DOM mutations to automatically upgrade dynamic tables
     */
    initAutoObserver() {
      if (window._appIconsRanInitial) return;
      window._appIconsRanInitial = true;
      // Run clean replacement once on initial document load
      AppIcons.replaceIcons(document);
    }
  };

  // Expose globally
  window.AppIcons = AppIcons;

  // Auto-run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppIcons.initAutoObserver());
  } else {
    AppIcons.initAutoObserver();
  }

})(window);
