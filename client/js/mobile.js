// client/js/mobile.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Enhanced Mobile UX for iOS & Android
// - Modern App-Like Bottom Navigation Dock
// - Touch Swipe-to-Close Gesture for Sidebar Drawer
// - Body Scroll-Locking on Mobile Drawer / Modals
// - Dynamic Sidebar Overlay Safeguards
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // Wait until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileExperience);
  } else {
    initMobileExperience();
  }

  function initMobileExperience() {
    setupSidebarOverlaySafety();
    setupTouchGestures();
    setupMobileBottomDock();
    setupBodyScrollLocking();
  }

  // ─── 1. Ensure Sidebar Overlay Exists on Every Page ───────────────────────────
  function setupSidebarOverlaySafety() {
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar && overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-locked');
      });
    }

    // Toggle button enhancement
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
          document.body.classList.add('sidebar-locked');
        } else {
          document.body.classList.remove('sidebar-locked');
        }
      });
    }
  }

  // ─── 2. Touch Swipe-to-Close Gesture ─────────────────────────────────────────
  function setupTouchGestures() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    let startX = 0;
    let currentX = 0;

    sidebar.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
    }, { passive: true });

    sidebar.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
    }, { passive: true });

    sidebar.addEventListener('touchend', () => {
      const diffX = startX - currentX;
      // If swiped left by more than 50px, close sidebar
      if (diffX > 50 && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('sidebar-locked');
      }
    }, { passive: true });
  }

  // ─── 3. Body Scroll-Locking Safeguard ──────────────────────────────────────────
  function setupBodyScrollLocking() {
    const observer = new MutationObserver(() => {
      const sidebar = document.getElementById('sidebar');
      const openModal = document.querySelector('.modal.active, .modal.show, [id$="-modal"].active');
      const isSidebarOpen = sidebar && sidebar.classList.contains('mobile-open');
      
      if (isSidebarOpen || openModal) {
        document.body.classList.add('sidebar-locked');
      } else {
        document.body.classList.remove('sidebar-locked');
      }
    });

    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  // ─── 4. Render App-Like Mobile Bottom Navigation Dock ────────────────────────
  function setupMobileBottomDock() {
    // Only render on dashboard/portal pages (skip login page)
    if (window.location.pathname.includes('login.html') || window.location.pathname === '/') return;
    if (document.querySelector('.mobile-bottom-dock')) return;

    const path = window.location.pathname;
    let role = 'student';
    if (path.includes('/admin/')) role = 'admin';
    else if (path.includes('/teacher/')) role = 'teacher';
    else if (path.includes('/student/')) role = 'student';

    const dock = document.createElement('nav');
    dock.className = 'mobile-bottom-dock';
    dock.setAttribute('aria-label', 'Mobile Bottom Navigation');

    let tabs = [];

    if (role === 'admin') {
      tabs = [
        {
          id: 'dock-dashboard',
          label: 'ផ្ទាំងដើម',
          labelEn: 'Dashboard',
          href: '/admin/dashboard.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
        },
        {
          id: 'dock-students',
          label: 'និស្សិត',
          labelEn: 'Students',
          href: '/admin/students.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        },
        {
          id: 'dock-classes',
          label: 'ថ្នាក់រៀន',
          labelEn: 'Classes',
          href: '/admin/classes.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
        },
        {
          id: 'dock-schedules',
          label: 'កាលវិភាគ',
          labelEn: 'Schedule',
          href: '/admin/schedules.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        },
        {
          id: 'dock-more',
          label: 'ម៉ឺនុយ',
          labelEn: 'Menu',
          isToggle: true,
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
        }
      ];
    } else if (role === 'teacher') {
      tabs = [
        {
          id: 'dock-dashboard',
          label: 'ផ្ទាំងដើម',
          labelEn: 'Dashboard',
          href: '/teacher/dashboard.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
        },
        {
          id: 'dock-attendance',
          label: 'វត្តមាន',
          labelEn: 'Attendance',
          href: '/teacher/attendance.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
        },
        {
          id: 'dock-resources',
          label: 'ឯកសារ',
          labelEn: 'Resources',
          href: '/teacher/resources.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
        },
        {
          id: 'dock-assignments',
          label: 'កិច្ចការ',
          labelEn: 'Assignments',
          href: '/teacher/assignments.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>'
        },
        {
          id: 'dock-more',
          label: 'ម៉ឺនុយ',
          labelEn: 'Menu',
          isToggle: true,
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
        }
      ];
    } else {
      // Student
      tabs = [
        {
          id: 'dock-dashboard',
          label: 'ផ្ទាំងដើម',
          labelEn: 'Dashboard',
          href: '/student/dashboard.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
        },
        {
          id: 'dock-schedule',
          label: 'កាលវិភាគ',
          labelEn: 'Timetable',
          href: '/student/schedule.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        },
        {
          id: 'dock-attendance',
          label: 'វត្តមាន',
          labelEn: 'Attendance',
          href: '/student/attendance.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
        },
        {
          id: 'dock-resources',
          label: 'ឯកសារ',
          labelEn: 'Resources',
          href: '/student/resources.html',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
        },
        {
          id: 'dock-more',
          label: 'ម៉ឺនុយ',
          labelEn: 'Menu',
          isToggle: true,
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
        }
      ];
    }

    const currentLang = localStorage.getItem('duc_language') || 'km';

    tabs.forEach(tab => {
      const isActive = tab.href && path.endsWith(tab.href);
      const text = (currentLang === 'en' && tab.labelEn) ? tab.labelEn : tab.label;

      if (tab.isToggle) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dock-tab';
        btn.innerHTML = `
          <span class="dock-icon">${tab.icon}</span>
          <span class="dock-label">${text}</span>
        `;
        btn.addEventListener('click', () => {
          const sidebar = document.getElementById('sidebar');
          const overlay = document.getElementById('sidebar-overlay');
          if (sidebar) {
            sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('active');
            if (sidebar.classList.contains('mobile-open')) {
              document.body.classList.add('sidebar-locked');
            } else {
              document.body.classList.remove('sidebar-locked');
            }
          }
        });
        dock.appendChild(btn);
      } else {
        const a = document.createElement('a');
        a.href = tab.href;
        a.className = `dock-tab ${isActive ? 'active' : ''}`;
        a.innerHTML = `
          <span class="dock-icon">${tab.icon}</span>
          <span class="dock-label">${text}</span>
        `;
        dock.appendChild(a);
      }
    });

    document.body.appendChild(dock);
  }
})();
