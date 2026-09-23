// client/js/admin.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Shared JavaScript logic for Admin management pages.
// Handles API calls, table rendering, modal controls, and CRUD operations.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Modal Helpers ────────────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Auto-focus first input for quick typing
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled])');
      if (firstInput) firstInput.focus();
    }, 120);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // Reset form inside modal if present
    const form = modal.querySelector('form');
    if (form) form.reset();
    const hiddenId = modal.querySelector('input[type="hidden"]');
    if (hiddenId) hiddenId.value = '';
    const title = modal.querySelector('.modal-title');
    if (title && modal.dataset.defaultTitle) {
      title.textContent = modal.dataset.defaultTitle;
    }
  }
}

// Ensure clicks inside the modal card never bubble or trigger accidental closing
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
});

// ─── Dropdown Options Loaders ─────────────────────────────────────────────────
async function loadClassDropdowns(selectIds = ['class_id']) {
  try {
    const res = await api.get('/classes');
    if (res.success && res.data) {
      selectIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = el.value;
        const defaultText = window.I18n ? window.I18n.t('filter.select_class') : '-- Select Class --';
        el.innerHTML = `<option value="" data-i18n="filter.select_class">${defaultText}</option>`;
        res.data.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = `${c.class_code} (${c.class_name})`;
          el.appendChild(opt);
        });
        if (currentVal) el.value = currentVal;
      });
    }
  } catch (err) {
    console.error('Failed to load classes dropdown:', err);
  }
}

async function loadSubjectDropdowns(selectIds = ['subject_id']) {
  try {
    const res = await api.get('/subjects');
    if (res.success && res.data) {
      selectIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = el.value;
        const defaultText = window.I18n ? window.I18n.t('filter.select_subject') : '-- Select Subject --';
        el.innerHTML = `<option value="" data-i18n="filter.select_subject">${defaultText}</option>`;
        res.data.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = `${s.subject_code} - ${s.subject_name}`;
          el.appendChild(opt);
        });
        if (currentVal) el.value = currentVal;
      });
    }
  } catch (err) {
    console.error('Failed to load subjects dropdown:', err);
  }
}

async function loadTeacherDropdowns(selectIds = ['teacher_id']) {
  try {
    const res = await api.get('/teachers');
    if (res.success && res.data) {
      selectIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = el.value;
        const defaultText = window.I18n ? window.I18n.t('filter.select_teacher') : '-- Select Teacher --';
        el.innerHTML = `<option value="" data-i18n="filter.select_teacher">${defaultText}</option>`;
        res.data.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = `${t.full_name} (${t.department || t.teacher_id})`;
          el.appendChild(opt);
        });
        if (currentVal) el.value = currentVal;
      });
    }
  } catch (err) {
    console.error('Failed to load teachers dropdown:', err);
  }
}

// ─── Format Date Utility ──────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5); // '08:00:00' -> '08:00'
}
