// client/js/dashboard.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Shared utilities for all dashboard pages (admin, teacher, student).
//
// Include this script on every dashboard HTML page AFTER api.js and auth.js.
//
// WHAT IT DOES:
//   1. Checks if the user is logged in (redirect to login if not)
//   2. Checks the user has the correct role for this page
//   3. Populates the sidebar and topbar with the user's name/avatar
//   4. Sets up sidebar toggle for mobile and desktop
//   5. Sets up logout button
// ─────────────────────────────────────────────────────────────────────────────

// ─── Initialize Dashboard ─────────────────────────────────────────────────────
/**
 * Call this at the top of each dashboard page.
 * @param {string} requiredRole - 'admin', 'teacher', or 'student'
 */
function initDashboard(requiredRole) {
  // 1. Check login
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  // 2. Check role
  const user = getCurrentUser();
  if (!user) {
    clearAuthData();
    window.location.href = '/login.html';
    return;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is logged in but has wrong role — redirect to their correct dashboard
    showToast(`Access denied. Redirecting to your dashboard...`, 'warning');
    setTimeout(() => redirectToDashboard(), 1500);
    return;
  }

  // 3. Populate UI with user info
  populateUserUI(user);

  // 4. Set up sidebar toggle
  setupSidebar();

  // 5. Apply official university logo & favicon
  applyGlobalUniversityBranding();

  // 6. Inject consistent portal branding footer
  appendPortalFooter();

  // 7. Upgrade all basic emojis to modern SVG vector icons
  loadAndApplyModernIcons();

  // 8. Initialize Dual-Language (Khmer/English) & Dark/Light Mode
  initThemeAndBilingualEngine();

  // 9. Initialize Modern Mobile Experience (iOS & Android Bottom Dock, Gestures, Safe-Area)
  initMobileEnhancements();
}

// ─── Get Formatted Display Name ───────────────────────────────────────────────
function getUserDisplayName(user, lang) {
  if (!user) user = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!user) return 'User';

  const currentLang = lang || (window.I18n && window.I18n.getCurrentLang ? window.I18n.getCurrentLang() : (localStorage.getItem('lang') || 'km'));
  const isKhmer = currentLang === 'km';

  if (user.role === 'student') {
    if (isKhmer && user.profile?.full_name_kh) {
      return user.profile.full_name_kh;
    }
    return user.profile?.full_name || user.username || 'Student';
  }

  if (user.role === 'teacher') {
    const raw = user.profile?.full_name || user.username || 'Teacher';
    const khMatch = raw.match(/\((.*?)\)/);
    const khmerName = khMatch ? khMatch[1].trim() : '';
    const enClean = raw.replace(/\(.*?\)/, '').trim();

    if (isKhmer) {
      if (khmerName) return `លោកគ្រូ ${khmerName}`;
      return raw;
    }
    return enClean || raw;
  }

  if (user.role === 'admin') {
    return isKhmer ? 'អ្នកគ្រប់គ្រង' : 'Administrator';
  }

  return user.profile?.full_name || user.username || 'User';
}

// ─── Format Bilingual Person Name for Tables ─────────────────────────────────
// ─── Format Bilingual Person Name for Tables ─────────────────────────────────
function formatPersonName(fullName, khmerName = null, targetLang = null) {
  if (!fullName) return '—';
  const lang = targetLang || (window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km'));
  const isKhmer = lang === 'km';

  if (khmerName) {
    if (!isKhmer) {
      return `<div class="name-en">${fullName}</div>`;
    }
    return `
      <div class="name-khmer" style="font-weight:600; font-size:0.95rem;">${khmerName}</div>
      <div class="name-en" style="font-size:0.8rem; color:var(--text-muted);">${fullName}</div>
    `;
  }

  const match = fullName.match(/^(.*?)\s*[\(\[]\s*([\u1780-\u17FF\s]+)\s*[\)\]]/);
  if (match) {
    const enName = match[1].trim();
    const khName = match[2].trim();
    if (!isKhmer) {
      return `<div class="name-en">${enName}</div>`;
    }
    const khPrefix = enName.includes('Mr.') ? 'លោកគ្រូ ' : '';
    return `
      <div class="name-khmer" style="font-size:0.95rem; font-weight:700;">${khPrefix}${khName}</div>
      <div class="name-en" style="font-size:0.8rem; color:var(--text-muted);">${enName}</div>
    `;
  }

  if (/^[\u1780-\u17FF\s]+$/.test(fullName)) {
    return `<div class="name-khmer" style="font-size:0.95rem; font-weight:700;">${fullName}</div>`;
  }

  return `<div class="name-en">${fullName}</div>`;
}
window.formatPersonName = formatPersonName;

// ─── Format Bilingual Text Utility (Switches based on current language) ────
function formatBilingualText(text, targetLang) {
  if (!text) return '';
  const lang = targetLang || (window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km'));
  const isKhmer = lang === 'km';

  // 1. Parenthesized format: "English Name (ឈ្មោះខ្មែរ)"
  const parenMatch = text.match(/^(.*?)\s*[\(\[]\s*([\u1780-\u17FF\s0-9A-Za-z]+)\s*[\)\]]$/);
  if (parenMatch) {
    const enPart = parenMatch[1].trim();
    const khPart = parenMatch[2].trim();
    if (!isKhmer) {
      return enPart;
    }
    const gMatch = enPart.match(/^(G\d+)/i);
    if (gMatch && !khPart.startsWith(gMatch[1])) {
      return `${gMatch[1]} ${khPart}`;
    }
    return khPart;
  }

  // 2. Academic descriptions with semester / year
  if (text.includes('ឆមាស') || text.includes('ជំនាន់') || text.includes('ឆ្នាំ') || text.includes('Faculty of Digital Industry') || text.includes('Semester')) {
    if (!isKhmer) {
      let en = text
        .replace(/ឆមាសទី\s*([១-៩\d]+)/g, (m, p1) => {
          const num = { '១':'1', '២':'2', '៣':'3', '៤':'4' }[p1] || p1;
          return `Semester ${num}`;
        })
        .replace(/ឆ្នាំទី\s*([១-៩\d]+)/g, (m, p1) => {
          const num = { '១':'1', '២':'2', '៣':'3', '៤':'4' }[p1] || p1;
          return `Year ${num}`;
        })
        .replace(/ជំនាន់ទី\s*([១-៩\d]+)/g, (m, p1) => {
          const num = { '១':'1', '២':'2', '៣':'3', '៤':'4' }[p1] || p1;
          return `Gen ${num}`;
        })
        .replace(/មហាវិទ្យាល័យឧស្សាហកម្មឌីជីថល/g, 'Faculty of Digital Industry');
      en = en.replace(/(Semester \d+)\s+(Year \d+)\s+(Gen \d+)/, '$1, $2, $3');
      return en;
    } else {
      return text
        .replace(/Faculty of Digital Industry/g, 'មហាវិទ្យាល័យឧស្សាហកម្មឌីជីថល')
        .replace(/Semester\s*1/gi, 'ឆមាសទី១')
        .replace(/Semester\s*2/gi, 'ឆមាសទី២')
        .replace(/Year\s*1/gi, 'ឆ្នាំទី១')
        .replace(/Year\s*2/gi, 'ឆ្នាំទី២')
        .replace(/Year\s*3/gi, 'ឆ្នាំទី៣')
        .replace(/Year\s*4/gi, 'ឆ្នាំទី៤')
        .replace(/Gen\s*1/gi, 'ជំនាន់ទី១')
        .replace(/Gen\s*2/gi, 'ជំនាន់ទី២');
    }
  }

  // 3. Subject descriptions with instructor: "System Analysis & Design (SAD) — លោកគ្រូ ឈាង វុទ្ធី"
  if (text.includes('— លោកគ្រូ') || text.includes('— Instructor') || text.includes('— Mr.')) {
    if (!isKhmer) {
      return text
        .replace(/លោកគ្រូ\s*ឈាង\s*វុទ្ធី/g, 'Instructor Chheang Vuthey')
        .replace(/លោកគ្រូ\s*សែម\s*វ៉ាវី/g, 'Instructor Sem Vavy')
        .replace(/លោកគ្រូ\s*(?:ភឿន|គឿន)\s*មេសា/g, 'Instructor Koeun Mesa')
        .replace(/លោកគ្រូ/g, 'Instructor');
    } else {
      return text
        .replace(/Instructor Chheang Vuthey|Mr\. Chheang Vuthey/g, 'លោកគ្រូ ឈាង វុទ្ធី')
        .replace(/Instructor Sem Vavy|Mr\. Sem Vavy/g, 'លោកគ្រូ សែម វ៉ាវី')
        .replace(/Instructor (?:Phoeun|Koeun) Mesa|Mr\.\s*(?:Phoeun|Koeun) Mesa/g, 'លោកគ្រូ គឿន មេសា')
        .replace(/Instructor\s+/g, 'លោកគ្រូ ');
    }
  }

  return text;
}
window.formatBilingualText = formatBilingualText;

// ─── Format Date Utility (Shared across all portals) ──────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
window.formatDate = formatDate;

function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
}
window.formatTime = formatTime;

// ─── Get Clean Avatar Initial ─────────────────────────────────────────────────
function getUserInitial(user) {
  if (!user) user = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!user) return '?';

  const raw = user.profile?.full_name || user.username || '?';
  const clean = raw.replace(/^mr\.\s*|^mrs\.\s*|^ms\.\s*|^លោកគ្រូ\s*|^អ្នកគ្រូ\s*/i, '').trim();
  return (clean[0] || '?').toUpperCase();
}

// ─── Populate User Info in UI ─────────────────────────────────────────────────
function populateUserUI(user) {
  if (!user) user = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!user) return;

  const initial = getUserInitial(user);
  const name    = getUserDisplayName(user);
  const role    = user.role || '';
  const avatarUrl = user.avatar || user.profile?.avatar || null;

  function renderAvatarElement(el, fallbackText) {
    if (!el) return;
    if (avatarUrl) {
      el.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="avatar-img" onerror="this.onerror=null;if(this.parentElement)this.parentElement.textContent='${fallbackText}';" />`;
      el.style.overflow = 'hidden';
      el.style.padding = '0';
    } else {
      el.textContent = fallbackText;
      el.style.overflow = '';
      el.style.padding = '';
    }
  }

  // Sidebar
  const sidebarAvatar   = document.getElementById('sidebar-avatar');
  const sidebarUsername = document.getElementById('sidebar-username');
  renderAvatarElement(sidebarAvatar, initial);
  if (sidebarUsername) sidebarUsername.textContent = name;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const effectiveRole = (role || (window.location.pathname.includes('/teacher/') ? 'teacher' : window.location.pathname.includes('/student/') ? 'student' : 'admin')).toLowerCase();
    sidebar.classList.remove('role-admin', 'role-teacher', 'role-student');
    sidebar.classList.add(`role-${effectiveRole}`);
  }

  // Topbar
  const topbarAvatar   = document.getElementById('topbar-avatar');
  const topbarUsername = document.getElementById('topbar-username');
  const topbarRole     = document.getElementById('topbar-role');
  renderAvatarElement(topbarAvatar, initial);
  if (topbarUsername) topbarUsername.textContent = name;
  if (topbarRole)     topbarRole.textContent     = role;

  // Page Welcome Names & Class Labels (Instant zero-flicker pre-fill)
  const studentDisplay = document.getElementById('student-display-name');
  if (studentDisplay) {
    studentDisplay.textContent = name;
  }
  const studentClass = document.getElementById('student-class-label');
  if (studentClass && (studentClass.textContent === 'Loading class...' || !studentClass.textContent)) {
    const code = user.profile?.class_code || 'G1-NW-B';
    const cName = user.profile?.class_name || 'Networking & Security B';
    studentClass.textContent = `${code} · ${cName}`;
  }
  const statClass = document.getElementById('stat-class');
  if (statClass && statClass.textContent === '—') {
    statClass.textContent = user.profile?.class_code || 'G1-NW-B';
  }
  const teacherDisplay = document.getElementById('teacher-display-name');
  if (teacherDisplay) {
    teacherDisplay.textContent = name;
  }
}

function updateUIAvatar(newAvatarUrl) {
  const user = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (user) {
    user.avatar = newAvatarUrl;
    if (user.profile) {
      user.profile.avatar = newAvatarUrl;
    }
    localStorage.setItem('user', JSON.stringify(user));
  }
  const initial = user ? getUserInitial(user) : '?';
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const topbarAvatar  = document.getElementById('topbar-avatar');

  [sidebarAvatar, topbarAvatar].forEach(el => {
    if (!el) return;
    if (newAvatarUrl) {
      el.innerHTML = `<img src="${newAvatarUrl}" alt="Avatar" class="avatar-img" onerror="this.onerror=null;if(this.parentElement)this.parentElement.textContent='${initial}';" />`;
      el.style.overflow = 'hidden';
      el.style.padding = '0';
    } else {
      el.textContent = initial;
      el.style.overflow = '';
      el.style.padding = '';
    }
  });
}
window.updateUIAvatar = updateUIAvatar;

// ─── Sidebar Toggle ───────────────────────────────────────────────────────────
function setupSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const overlay     = document.getElementById('sidebar-overlay');
  const toggleBtn   = document.getElementById('sidebar-toggle');

  if (sidebar) {
    const p = window.location.pathname;
    const fallbackRole = p.includes('/teacher/') ? 'teacher' : p.includes('/student/') ? 'student' : 'admin';
    if (!sidebar.classList.contains('role-admin') && !sidebar.classList.contains('role-teacher') && !sidebar.classList.contains('role-student')) {
      sidebar.classList.add(`role-${fallbackRole}`);
    }
  }

  if (toggleBtn && sidebar && !toggleBtn._hasMobileToggleListener) {
    toggleBtn._hasMobileToggleListener = true;
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
      } else {
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (overlay && !overlay._hasMobileCloseListener) {
    overlay._hasMobileCloseListener = true;
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }

  // Auto-close sidebar on mobile when navigating
  sidebar.querySelectorAll('.sidebar-nav a.nav-link, .sidebar-footer a').forEach(link => {
    if (!link._hasMobileNavClose) {
      link._hasMobileNavClose = true;
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
        }
      });
    }
  });

  if (!window._hasMobileResizeListener) {
    window._hasMobileResizeListener = true;
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  }

  setupMobileTopbarBrand();
}

// ─── Mobile Topbar Brand (University Logo + DUC Abbreviation) ───────────────
function setupMobileTopbarBrand() {
  const topbarLeft = document.querySelector('.topbar-left');
  if (!topbarLeft) return;
  if (topbarLeft.querySelector('.mobile-topbar-brand')) return;

  const path = window.location.pathname;
  let dashUrl = '/student/dashboard.html';
  if (path.includes('/admin/')) dashUrl = '/admin/dashboard.html';
  else if (path.includes('/teacher/')) dashUrl = '/teacher/dashboard.html';

  const brandLink = document.createElement('a');
  brandLink.href = dashUrl;
  brandLink.className = 'mobile-topbar-brand';
  brandLink.id = 'mobile-topbar-brand';
  brandLink.setAttribute('aria-label', 'DUC Classroom');
  brandLink.title = 'DUC Classroom';
  brandLink.innerHTML = `
    <img src="/assets/duc-logo.png" alt="DUC Logo" class="mobile-topbar-logo" />
    <span class="mobile-topbar-name">DUC</span>
  `;

  const toggleBtn = topbarLeft.querySelector('.sidebar-toggle');
  if (toggleBtn) {
    topbarLeft.insertBefore(brandLink, toggleBtn);
  } else {
    topbarLeft.prepend(brandLink);
  }
}
window.setupMobileTopbarBrand = setupMobileTopbarBrand;

// ─── Active Nav Link ──────────────────────────────────────────────────────────
// Automatically highlights the current page's nav link
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

// ─── Verify Token with Server ─────────────────────────────────────────────────
// Call this to verify the stored token is still valid
async function verifyToken() {
  try {
    const result = await api.get('/auth/me');
    return result.success;
  } catch (error) {
    if (error.status === 401) {
      clearAuthData();
      showToast('Your session has expired. Please log in again.', 'warning', 3000);
      setTimeout(() => { window.location.href = '/login.html'; }, 2000);
      return false;
    }
    return false;
  }
}

// ─── Global University Branding (Favicon & Sidebar Logo) ──────────────────────
function applyGlobalUniversityBranding() {
  // 1. Ensure tab favicon uses official DUC logo
  let favicon = document.querySelector("link[rel*='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    document.head.appendChild(favicon);
  }
  favicon.href = '/assets/duc-logo.png';

  // 2. Set official DUC logo in sidebar brand
  const sidebarBrandIcon = document.querySelector('.sidebar-brand-icon');
  if (sidebarBrandIcon) {
    sidebarBrandIcon.innerHTML = `<img src="/assets/duc-logo.png" alt="DUC Logo">`;
  }
}

// ─── Portal Branding Footer ──────────────────────────────────────────────────
function appendPortalFooter() {
  const main = document.getElementById('main-content') || document.querySelector('.main-content');
  if (!main || main.querySelector('.portal-footer')) return;

  const footer = document.createElement('footer');
  footer.className = 'portal-footer';
  footer.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
      <img src="/assets/duc-logo.png" alt="DUC Logo" style="width:28px; height:28px; object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15));">
      <span><strong data-i18n="univ.name">Digital University of Cambodia (DUC)</strong></span>
    </div>
    <div>
      <span data-i18n="footer.rights">© 2026 All Rights Reserved</span>
    </div>
  `;
  main.appendChild(footer);
}

// ─── Modern SVG Icon Loader ──────────────────────────────────────────────────
function loadAndApplyModernIcons() {
  if (window.AppIcons) {
    window.AppIcons.initAutoObserver();
    return;
  }
  const existingScript = document.querySelector('script[src*="icons.js"]');
  if (existingScript) return;

  const script = document.createElement('script');
  script.src = '/js/icons.js';
  script.onload = () => {
    if (window.AppIcons) {
      window.AppIcons.initAutoObserver();
    }
  };
  document.head.appendChild(script);
}

// ─── Dual-Language (Khmer/English) & Dark/Light Mode Loader ───────────────────
function initThemeAndBilingualEngine() {
  function ensureScript(src, callback) {
    const existing = document.querySelector(`script[src*="${src}"]`);
    if (existing) {
      if (callback) callback();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { if (callback) callback(); };
    document.head.appendChild(s);
  }

  // Helper to tag standard dashboard elements with i18n keys
  function tagElements() {
    // 1. Sidebar Section Labels
    document.querySelectorAll('.sidebar-section-label').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (txt === 'main' || txt === 'ទំព័រចម្បង') el.setAttribute('data-i18n', 'nav.main');
      else if (txt === 'management' || txt === 'ការគ្រប់គ្រងទិន្នន័យ') el.setAttribute('data-i18n', 'nav.management');
      else if (txt.includes('academic') || txt.includes('ការសិក្សា')) el.setAttribute('data-i18n', 'nav.academic');
      else if (txt === 'system' || txt === 'ប្រព័ន្ធ') el.setAttribute('data-i18n', 'nav.system');
    });

    // 2. Sidebar Navigation Items
    const navMap = {
      'dashboard': 'nav.dashboard',
      'ផ្ទាំងព័ត៌មាន': 'nav.dashboard',
      'students': 'nav.students',
      'បញ្ជីនិស្សិត': 'nav.students',
      'teachers': 'nav.teachers',
      'បញ្ជីសាស្ត្រាចារ្យ': 'nav.teachers',
      'classes': 'nav.classes',
      'បន្ទប់ & ថ្នាក់រៀន': 'nav.classes',
      'subjects': 'nav.subjects',
      'មុខវិជ្ជាសិក្សា': 'nav.subjects',
      'schedules': 'nav.schedules',
      'timetable': 'nav.schedules',
      'កាលវិភាគសិក្សា': 'nav.schedules',
      'attendance': 'nav.attendance',
      'កត់ត្រាវត្តមាន': 'nav.attendance',
      'assignments': 'nav.assignments',
      'កិច្ចការ & លំហាត់': 'nav.assignments',
      'resources': 'nav.resources',
      'ឯកសារមេរៀន': 'nav.resources',
      'profile': 'nav.profile',
      'my profile': 'nav.profile',
      'ព័ត៌មានផ្ទាល់ខ្លួន': 'nav.profile',
      'sign out': 'nav.signout',
      'ចាកចេញពីប្រព័ន្ធ': 'nav.signout',
      'logout': 'nav.logout',
      'ចាកចេញ': 'nav.logout'
    };

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      const label = link.querySelector('.nav-label');
      if (label) {
        const txt = label.textContent.trim().toLowerCase();
        if (navMap[txt]) {
          label.setAttribute('data-i18n', navMap[txt]);
        }
      }
    });

    // 3. Topbar Page Title & Document Title
    const titleMap = {
      'dashboard': 'nav.dashboard',
      'admin dashboard': 'page.admin_dashboard',
      'teacher dashboard': 'page.teacher_dashboard',
      'student dashboard': 'page.student_dashboard',
      'class schedules & timetable': 'page.schedules',
      'class timetables': 'page.class_timetables',
      'class timetable': 'page.class_timetables',
      'weekly class timetable': 'page.weekly_timetable',
      'manage students': 'page.students',
      'student management': 'page.students',
      'manage teachers': 'page.teachers',
      'teacher management': 'page.teachers',
      'manage classes': 'page.classes',
      'class management': 'page.classes',
      'class groups': 'page.class_groups',
      'manage subjects': 'page.subjects',
      'subject management': 'page.subjects',
      'academic subjects': 'page.academic_subjects',
      'attendance': 'page.attendance',
      'attendance management': 'page.attendance',
      'student attendance sheet': 'page.attendance_sheet',
      'record daily attendance': 'page.record_attendance',
      'my attendance record': 'page.my_attendance_record',
      'attendance tracking': 'page.attendance_tracking',
      'assignments': 'page.assignments',
      'assignments & homework': 'page.assignments',
      'course assignments': 'page.course_assignments',
      'learning resources': 'page.resources',
      'resources': 'page.resources',
      'learning materials & resources': 'page.learning_materials',
      'course learning resources': 'page.course_resources',
      'learning materials repository': 'page.materials_repo',
      'student profile': 'page.profile',
      'my profile': 'page.profile',
      'my student profile': 'page.my_student_profile',
      'my weekly schedule': 'page.my_weekly_schedule',
      'teacher teaching timetable': 'page.teacher_schedule'
    };

    document.querySelectorAll('#page-title, .topbar-title, .page-header h1, h1.page-title').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (titleMap[txt]) {
        el.setAttribute('data-i18n', titleMap[txt]);
      }
    });

    // 4. Subtitles
    const subMap = {
      'assign teachers, subjects, days, and classrooms to each class cohort': 'sub.schedules',
      'your official weekly schedule for lectures, labs, and classrooms': 'sub.timetable',
      'digital university of cambodia · class g1-nw-b': 'sub.general',
      'manage student attendance, course assignments, and learning materials': 'sub.teacher_dashboard',
      'overview of your weekly classes, assigned classrooms, and timing': 'sub.teacher_schedule',
      'select class and subject to load the roster, mark statuses, and save in one click': 'sub.attendance',
      'create and track student coursework, projects, and submission deadlines': 'sub.assignments_teacher',
      'share lecture notes, slides, video recordings, and study links with students': 'sub.resources_teacher',
      'track your classroom participation, attendance percentage, and session records': 'sub.my_attendance_record',
      'view assigned coursework, laboratory exercises, and submission deadlines': 'sub.student_assignments',
      'access lecture slides, textbooks, code repositories, and references shared by your instructors': 'sub.student_resources',
      'personal identity records and account security settings': 'sub.student_profile',
      'manage university student cohorts, sections, and academic cohorts': 'sub.classes',
      'manage course catalog, credit allocations, and subject outlines': 'sub.subjects'
    };

    document.querySelectorAll('.page-subtitle, .page-header p').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (subMap[txt]) {
        el.setAttribute('data-i18n', subMap[txt]);
      }
    });

    // 5. User Roles in Topbar & Sidebar
    const roleMap = {
      'admin': 'role.admin',
      'administrator': 'role.administrator',
      'teacher': 'role.teacher',
      'lecturer': 'role.teacher',
      'student': 'role.student'
    };

    document.querySelectorAll('.topbar-user-role, .sidebar-user-role').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (roleMap[txt]) {
        el.setAttribute('data-i18n', roleMap[txt]);
      }
    });

    // 6. Action Buttons
    const btnMap = {
      'add student': 'btn.add_student',
      'add new student': 'btn.add_new_student',
      'add teacher': 'btn.add_teacher',
      'add new teacher': 'btn.add_new_teacher',
      'add class': 'btn.add_class',
      'add new class': 'btn.add_new_class',
      'add subject': 'btn.add_subject',
      'add new subject': 'btn.add_new_subject',
      'add new schedule': 'btn.add_schedule',
      'new assignment': 'action.new_assignment',
      'create new assignment': 'modal.create_assignment',
      'take attendance': 'action.take_attendance',
      "take today's attendance": 'btn.take_today_attendance',
      'share resource': 'action.share_resource',
      'share new resource': 'modal.share_resource',
      'weekly view': 'action.weekly_view',
      'full schedule': 'action.full_schedule',
      'manage all': 'table.view_all',
      'view all': 'table.view_all',
      'my attendance': 'action.my_attendance',
      'study files': 'action.study_files',
      'timetable': 'btn.timetable',
      'filter': 'action.filter',
      'reset': 'action.reset',
      'logout': 'nav.logout',
      'load roster': 'action.load_roster',
      'mark all present': 'action.mark_all_present',
      'mark all absent': 'action.mark_all_absent',
      'save attendance': 'action.save_attendance',
      'save attendance records': 'btn.save_attendance_records',
      'save class': 'btn.save_class',
      'save subject': 'btn.save_subject',
      'save changes': 'btn.save_changes'
    };

    document.querySelectorAll('.page-header .btn, button.btn-secondary, button.btn-outline, #btn-logout, a.btn').forEach(btn => {
      const rawTxt = btn.textContent.replace(/[➕📅🚪✅📝📁📋💾🔍\s]+/g, ' ').trim().toLowerCase();
      if (btnMap[rawTxt]) {
        btn.setAttribute('data-i18n', btnMap[rawTxt]);
      }
    });

    // 7. Stat Card Labels
    const statMap = {
      'total students': 'stat.total_students',
      'total teachers': 'stat.total_teachers',
      'total classes': 'stat.total_classes',
      'total subjects': 'stat.total_subjects',
      'active schedules': 'stat.active_schedules',
      'my classes': 'stat.my_classes',
      'my class': 'stat.my_class',
      'assigned classes': 'stat.assigned_classes',
      'today sessions': 'stat.today_sessions',
      'today classes': 'stat.today_classes',
      'total assignments': 'stat.total_assignments',
      'shared resources': 'stat.shared_resources',
      'pending tasks': 'stat.pending_tasks',
      'avg attendance rate': 'stat.attendance_rate',
      'average attendance': 'stat.attendance_rate',
      'attendance rate': 'stat.attendance_rate',
      'class assignments': 'stat.class_assignments',
      'enrolled subjects': 'stat.enrolled_subjects',
      'completed tasks': 'stat.completed_assignments',
      'present sessions': 'stat.present_sessions',
      'late arrivals': 'stat.late_arrivals',
      'permission / leave': 'stat.permission_leave',
      'absent (unexcused)': 'stat.absent_unexcused'
    };

    document.querySelectorAll('.stat-label').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (statMap[txt]) {
        el.setAttribute('data-i18n', statMap[txt]);
      }
    });

    // 8. Timetable Table Headers & Common Table Columns
    const thMap = {
      'time \\ day': 'table.time_day',
      'monday': 'day.monday',
      'tuesday': 'day.tuesday',
      'wednesday': 'day.wednesday',
      'thursday': 'day.thursday',
      'friday': 'day.friday',
      'saturday': 'day.saturday',
      'sunday': 'day.sunday',
      'no.': 'table.id',
      '#': 'table.id',
      'actions': 'table.actions',
      'status': 'table.status',
      'gender': 'table.gender',
      'phone': 'table.phone',
      'email': 'table.email',
      'class': 'table.class',
      'subject': 'table.subject',
      'teacher': 'table.teacher',
      'room': 'table.room',
      'time': 'table.time',
      'day': 'table.day',
      'date': 'table.date',
      'due date': 'table.due_date',
      'score': 'table.score',
      'grade': 'table.grade'
    };

    document.querySelectorAll('.table th').forEach(th => {
      const txt = th.textContent.trim().toLowerCase();
      if (thMap[txt]) {
        th.setAttribute('data-i18n', thMap[txt]);
      }
    });

    // 9. Dropdown Filter Options
    document.querySelectorAll('select option').forEach(opt => {
      const txt = opt.textContent.trim().toLowerCase();
      if (txt === 'all classes') opt.setAttribute('data-i18n', 'filter.all_classes');
      else if (txt === 'all days') opt.setAttribute('data-i18n', 'filter.all_days');
      else if (txt.includes('select class')) opt.setAttribute('data-i18n', 'filter.select_class');
      else if (thMap[txt]) opt.setAttribute('data-i18n', thMap[txt]);
    });

    // 10. Sidebar Brand Subtitle
    const brandSub = document.querySelector('.sidebar-brand-sub');
    if (brandSub) {
      const txt = brandSub.textContent.trim().toLowerCase();
      if (txt.includes('admin')) brandSub.setAttribute('data-i18n', 'admin.panel');
      else if (txt.includes('teacher')) brandSub.setAttribute('data-i18n', 'teacher.panel');
      else if (txt.includes('student')) brandSub.setAttribute('data-i18n', 'student.portal');
    }
  }

  // Run ThemeManager & I18n immediately
  if (window.ThemeManager) {
    window.ThemeManager.injectControls();
  }
  tagElements();
  if (window.I18n) {
    window.I18n.autoTranslate(document);
  } else {
    ensureScript('/js/i18n.js', () => {
      tagElements();
      if (window.I18n) window.I18n.autoTranslate(document);
    });
  }
  if (!window.ThemeManager) {
    ensureScript('/js/theme.js', () => {
      if (window.ThemeManager) window.ThemeManager.injectControls();
    });
  }

  // Re-translate whenever language switches
  window.addEventListener('duc:langchange', () => {
    tagElements();
    if (window.I18n) {
      window.I18n.autoTranslate(document);
    }
    populateUserUI();

    // Re-render active table data with current language
    if (typeof renderClassesTable === 'function' && typeof allClasses !== 'undefined' && allClasses.length) {
      renderClassesTable(allClasses);
    }
    if (typeof renderSubjectsTable === 'function' && typeof allSubjects !== 'undefined' && allSubjects.length) {
      renderSubjectsTable(allSubjects);
    }
    if (typeof renderTeachersTable === 'function' && typeof allTeachers !== 'undefined' && allTeachers.length) {
      renderTeachersTable(allTeachers);
    }
    if (typeof renderStudentsTable === 'function' && typeof allStudents !== 'undefined' && allStudents.length) {
      renderStudentsTable(allStudents);
    }
    if (typeof renderSchedulesTable === 'function' && typeof allSchedules !== 'undefined' && allSchedules.length) {
      renderSchedulesTable(allSchedules);
    }
  });
}

// ─── Custom Confirm Dialog ───────────────────────────────────────────────────
function showConfirmDialog({
  title = (window.I18n ? window.I18n.t('modal.confirm_title') : 'Confirm Action'),
  message = (window.I18n ? window.I18n.t('modal.confirm_delete') : 'Are you sure you want to proceed?'),
  icon = '⚠️',
  confirmText = (window.I18n ? window.I18n.t('action.confirm') : 'Confirm'),
  cancelText = (window.I18n ? window.I18n.t('action.cancel') : 'Cancel'),
  type = 'danger'
} = {}) {
  return new Promise((resolve) => {
    let modal = document.getElementById('global-confirm-modal');
    const modalIconHtml = (icon === '⚠️' && window.AppIcons)
      ? window.AppIcons.get('alert-triangle', { size: 36, color: type === 'danger' ? '#ef4444' : '#f59e0b' })
      : icon;

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'global-confirm-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal modal-confirm-content">
          <div class="modal-confirm-icon ${type}" id="confirm-modal-icon">${modalIconHtml}</div>
          <h3 class="modal-confirm-title" id="confirm-modal-title" data-i18n="modal.confirm_title">${title}</h3>
          <p class="modal-confirm-desc" id="confirm-modal-desc" data-i18n="modal.confirm_delete">${message}</p>
          <div class="modal-confirm-actions">
            <button type="button" class="btn btn-secondary" id="confirm-btn-cancel" data-i18n="action.cancel">${cancelText}</button>
            <button type="button" class="btn btn-${type === 'danger' ? 'danger' : 'primary'}" id="confirm-btn-ok" data-i18n="action.confirm">${confirmText}</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      document.getElementById('confirm-modal-icon').className = `modal-confirm-icon ${type}`;
      document.getElementById('confirm-modal-icon').innerHTML = modalIconHtml;
      document.getElementById('confirm-modal-title').textContent = title;
      document.getElementById('confirm-modal-desc').textContent = message;
      const okBtn = document.getElementById('confirm-btn-ok');
      okBtn.className = `btn btn-${type === 'danger' ? 'danger' : 'primary'}`;
      okBtn.textContent = confirmText;
      document.getElementById('confirm-btn-cancel').textContent = cancelText;
    }

    const cancelBtn = document.getElementById('confirm-btn-cancel');
    const okBtn     = document.getElementById('confirm-btn-ok');

    const cleanUp = () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      cancelBtn.onclick = null;
      okBtn.onclick = null;
    };

    cancelBtn.onclick = () => {
      cleanUp();
      resolve(false);
    };

    okBtn.onclick = () => {
      cleanUp();
      resolve(true);
    };

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
}

// ─── Empty State Component Helper ─────────────────────────────────────────────
function renderEmptyState(container, {
  icon = '📂',
  title = (window.I18n ? window.I18n.t('modal.empty_title') : 'No records found'),
  message = (window.I18n ? window.I18n.t('modal.empty_desc') : 'There are no items to display at this time.'),
  actionHtml = ''
} = {}) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <div class="empty-state-title" data-i18n="modal.empty_title">${title}</div>
      <div class="empty-state-desc" data-i18n="modal.empty_desc">${message}</div>
      ${actionHtml ? `<div class="empty-state-action">${actionHtml}</div>` : ''}
    </div>
  `;
}

// ─── Seamless In-Page Swap (Ultra-Smooth SPA/PJAX) ──────────────────────────
function setupSeamlessNavigation() {
  if (window._seamlessNavInitialized) return;
  window._seamlessNavInitialized = true;

  document.addEventListener('click', (e) => {
    // Only handle primary left click without modifier keys (ctrl, shift, meta)
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes('logout')) return;
    if (link.hasAttribute('download')) return;

    try {
      const targetUrl = new URL(link.href, window.location.origin);
      if (targetUrl.origin === window.location.origin && targetUrl.pathname !== window.location.pathname) {
        const curPath = window.location.pathname;
        const tgtPath = targetUrl.pathname;
        const isSameRealm =
          (curPath.startsWith('/admin/') && tgtPath.startsWith('/admin/')) ||
          (curPath.startsWith('/teacher/') && tgtPath.startsWith('/teacher/')) ||
          (curPath.startsWith('/student/') && tgtPath.startsWith('/student/'));

        if (isSameRealm) {
          e.preventDefault();
          navigateToPage(targetUrl.href, true);
        }
      }
    } catch (_) {}
  });

  // Handle browser Back / Forward buttons seamlessly
  window.addEventListener('popstate', () => {
    navigateToPage(window.location.href, false);
  });
}

async function navigateToPage(url, pushState = true) {
  const currentMain = document.getElementById('main-content') || document.querySelector('.main-content');
  if (!currentMain) {
    window.location.href = url;
    return;
  }

  // Update navigation items active state immediately
  const targetPath = new URL(url, window.location.origin).pathname;
  document.querySelectorAll('.sidebar-nav .nav-link, .dock-tab').forEach(l => {
    l.classList.remove('active');
    const h = l.getAttribute('href');
    if (h && (h === targetPath || targetPath.endsWith(h))) {
      l.classList.add('active');
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('sidebar-locked');
  }

  // Start progress indicator
  const bar = document.getElementById('global-top-progress');
  if (bar) {
    bar.classList.remove('done');
    bar.classList.add('active');
  }

  try {
    // Gentle fast transition: subtle fade
    currentMain.style.transition = 'opacity 0.1s ease-out, transform 0.1s ease-out';
    currentMain.style.opacity = '0.35';
    currentMain.style.transform = 'translateY(2px)';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Page load failed');
    const htmlText = await response.text();

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, 'text/html');

    const newMain = newDoc.getElementById('main-content') || newDoc.querySelector('.main-content');
    if (!newMain) {
      window.location.href = url;
      return;
    }

    if (pushState) {
      window.history.pushState(null, '', url);
    }
    if (newDoc.title) {
      document.title = newDoc.title;
    }

    // Swap main content seamlessly
    currentMain.innerHTML = newMain.innerHTML;

    // Swap modal backdrops cleanly
    document.querySelectorAll('.modal-backdrop:not(#global-confirm-modal)').forEach(m => m.remove());
    newDoc.querySelectorAll('.modal-backdrop:not(#global-confirm-modal)').forEach(m => {
      document.body.appendChild(document.importNode(m, true));
    });
    document.querySelectorAll('.modal').forEach(box => {
      box.addEventListener('click', (e) => e.stopPropagation());
    });

    // Re-bind topbar & branding
    setupSidebar();
    setupMobileTopbarBrand();
    populateUserUI();
    if (window.ThemeManager) {
      window.ThemeManager.injectControls();
    }
    if (typeof initThemeAndBilingualEngine === 'function') {
      initThemeAndBilingualEngine();
    }
    if (window.AppIcons) {
      window.AppIcons.replaceIcons(currentMain);
    }

    // Execute page-specific inline scripts using document.addEventListener hook
    const inlineScripts = newDoc.querySelectorAll('script');
    const deferredCallbacks = [];
    const originalAddEventListener = document.addEventListener;

    document.addEventListener = function(event, callback, options) {
      if (event === 'DOMContentLoaded') {
        deferredCallbacks.push(callback);
      } else {
        originalAddEventListener.call(document, event, callback, options);
      }
    };

    inlineScripts.forEach(s => {
      if (s.src) return; // skip external scripts
      const code = s.textContent;
      if (code && !code.includes('duc_theme') && !code.includes('anti-fouc')) {
        try {
          const safeCode = code.replace(/(^|\n)\s*(let|const)\s+([a-zA-Z0-9_$]+)\s*=/g, '$1var $3 =');
          const scriptEl = document.createElement('script');
          scriptEl.textContent = safeCode;
          document.body.appendChild(scriptEl);
          scriptEl.remove();
        } catch (scriptErr) {
          console.warn('Page script execution error:', scriptErr);
        }
      }
    });

    document.addEventListener = originalAddEventListener;

    for (const cb of deferredCallbacks) {
      try {
        const res = cb();
        if (res && typeof res.then === 'function') {
          await res;
        }
      } catch (cbErr) {
        console.error('Page init callback error:', cbErr);
      }
    }

    if (window.I18n) {
      window.I18n.autoTranslate(currentMain);
    }

    // Finish progress bar
    if (bar) {
      bar.classList.remove('active');
      bar.classList.add('done');
      setTimeout(() => {
        bar.classList.remove('done');
        bar.style.width = '0%';
      }, 250);
    }

    // Smooth reveal of new content
    requestAnimationFrame(() => {
      currentMain.style.opacity = '1';
      currentMain.style.transform = 'translateY(0)';
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (err) {
    console.error('Seamless transition failed, falling back to full navigation:', err);
    window.location.href = url;
  }
}

// ─── Instant Visual Feedback & Predictive Prefetch ───────────────────────────
function setupInstantFeedbackAndPrefetch() {
  // 1. Create or get top progress bar
  let bar = document.getElementById('global-top-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'global-top-progress';
    document.body.appendChild(bar);
  }

  // Dismiss loading bar on current page load
  bar.classList.remove('active');
  bar.classList.add('done');
  setTimeout(() => {
    bar.classList.remove('done');
    bar.style.width = '0%';
  }, 400);

  // 2. Instant 0ms visual feedback when clicking links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes('logout')) return;

    try {
      const url = new URL(link.href, window.location.origin);
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
        // Highlight clicked navigation link immediately
        document.querySelectorAll('.sidebar-nav .nav-link, .dock-tab').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Start top progress bar instantly
        bar.classList.remove('done');
        bar.classList.add('active');
      }
    } catch (_) {}
  });

  // 3. Smart Predictive Prefetch on hover/touch
  const prefetched = new Set();
  function prefetch(url) {
    if (!url || prefetched.has(url) || url.startsWith('#') || url.startsWith('javascript:')) return;
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin || parsed.pathname === window.location.pathname) return;
      prefetched.add(url);

      const linkEl = document.createElement('link');
      linkEl.rel = 'prefetch';
      linkEl.href = parsed.href;
      document.head.appendChild(linkEl);
    } catch (_) {}
  }

  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a[href]');
    if (a && a.href) prefetch(a.href);
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const a = e.target.closest('a[href]');
    if (a && a.href) prefetch(a.href);
  }, { passive: true });

  // 4. Idle prefetch of portal sibling pages for 0ms transitions
  const runIdlePrefetch = () => {
    document.querySelectorAll('.sidebar-nav .nav-link, .dock-tab').forEach(el => {
      const h = el.getAttribute('href');
      if (h && !h.startsWith('#') && !h.includes('login') && !h.includes('logout')) {
        prefetch(el.href);
      }
    });
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(runIdlePrefetch, { timeout: 2000 });
  } else {
    setTimeout(runIdlePrefetch, 1000);
  }
}

// ─── Initialize Mobile Enhancements ───────────────────────────────────────────
function initMobileEnhancements() {
  if (document.getElementById('mobile-enhancements-script')) return;
  const script = document.createElement('script');
  script.id = 'mobile-enhancements-script';
  script.src = '/js/mobile.js?v=2.9';
  document.head.appendChild(script);
}

// ─── Active Nav Link on Page Load ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  setupSeamlessNavigation();
  initMobileEnhancements();
  setupInstantFeedbackAndPrefetch();
});



