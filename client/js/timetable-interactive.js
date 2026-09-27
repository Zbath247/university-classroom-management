// client/js/timetable-interactive.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Interactive Multi-Class & Dynamic Day Selection Timetable Engine
//          Digital University of Cambodia · DUC Classroom Management
// ─────────────────────────────────────────────────────────────────────────────

(function (window) {
  'use strict';

  const DAYS = [
    { key: 'Monday',    kh: 'ច័ន្ទ',     shortKh: 'ច័ន្ទ',   en: 'Monday',    shortEn: 'Mon' },
    { key: 'Tuesday',   kh: 'អង្គារ',    shortKh: 'អង្គារ',  en: 'Tuesday',   shortEn: 'Tue' },
    { key: 'Wednesday', kh: 'ពុធ',       shortKh: 'ពុធ',     en: 'Wednesday', shortEn: 'Wed' },
    { key: 'Thursday',  kh: 'ព្រហស្បតិ៍', shortKh: 'ព្រហ',   en: 'Thursday',  shortEn: 'Thu' },
    { key: 'Friday',    kh: 'សុក្រ',     shortKh: 'សុក្រ',   en: 'Friday',    shortEn: 'Fri' },
    { key: 'Saturday',  kh: 'សៅរ៍',     shortKh: 'សៅរ៍',   en: 'Saturday',  shortEn: 'Sat' },
    { key: 'Sunday',    kh: 'អាទិត្យ',   shortKh: 'អាទិត្យ', en: 'Sunday',    shortEn: 'Sun' }
  ];

  function getSubjectThemeClass(subjectCode) {
    if (!subjectCode) return 'theme-default';
    const code = subjectCode.toUpperCase();
    if (code.includes('SAD')) return 'theme-sad';
    if (code.includes('ITPM')) return 'theme-itpm';
    if (code.includes('CSC')) return 'theme-csc';
    if (code.includes('CA')) return 'theme-ca';
    return 'theme-default';
  }

  function getMajorDescription(classCode, rawName) {
    if (!classCode) return 'កម្រិតបរិញ្ញាបត្រ · Digital University of Cambodia';
    const code = classCode.toUpperCase();
    if (code.includes('G1-NW-A')) {
      return 'កម្រិតបរិញ្ញាបត្រ ជំនាញ បណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព A';
    }
    if (code.includes('G1-NW-B')) {
      return 'កម្រិតបរិញ្ញាបត្រ ជំនាញ បណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព B';
    }
    if (code.includes('G1-SD-A') || code.includes('SD')) {
      return 'កម្រិតបរិញ្ញាបត្រ ជំនាញ អភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ A';
    }
    return rawName || `កម្រិតបរិញ្ញាបត្រ ថ្នាក់ ${classCode}`;
  }

  function formatTimeDisplay(t) {
    if (!t) return '';
    const parts = t.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    return `${h < 10 ? '0' + h : h}:${m}`;
  }

  class InteractiveTimetable {
    constructor(options = {}) {
      this.role = options.role || 'student'; // 'admin' | 'student' | 'teacher'
      this.containerId = options.containerId || 'timetable-interactive-wrap';
      this.classes = options.classes || [];
      this.allSchedules = options.schedules || [];
      this.selectedClassId = options.defaultClassId || '';
      this.selectedDay = options.defaultDay || '';
      this.onClassChange = options.onClassChange || null;
      this.onDayChange = options.onDayChange || null;
      this.onEditSchedule = options.onEditSchedule || null;
      this.teacherId = options.teacherId || null;

      this.initModal();
    }

    setClasses(classes) {
      this.classes = classes || [];
      if (!this.selectedClassId && this.classes.length > 0) {
        if (this.role !== 'admin') {
          this.selectedClassId = this.classes[0].id;
        }
      }
      this.render();
    }

    setSchedules(schedules) {
      this.allSchedules = schedules || [];
      this.render();
    }

    selectClass(classId) {
      this.selectedClassId = classId ? Number(classId) : '';
      if (this.onClassChange) this.onClassChange(this.selectedClassId);
      this.render();
    }

    selectDay(dayKey, triggerPopup = true) {
      this.selectedDay = dayKey || '';
      if (this.onDayChange) this.onDayChange(this.selectedDay);
      this.render();

      if (triggerPopup && dayKey) {
        this.openDaySchedulePopup(dayKey);
      }
    }

    getFilteredSchedules() {
      let list = [...this.allSchedules];
      if (this.selectedClassId) {
        list = list.filter(s => Number(s.class_id) === Number(this.selectedClassId));
      }
      return list;
    }

    getSelectedClassInfo() {
      if (!this.selectedClassId) {
        if (this.classes.length > 0) {
          // If a class is not specifically selected, find default or first
          return this.classes[0];
        }
        return {
          id: '',
          class_code: 'G1-NW-B',
          class_name: 'G1 Networking & Security B'
        };
      }
      return this.classes.find(c => Number(c.id) === Number(this.selectedClassId)) || {
        id: this.selectedClassId,
        class_code: `Class #${this.selectedClassId}`,
        class_name: ''
      };
    }

    initModal() {
      if (document.getElementById('day-schedule-modal')) return;

      const modalHtml = `
        <div class="modal-backdrop" id="day-schedule-modal" style="display:none; z-index:9999;">
          <div class="modal" style="max-width:580px; width:92%; border-radius:18px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.25);">
            <div class="day-modal-header" style="background:linear-gradient(135deg, #10254a, #1e3a8a); color:#ffffff; padding:1.25rem 1.5rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h3 class="day-modal-title" id="day-modal-heading" style="color:#ffffff; font-size:1.15rem; margin:0; display:flex; align-items:center; gap:8px;">
                  <span>📅</span> <span id="day-modal-day-title">កាលវិភាគប្រចាំថ្ងៃ</span>
                </h3>
                <div id="day-modal-cohort-subtitle" style="font-size:0.85rem; color:#ffd166; margin-top:4px; font-weight:600;"></div>
              </div>
              <button type="button" class="modal-close" style="color:#ffffff; font-size:1.5rem; background:rgba(255,255,255,0.15); border:none; border-radius:50%; width:34px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="window.closeDayScheduleModal()">×</button>
            </div>
            <div class="day-modal-body" id="day-modal-content">
              <!-- Dynamically populated -->
            </div>
            <div class="modal-footer" style="padding:1rem 1.5rem; background:var(--bg-light, #f8fafc); border-top:1px solid var(--border, #e2e8f0); display:flex; justify-content:space-between; align-items:center;">
              <span id="day-modal-summary-text" style="font-size:0.85rem; color:var(--text-muted, #64748b);"></span>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.closeDayScheduleModal()" style="border-radius:20px; padding:6px 18px;">
                យល់ព្រម (OK)
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      window.closeDayScheduleModal = () => {
        const m = document.getElementById('day-schedule-modal');
        if (m) m.classList.remove('active');
        setTimeout(() => { if (m) m.style.display = 'none'; }, 200);
      };

      // Close on backdrop click
      const modalEl = document.getElementById('day-schedule-modal');
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) window.closeDayScheduleModal();
      });
    }

    openDaySchedulePopup(dayKey) {
      const modal = document.getElementById('day-schedule-modal');
      if (!modal) return;

      const dayObj = DAYS.find(d => d.key.toLowerCase() === dayKey.toLowerCase()) || {
        key: dayKey, kh: dayKey, en: dayKey
      };

      const lang = window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km');
      const dayName = lang === 'km' ? `ថ្ងៃ${dayObj.kh}` : dayObj.en;
      
      const filtered = this.getFilteredSchedules();
      const daySlots = filtered.filter(s => (s.day_of_week || '').toLowerCase() === dayObj.key.toLowerCase())
        .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

      const classInfo = this.getSelectedClassInfo();
      const classDisplay = this.selectedClassId ? `ថ្នាក់ ${classInfo.class_code}` : 'ថ្នាក់ទាំងអស់ (All Classes)';

      // Header labels
      document.getElementById('day-modal-day-title').textContent = lang === 'km' 
        ? `កាលវិភាគម៉ោងរៀន · ${dayName}` 
        : `Daily Class Schedule · ${dayName}`;
      document.getElementById('day-modal-cohort-subtitle').textContent = `🏫 ${classDisplay}`;

      const content = document.getElementById('day-modal-content');
      const summary = document.getElementById('day-modal-summary-text');

      if (daySlots.length === 0) {
        summary.textContent = lang === 'km' ? 'គ្មានម៉ោងរៀនទេ' : 'No classes today';
        content.innerHTML = `
          <div class="day-empty-state">
            <div class="day-empty-icon">🌴</div>
            <div class="day-empty-title">
              ${lang === 'km' ? `ថ្ងៃ${dayObj.kh} នេះគ្មានម៉ោងសិក្សាទេ` : `No Classes on ${dayObj.en}`}
            </div>
            <div class="day-empty-desc">
              ${lang === 'km' 
                ? `សម្រាប់${classDisplay} នៅថ្ងៃនេះជាថ្ងៃសម្រាក ឬមិនទាន់មានម៉ោងបង្រៀនត្រូវបានកំណត់នៅក្នុងប្រព័ន្ធឡើយ។`
                : `No active lecture sessions are scheduled for this day (Rest day or unassigned).`}
            </div>
          </div>
        `;
      } else {
        summary.textContent = lang === 'km' 
          ? `មាន ${daySlots.length} ម៉ោងសិក្សា / មុខវិជ្ជា`
          : `${daySlots.length} session(s) scheduled`;

        content.innerHTML = daySlots.map((s, idx) => {
          const startTime = formatTimeDisplay(s.start_time);
          const endTime = formatTimeDisplay(s.end_time);
          const themeClass = getSubjectThemeClass(s.subject_code);
          const teacherName = s.teacher_name || 'TBD';
          const roomName = s.room ? s.room : (lang === 'km' ? 'រង់ចាំកំណត់' : 'TBD');
          const subjectTitle = s.subject_name || s.subject_code;

          return `
            <div class="day-session-card ${themeClass}" style="animation: fadeIn 0.25s ease ${idx * 0.05}s both;">
              <div class="session-header-row">
                <div class="session-time-badge">
                  <span>⏰</span> ${startTime} - ${endTime}
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                  <span class="session-room-badge">
                    <span>🏛️</span> ${roomName}
                  </span>
                  <span class="badge badge-purple" style="font-size:0.75rem;">${s.class_code}</span>
                </div>
              </div>
              <div class="session-subject-title">
                <span class="session-subject-code">${s.subject_code}</span>
                ${subjectTitle}
              </div>
              <div class="session-meta-grid">
                <div class="session-meta-item">
                  <span>👨‍🏫</span> <span>សាស្ត្រាចារ្យ: <strong>${teacherName}</strong></span>
                </div>
                <div class="session-meta-item">
                  <span>⭐</span> <span>ក្រេឌីត: <strong>${s.credits || 3} Credits</strong></span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);
    }

    render() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      const lang = window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('duc_lang') || 'km');
      const filtered = this.getFilteredSchedules();
      const classInfo = this.getSelectedClassInfo();

      // Count classes per day for this cohort
      const dayCounts = {};
      DAYS.forEach(d => { dayCounts[d.key.toLowerCase()] = 0; });
      filtered.forEach(s => {
        const k = (s.day_of_week || '').toLowerCase();
        if (dayCounts[k] !== undefined) dayCounts[k]++;
      });

      // Distinct Time Slots
      const slotMap = new Map();
      filtered.forEach(s => {
        if (!s.start_time || !s.end_time) return;
        const key = `${formatTimeDisplay(s.start_time)} - ${formatTimeDisplay(s.end_time)}`;
        if (!slotMap.has(key)) {
          slotMap.set(key, { start: s.start_time, end: s.end_time, label: key });
        }
      });

      // Default Standard DUC Slots if empty
      if (slotMap.size === 0) {
        slotMap.set('08:00 - 11:00', { start: '08:00:00', end: '11:00:00', label: '8:00 - 11:00' });
        slotMap.set('13:00 - 15:00', { start: '13:00:00', end: '15:00:00', label: '13:00 - 15:00' });
        slotMap.set('15:00 - 16:30', { start: '15:00:00', end: '16:30:00', label: '15:00 - 16:30' });
      }

      const sortedSlots = Array.from(slotMap.values()).sort((a, b) => (a.start || '').localeCompare(b.start || ''));

      // Unique subjects for legend
      const legendMap = new Map();
      filtered.forEach(s => {
        if (s.subject_code && !legendMap.has(s.subject_code)) {
          legendMap.set(s.subject_code, {
            code: s.subject_code,
            name: s.subject_name,
            teacher: s.teacher_name
          });
        }
      });

      const majorTitle = getMajorDescription(classInfo.class_code, classInfo.class_name);

      let html = `
        <div class="timetable-interactive-container">
          
          <!-- 1. Class Selector Tabs Bar -->
          <div class="timetable-class-bar">
            <div class="timetable-bar-label">
              <span class="bar-icon">🏫</span>
              <span>${lang === 'km' ? 'ជ្រើសរើសថ្នាក់សិក្សា (Select Class Cohort):' : 'Select Class Cohort:'}</span>
            </div>
            <div class="timetable-pill-scroll">
              ${this.role === 'admin' ? `
                <button type="button" class="class-pill-btn ${!this.selectedClassId ? 'active' : ''}" onclick="window.ducTimetable.selectClass('')">
                  <span>🌐</span>
                  <span>${lang === 'km' ? 'ថ្នាក់ទាំងអស់ (All Classes)' : 'All Classes'}</span>
                  <span class="pill-badge">${this.allSchedules.length}</span>
                </button>
              ` : ''}
              ${this.classes.map(c => {
                const isActive = Number(c.id) === Number(this.selectedClassId);
                const count = this.allSchedules.filter(s => Number(s.class_id) === Number(c.id)).length;
                return `
                  <button type="button" class="class-pill-btn ${isActive ? 'active' : ''}" onclick="window.ducTimetable.selectClass(${c.id})">
                    <span>🎓</span>
                    <span>ថ្នាក់ ${c.class_code}</span>
                    <span class="pill-badge">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 2. Interactive Day Selector Tabs Bar ("ចុចតាមហើយចំថ្ងៃណាមានម៉ោងរៀនគឺលោតមក") -->
          <div class="timetable-day-bar">
            <div class="timetable-bar-label">
              <span class="bar-icon">📅</span>
              <span>${lang === 'km' ? 'ជ្រើសរើសថ្ងៃសិក្សា (ចុចដើម្បីមើលម៉ោងរៀន):' : 'Select Day (Click to view hours):'}</span>
            </div>
            <div class="timetable-pill-scroll">
              <button type="button" class="day-pill-btn ${!this.selectedDay ? 'active' : ''}" onclick="window.ducTimetable.selectDay('', false)">
                <span>🗓️</span>
                <span>${lang === 'km' ? 'ទាំងអស់ (All)' : 'All Days'}</span>
              </button>
              ${DAYS.map(d => {
                const count = dayCounts[d.key.toLowerCase()] || 0;
                const isActive = (this.selectedDay || '').toLowerCase() === d.key.toLowerCase();
                const hasClasses = count > 0;
                return `
                  <button type="button" class="day-pill-btn ${isActive ? 'active' : ''} ${hasClasses ? 'has-classes' : ''}" onclick="window.ducTimetable.selectDay('${d.key}', true)">
                    <span>${lang === 'km' ? d.kh : d.shortEn}</span>
                    <span class="day-badge">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. Official DUC Timetable Document Card -->
          <div class="card official-schedule-card" style="border-top: 4px solid var(--primary, #1e40af); box-shadow:0 8px 24px rgba(0,0,0,0.06);">
            <div class="card-body" style="padding:1.75rem 2rem;">
              
              <!-- Document Header (Kingdom & University) -->
              <div class="doc-header-wrap">
                <div class="doc-header-gov">
                  <div class="doc-gov-title" data-i18n="gov.cambodia">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div class="doc-gov-motto" data-i18n="gov.motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                </div>
                <div class="doc-header-univ">
                  <div class="doc-univ-title" data-i18n="univ.name">សាកលវិទ្យាល័យឌីជីថលកម្ពុជា</div>
                  <div class="doc-univ-sub" data-i18n="univ.sub">Digital University of Cambodia</div>
                  <div class="doc-univ-office" data-i18n="univ.academic_office">ការិយាល័យសិក្សា</div>
                </div>
              </div>

              <!-- Document Title & Cohort -->
              <div class="doc-title-wrap" style="text-align:center; margin:1.5rem 0 1.25rem;">
                <h2 class="doc-main-title" style="font-family:var(--font-moul); color:#10254a; font-size:1.2rem; font-weight:normal; margin-bottom:6px; letter-spacing:normal;">
                  កាលវិភាគសិក្សា ឆ្នាំទី៤ ឆមាសទី១ ជំនាន់ទី១
                </h2>
                <div style="font-family:var(--font-battambang); font-weight:700; color:var(--text-dark, #1e293b); font-size:0.98rem; margin-bottom:4px;">
                  ${majorTitle}
                </div>
                <div style="font-family:var(--font-battambang); color:var(--text-muted, #64748b); font-size:0.88rem;">
                  ចាប់ផ្ដើមពីថ្ងៃទី៤ ខែកញ្ញា ឆ្នាំ២០២៦ បញ្ចប់ថ្ងៃទី២៧ ខែធ្នូ ឆ្នាំ២០២៦
                </div>
                <div style="margin-top:10px;">
                  <span class="badge badge-primary" style="font-size:0.95rem; padding:6px 20px; font-weight:700; letter-spacing:0.5px;">
                    ${this.selectedClassId ? `ថ្នាក់ ${classInfo.class_code}` : 'ថ្នាក់ទាំងអស់ (All Cohorts)'}
                  </span>
                </div>
              </div>

              <!-- Official Weekly Matrix Grid Table -->
              <div class="table-responsive" style="margin-top:1rem; border:1px solid #cbd5e1; border-radius:10px; overflow-x:auto;">
                <table class="table matrix-interactive-table" style="margin:0; text-align:center; border-collapse:collapse; width:100%; min-width:700px;">
                  <thead>
                    <tr style="background:#10254a; color:#ffffff;">
                      <th style="padding:12px; border:1px solid #1e3a8a; width:130px;" data-i18n="table.time_day">Time \\ Day</th>
                      ${DAYS.map(d => {
                        const isColActive = (this.selectedDay || '').toLowerCase() === d.key.toLowerCase();
                        const count = dayCounts[d.key.toLowerCase()] || 0;
                        const headerBg = count > 0 ? '#1e40af' : '#10254a';
                        const headerColor = count > 0 ? '#ffd166' : '#ffffff';
                        return `
                          <th class="day-th-interactive ${isColActive ? 'active-day-col' : ''}" 
                              style="padding:12px 6px; border:1px solid #1e3a8a; background:${headerBg}; color:${headerColor};"
                              title="${lang === 'km' ? 'ចុចដើម្បីមើលម៉ោងរៀនថ្ងៃ' + d.kh : 'Click to view ' + d.en + ' schedule'}"
                              onclick="window.ducTimetable.selectDay('${d.key}', true)">
                            <div>${lang === 'km' ? d.kh : d.en}</div>
                            ${count > 0 ? `<div style="font-size:0.68rem; opacity:0.9; margin-top:2px;">(${count})</div>` : ''}
                          </th>
                        `;
                      }).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${sortedSlots.map(slot => {
                      return `
                        <tr>
                          <td style="font-weight:700; background:var(--bg-light, #f8fafc); border:1px solid #cbd5e1; padding:12px 8px; font-size:0.88rem;">
                            ${slot.label}
                          </td>
                          ${DAYS.map(d => {
                            const isColActive = (this.selectedDay || '').toLowerCase() === d.key.toLowerCase();
                            // Find schedules matching this day and approximate time
                            const matchingSlots = filtered.filter(s => {
                              if ((s.day_of_week || '').toLowerCase() !== d.key.toLowerCase()) return false;
                              const sStart = formatTimeDisplay(s.start_time);
                              const slotStart = slot.label.split(' - ')[0].trim();
                              return sStart === slotStart || (s.start_time >= slot.start && s.start_time < slot.end);
                            });

                            if (matchingSlots.length === 0) {
                              return `
                                <td class="${isColActive ? 'col-highlight' : ''}" 
                                    style="color:#94a3b8; border:1px solid #cbd5e1; cursor:pointer;"
                                    onclick="window.ducTimetable.selectDay('${d.key}', true)"
                                    title="${lang === 'km' ? 'ចុចដើម្បីមើលម៉ោងរៀនថ្ងៃ' + d.kh : 'Click to view ' + d.en + ' schedule'}">
                                  ✕
                                </td>
                              `;
                            }

                            return `
                              <td class="${isColActive ? 'col-highlight' : ''}" style="border:1px solid #cbd5e1; padding:6px;">
                                ${matchingSlots.map(s => {
                                  const theme = getSubjectThemeClass(s.subject_code);
                                  const room = s.room ? s.room : 'DUC';
                                  const startTime = formatTimeDisplay(s.start_time);
                                  const endTime = formatTimeDisplay(s.end_time);
                                  return `
                                    <div class="timetable-slot-card ${theme}" 
                                         onclick="window.ducTimetable.selectDay('${d.key}', true)"
                                         title="${s.subject_name || s.subject_code} · ${s.teacher_name || ''}">
                                      <div class="slot-code">${s.subject_code} (${room})</div>
                                      <div class="slot-time">${startTime} - ${endTime}</div>
                                    </div>
                                  `;
                                }).join('')}
                              </td>
                            `;
                          }).join('')}
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Document Footer / Subject & Exam Notes -->
              <div class="doc-footer-notes" style="margin-top:1.5rem; padding:1.25rem; background:var(--bg-light, #f8fafc); border-radius:10px; border-left:4px solid #f59e0b;">
                <div style="font-family:var(--font-battambang); font-weight:700; color:#b45309; font-size:0.92rem; margin-bottom:8px; line-height:1.5;">
                  ⚠️ បញ្ជាក់៖ ការប្រឡងពាក់កណ្ដាលឆមាសចាប់ផ្ដើមពីថ្ងៃទី២៦ ខែតុលា ឆ្នាំ២០២៦ ដល់ថ្ងៃទី១ ខែវិច្ឆិកា ឆ្នាំ២០២៦
                </div>
                <div style="font-family:var(--font-battambang); font-weight:700; color:var(--text-dark, #334155); font-size:0.9rem; margin-bottom:8px;">
                  មុខវិជ្ជាដែលត្រូវសិក្សារួមមាន៖
                </div>
                <div class="doc-subjects-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:10px; font-family:var(--font-battambang); font-size:0.88rem; color:var(--text-body, #475569);">
                  ${legendMap.size > 0 ? Array.from(legendMap.values()).map(sub => {
                    const theme = getSubjectThemeClass(sub.code);
                    let color = '#1e40af';
                    if (theme === 'theme-itpm') color = '#15803d';
                    if (theme === 'theme-csc') color = '#7e22ce';
                    if (theme === 'theme-ca') color = '#b45309';
                    return `
                      <div>
                        <strong style="color:${color};">[${sub.code}]</strong> = ${sub.name || sub.code} · 
                        <span style="color:#1e40af; font-weight:600;">${sub.teacher || 'លោកគ្រូ'}</span>
                      </div>
                    `;
                  }).join('') : `
                    <div><strong>[SAD]</strong> = System Analyze and Design · <span style="color:#1e40af; font-weight:600;">លោកគ្រូ ឈាង វុទ្ធី</span></div>
                    <div><strong>[ITPM]</strong> = IT Project Management · <span style="color:#1e40af; font-weight:600;">លោកគ្រូ សែម វ៉ាវី</span></div>
                    <div><strong>[CSC.V]</strong> = Cisco V · <span style="color:#1e40af; font-weight:600;">លោកគ្រូ សែម វ៉ាវី</span></div>
                    <div><strong>[CA]</strong> = Cloud Architecture · <span style="color:#1e40af; font-weight:600;">លោកគ្រូ គឿន មេសា</span></div>
                  `}
                </div>
              </div>

            </div>
          </div>

        </div>
      `;

      container.innerHTML = html;
      if (window.I18n) window.I18n.autoTranslate(container);
    }
  }

  window.InteractiveTimetable = InteractiveTimetable;

})(window);
