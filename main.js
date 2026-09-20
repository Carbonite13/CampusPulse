/* ═══════════════════════════════════════════════════════════
   CampusPulse — Event Inquiry · Form Validation
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Validation rules ────────────────────────────────────────
const RULES = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_.\-]+$/,
    messages: {
      required:  'Username is required',
      minLength: 'At least 3 characters',
      maxLength: 'Max 32 characters',
      pattern:   'Only letters, numbers, _, . and - allowed',
    },
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    messages: {
      required: 'Email address is required',
      pattern:  'Enter a valid email address',
    },
  },
  inquiryType: {
    required: true,
    messages: { required: 'Please select a category' },
  },
  desc: {
    required: true,
    minLength: 20,
    maxLength: 1000,
    messages: {
      required:  'Description is required',
      minLength: 'Please write at least 20 characters',
      maxLength: 'Maximum 1000 characters exceeded',
    },
  },
};

// ── DOM references ──────────────────────────────────────────
const form          = document.getElementById('inquiryForm');
const successOverlay = document.getElementById('successOverlay');
const closeSuccess  = document.getElementById('closeSuccess');
const tooltipBubble = document.getElementById('tooltipBubble');
const charCountEl   = document.getElementById('charCount');
const textarea      = document.getElementById('desc');

// ── Tooltip ─────────────────────────────────────────────────
let tooltipTimeout = null;

function showTooltip(anchorEl, message) {
  clearTimeout(tooltipTimeout);
  const rect = anchorEl.getBoundingClientRect();
  tooltipBubble.textContent = message;
  tooltipBubble.removeAttribute('aria-hidden');

  // Position below the input
  tooltipBubble.style.left = `${rect.left + window.scrollX}px`;
  tooltipBubble.style.top  = `${rect.bottom + window.scrollY + 8}px`;
  tooltipBubble.classList.add('show');

  tooltipTimeout = setTimeout(hideTooltip, 3200);
}

function hideTooltip() {
  tooltipBubble.classList.remove('show');
  tooltipBubble.setAttribute('aria-hidden', 'true');
}

// ── Field validation ─────────────────────────────────────────
/**
 * Validates a single field.
 * @param {HTMLElement} el - The input/select/textarea element
 * @returns {string|null} error message or null if valid
 */
function validateField(el) {
  const id    = el.id;
  const rule  = RULES[id];
  if (!rule) return null;

  const raw   = el.value;
  const val   = typeof raw === 'string' ? raw.trim() : raw;

  if (rule.required && !val) return rule.messages.required;
  if (!val) return null; // optional field, skip further checks

  if (rule.minLength && val.length < rule.minLength) return rule.messages.minLength;
  if (rule.maxLength && val.length > rule.maxLength)  return rule.messages.maxLength;
  if (rule.pattern   && !rule.pattern.test(val))      return rule.messages.pattern;

  return null;
}

// ── Apply / clear error state ────────────────────────────────
function setError(fieldId, message) {
  const group   = document.getElementById(`group-${fieldId}`);
  const errEl   = document.getElementById(`err-${fieldId}`);
  const inputEl = document.getElementById(fieldId);

  if (!group || !errEl || !inputEl) return;

  group.classList.add('has-error');
  group.classList.remove('has-success');
  errEl.textContent = message;
  errEl.classList.add('visible');
  inputEl.setAttribute('aria-invalid', 'true');

  showTooltip(inputEl, message);
}

function clearError(fieldId) {
  const group   = document.getElementById(`group-${fieldId}`);
  const errEl   = document.getElementById(`err-${fieldId}`);
  const inputEl = document.getElementById(fieldId);

  if (!group || !errEl || !inputEl) return;

  group.classList.remove('has-error');
  group.classList.add('has-success');
  errEl.textContent = '';
  errEl.classList.remove('visible');
  inputEl.removeAttribute('aria-invalid');
}

// ── Char counter ─────────────────────────────────────────────
function updateCharCount() {
  const len = textarea.value.length;
  const max = 1000;
  charCountEl.textContent = `${len} / ${max}`;
  charCountEl.className = 'char-count';

  if (len >= max)              charCountEl.classList.add('limit');
  else if (len >= max * 0.85)  charCountEl.classList.add('warn');
}

// ── Blur validation (per field) ──────────────────────────────
function handleBlur(e) {
  const el  = e.target;
  const id  = el.id;
  if (!RULES[id]) return;

  const err = validateField(el);
  if (err) setError(id, err);
  else     clearError(id);
}

// ── Input validation (clear error on typing) ─────────────────
function handleInput(e) {
  const el  = e.target;
  const id  = el.id;
  if (!RULES[id]) return;

  // If field had an error, re-validate live; otherwise just clear
  const group = document.getElementById(`group-${id}`);
  if (group && group.classList.contains('has-error')) {
    const err = validateField(el);
    if (err) setError(id, err);
    else     clearError(id);
  }

  if (id === 'desc') updateCharCount();
}

// ── Full-form validation on submit ───────────────────────────
function validateAll() {
  const fields = ['username', 'email', 'inquiryType', 'desc'];
  let firstErrorId = null;

  fields.forEach(id => {
    const el  = document.getElementById(id);
    const err = validateField(el);
    if (err) {
      setError(id, err);
      if (!firstErrorId) firstErrorId = id;
    } else {
      clearError(id);
    }
  });

  if (firstErrorId) {
    // Focus first invalid field and show its tooltip
    const firstEl = document.getElementById(firstErrorId);
    firstEl.focus({ preventScroll: false });
    firstEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  }

  return true;
}

// ── Submit handler ───────────────────────────────────────────
form.addEventListener('submit', function (e) {
  e.preventDefault();
  hideTooltip();

  if (!validateAll()) return;

  // ─ All valid → show success popup ─
  successOverlay.hidden = false;
  successOverlay.focus();
});

// ── Close success popup ──────────────────────────────────────
closeSuccess.addEventListener('click', function () {
  successOverlay.hidden = true;
  form.reset();
  updateCharCount();

  // Clear all success states
  ['username', 'email', 'inquiryType', 'desc'].forEach(id => {
    const group = document.getElementById(`group-${id}`);
    if (group) group.classList.remove('has-success', 'has-error');
  });

  document.getElementById('username').focus();
});

// Close overlay by clicking backdrop
successOverlay.addEventListener('click', function (e) {
  if (e.target === successOverlay) closeSuccess.click();
});

// Close overlay with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !successOverlay.hidden) closeSuccess.click();
});

// ── Attach listeners ─────────────────────────────────────────
form.addEventListener('blur',  handleBlur,  true);   // capture phase for all fields
form.addEventListener('input', handleInput, true);

// Initial char count
updateCharCount();
