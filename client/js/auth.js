// client/js/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Handles the login form submission and redirects based on user role.
//
// STATUS: FULLY IMPLEMENTED (Phase 3 Complete).
//         - Login form UI connected to /api/auth/login
//         - JWT token stored in localStorage
//         - Automatic redirection based on role (admin, teacher, student)
//
// HOW LOGIN FLOW WILL WORK (Phase 3):
//   1. User enters username + password
//   2. This script sends POST /api/auth/login
//   3. Server checks credentials, returns a JWT token + user info
//   4. We save the token in localStorage
//   5. We redirect to the correct dashboard based on role:
//      - admin   → /admin/dashboard.html
//      - teacher → /teacher/dashboard.html
//      - student → /student/dashboard.html
// ─────────────────────────────────────────────────────────────────────────────

// ─── Toast Notification System ────────────────────────────────────────────────
/**
 * Show a toast notification (popup message).
 * @param {string} message - Text to display
 * @param {'success'|'error'|'warning'|'info'} type - Visual style
 * @param {number} duration - How long to show (ms)
 */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: window.AppIcons ? window.AppIcons.get('check-circle', { size: 18, color: '#10b981' }) : '✅',
    error:   window.AppIcons ? window.AppIcons.get('x-circle', { size: 18, color: '#ef4444' }) : '❌',
    warning: window.AppIcons ? window.AppIcons.get('alert-triangle', { size: 18, color: '#f59e0b' }) : '⚠️',
    info:    window.AppIcons ? window.AppIcons.get('info', { size: 18, color: '#3b82f6' }) : 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Route Guard ──────────────────────────────────────────────────────────────
/**
 * Check if the user is authenticated. Redirect to login if not.
 * Call this at the top of every protected dashboard page.
 */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

/**
 * Redirect to appropriate dashboard based on user role.
 */
function redirectToDashboard() {
  const role = getUserRole();
  const routes = {
    admin:   '/admin/dashboard.html',
    teacher: '/teacher/dashboard.html',
    student: '/student/dashboard.html'
  };
  const destination = routes[role] || '/login.html';
  window.location.href = destination;
}

/**
 * Logout the current user.
 * Clears stored data and redirects to login page.
 */
function logout() {
  // Optional: Call the backend to invalidate the token (Phase 3)
  clearAuthData();
  showToast('You have been logged out.', 'info', 2000);
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 800);
}

// ─── Login Form Handler ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return; // Only run on login page

  // If user is already logged in, redirect them to their dashboard
  if (isLoggedIn()) {
    redirectToDashboard();
    return;
  }

  const btnLogin    = document.getElementById('btn-login');
  const inputUser   = document.getElementById('username');
  const inputPass   = document.getElementById('password');
  const errorDiv    = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default page reload

    const username = inputUser.value.trim();
    const password = inputPass.value;

    // ── Frontend Validation ──────────────────────────────────────────────────
    if (!username) {
      showFieldError(inputUser, 'Please enter your username.');
      return;
    }
    if (!password) {
      showFieldError(inputPass, 'Please enter your password.');
      return;
    }

    // ── Show Loading State ───────────────────────────────────────────────────
    setButtonLoading(btnLogin, true);
    hideError(errorDiv);

    try {
      // ── Send Login Request to Backend (Phase 3 will complete this) ─────────
      const result = await api.post('/auth/login', { username, password });

      if (result.success) {
        // Save token and user info
        saveAuthData(result.data.token, result.data.user);
        showToast('Login successful! Redirecting...', 'success', 2000);
        setTimeout(() => redirectToDashboard(), 800);
      }

    } catch (error) {
      // ── Handle Login Errors ──────────────────────────────────────────────
      let message = window.I18n ? window.I18n.t('modal.error_title') : 'Login failed. Please try again.';

      if (error.status === 401) {
        message = window.I18n ? window.I18n.t('login.invalid_credentials') : 'Invalid username or password.';
      } else if (error.status === 503 || (error.message && error.message.toLowerCase().includes('database'))) {
        message = window.I18n ? window.I18n.t('login.db_offline') : 'Database service is currently unreachable. Please try again shortly.';
      } else if (error.status === 403) {
        message = 'Your account has been disabled.';
      } else if (!navigator.onLine) {
        message = 'No internet connection.';
      } else if (error.message) {
        message = error.message;
      }

      showError(errorDiv, message);
      setButtonLoading(btnLogin, false);
    }
  });

  // Clear error when user starts typing again
  [inputUser, inputPass].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      hideError(errorDiv);
    });
  });
});

// ─── UI Helper Functions ──────────────────────────────────────────────────────
function showFieldError(input, message) {
  input.classList.add('error');
  input.focus();
  // Find or create error message element
  let errorEl = input.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('form-error')) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }
  errorEl.textContent = message;
}

function showError(errorDiv, message) {
  if (!errorDiv) return;
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError(errorDiv) {
  if (!errorDiv) return;
  errorDiv.classList.add('hidden');
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    const loadingText = window.I18n ? window.I18n.t('login.logging_in') : 'Signing in...';
    btn.innerHTML = `<span class="spinner"></span> ${loadingText}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || (window.I18n ? window.I18n.t('login.submit_btn') : 'Sign In');
  }
}
