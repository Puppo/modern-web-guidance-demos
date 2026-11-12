const storageKey = 'mwg-preferences-v1';
const defaults = { version: 1, profile: { displayName: 'Jamie Morgan', bio: 'Curious by nature. Usually out for a walk.' }, emailNotifications: false, productUpdates: false };
const preferencesForm = document.querySelector('#preferences-form');
const dialog = document.querySelector('#profile-dialog');
const profileForm = document.querySelector('#profile-form');
const nameInput = document.querySelector('#display-name');
const bioInput = document.querySelector('#bio');
const nameError = document.querySelector('#name-error');
const warning = document.querySelector('#storage-warning');
const status = document.querySelector('#save-status');
const schemeMeta = document.querySelector('meta[name="color-scheme"]');
const systemScheme = matchMedia('(prefers-color-scheme: dark)');
let announcementTimer;
let pendingProfileMessage = '';
let preferencesDirty = false;

function warn(message) {
  warning.textContent = message;
  warning.hidden = !message;
}

function announce(message) {
  clearTimeout(announcementTimer);
  status.textContent = '';
  announcementTimer = setTimeout(() => { status.textContent = message; }, 100);
}

function normalize(value) {
  if (!value || value.version !== 1 || typeof value.profile?.displayName !== 'string' ||
      !value.profile.displayName.trim() || value.profile.displayName.length > 60 ||
      typeof value.profile.bio !== 'string' || value.profile.bio.length > 240 ||
      typeof value.emailNotifications !== 'boolean' || typeof value.productUpdates !== 'boolean' ||
      (value.theme !== undefined && !['light', 'dark'].includes(value.theme))) {
    throw new Error('Invalid saved preferences');
  }
  return { version: 1, profile: { displayName: value.profile.displayName.trim(), bio: value.profile.bio },
    emailNotifications: value.emailNotifications, productUpdates: value.productUpdates,
    ...(value.theme ? { theme: value.theme } : {}) };
}

function readSaved() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw === null ? structuredClone(defaults) : normalize(JSON.parse(raw));
  } catch {
    warn('Saved preferences could not be read. Defaults are shown; saving will try to replace them.');
    return structuredClone(defaults);
  }
}

let saved = readSaved();

function persist(next, subject) {
  saved = next;
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    warn('');
    return `${subject} saved on this device.`;
  } catch {
    warn('Storage is unavailable. Changes apply to this session only and may be lost when you reload.');
    return `${subject} applied for this session, but could not be saved on this device.`;
  }
}

function applyTheme(theme) {
  schemeMeta.content = ['light', 'dark'].includes(theme) ? theme : 'light dark';
}

function renderProfile() {
  document.querySelector('#profile-name').textContent = saved.profile.displayName;
  document.querySelector('#profile-bio').textContent = saved.profile.bio || 'A little mystery. No bio yet.';
  document.querySelector('#avatar').textContent = saved.profile.displayName.split(/\s+/u).slice(0, 2).map(part => [...part][0]).join('').toLocaleUpperCase();
}

function draftPreferences() {
  const data = new FormData(preferencesForm);
  return { theme: data.get('theme'), emailNotifications: data.has('emailNotifications'), productUpdates: data.has('productUpdates') };
}

function updateDirty() {
  const draft = draftPreferences();
  preferencesDirty = draft.theme !== (saved.theme ?? 'system') || draft.emailNotifications !== saved.emailNotifications || draft.productUpdates !== saved.productUpdates;
  document.querySelector('#dirty-state').textContent = preferencesDirty ? 'You have unsaved changes.' : "You're all set.";
  document.querySelector('#reset-preferences').disabled = !preferencesDirty;
}

function renderPreferences() {
  preferencesForm.elements.theme.value = saved.theme ?? 'system';
  preferencesForm.elements.emailNotifications.checked = saved.emailNotifications;
  preferencesForm.elements.productUpdates.checked = saved.productUpdates;
  applyTheme(saved.theme);
  updateDirty();
}

function updateSystemLabel() {
  document.querySelector('#system-current').textContent = `Currently ${systemScheme.matches ? 'dark' : 'light'}`;
}

preferencesForm.addEventListener('change', () => {
  applyTheme(draftPreferences().theme);
  clearTimeout(announcementTimer);
  status.textContent = '';
  updateDirty();
});

preferencesForm.addEventListener('submit', event => {
  event.preventDefault();
  const draft = draftPreferences();
  const next = { ...saved, emailNotifications: draft.emailNotifications, productUpdates: draft.productUpdates };
  // Absence of an override means system; do not pin it to today's OS preference.
  delete next.theme;
  if (draft.theme !== 'system') next.theme = draft.theme;
  announce(persist(next, 'Preferences'));
  updateDirty();
});

document.querySelector('#reset-preferences').addEventListener('click', () => {
  renderPreferences();
  announce('Unsaved preferences discarded.');
});

function clearNameError() {
  nameError.textContent = '';
  nameInput.removeAttribute('aria-invalid');
}

nameInput.addEventListener('invalid', event => {
  event.preventDefault();
  nameError.textContent = 'Enter a display name with at least one non-space character.';
  nameInput.setAttribute('aria-invalid', 'true');
  nameInput.focus();
});
nameInput.addEventListener('input', () => {
  if (nameInput.validity.valid) clearNameError();
});

document.querySelector('#edit-profile').addEventListener('click', () => {
  clearTimeout(announcementTimer);
  status.textContent = '';
  nameInput.value = saved.profile.displayName;
  bioInput.value = saved.profile.bio;
  clearNameError();
  dialog.returnValue = '';
  dialog.showModal();
});

profileForm.addEventListener('submit', event => {
  if (event.submitter?.value === 'cancel') return; // Native method=dialog; no validation on Cancel.
  event.preventDefault();
  const next = { ...saved, profile: { displayName: nameInput.value.trim(), bio: bioInput.value.trim() } };
  pendingProfileMessage = persist(next, 'Profile');
  renderProfile();
  dialog.close('saved');
});

dialog.addEventListener('close', () => {
  const wasSaved = dialog.returnValue === 'saved';
  dialog.returnValue = ''; // Escape must never inherit a previous save result.
  profileForm.reset();
  clearNameError();
  if (wasSaved) announce(pendingProfileMessage); // The background is no longer inert.
  pendingProfileMessage = '';
});

// Light dismiss is an enhancement. Older browsers keep Cancel and Escape.
// No manual focus trap, inert toggling, or Escape handler: showModal owns those.
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  if (preferencesDirty || dialog.open) {
    announce('Preferences changed in another tab. Reload to load them; saving here will replace them.');
    return;
  }
  saved = readSaved();
  renderProfile();
  renderPreferences();
  announce('Preferences updated from another tab.');
});

systemScheme.addEventListener('change', updateSystemLabel);
renderProfile();
renderPreferences();
updateSystemLabel();
document.querySelector('#edit-profile').disabled = false;
document.querySelector('#save-preferences').disabled = false;
