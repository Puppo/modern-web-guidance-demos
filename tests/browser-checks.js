// Run this function in DevTools on a fresh demo page with its storage key removed.
// This changes demo data. Use a dedicated browser profile/context.
async function checkPreferences() {
  const results = [];
  const check = (name, pass) => results.push({ name, pass });
  const $ = selector => document.querySelector(selector);
  const settle = () => new Promise(resolve => setTimeout(resolve, 160));
  const dialog = $('#profile-dialog');
  const edit = $('#edit-profile');
  const open = () => { edit.focus(); edit.click(); };
  const submitProfile = () => $('#profile-form').requestSubmit($('#profile-form button[value="save"]'));
  const cancel = () => $('#profile-form button[value="cancel"]').click();

  open();
  check('Native modal opens with initial focus', dialog.matches(':modal') && document.activeElement === $('#display-name'));
  $('#save-preferences').focus();
  check('Background cannot receive focus', document.activeElement === $('#display-name'));
  for (const value of ['', '   ']) {
    $('#display-name').value = value;
    submitProfile();
    check(`Rejects ${value ? 'whitespace-only' : 'empty'} display name`, dialog.open && $('#display-name').getAttribute('aria-invalid') === 'true');
  }
  cancel(); await settle();
  check('Cancel bypasses validation and returns focus', !dialog.open && document.activeElement === edit);

  open();
  $('#display-name').value = 'Taylor Example';
  $('#display-name').dispatchEvent(new Event('input', { bubbles: true }));
  $('#bio').value = '<b>Plain text</b>';
  submitProfile(); await settle();
  check('Profile updated as text, not HTML', $('#profile-name').textContent === 'Taylor Example' && $('#profile-bio').textContent === '<b>Plain text</b>' && !$('#profile-bio b'));
  check('Profile persisted', JSON.parse(localStorage.getItem('mwg-modernization-v1')).profile.displayName === 'Taylor Example');
  check('Save announced after modal closes', !dialog.open && $('#save-status').textContent === 'Profile saved on this device.');
  open(); $('#display-name').value = 'Discard me'; cancel(); await settle();
  check('Cancellation leaves saved profile intact', $('#profile-name').textContent === 'Taylor Example');
  open(); check('Reopening restores saved values', $('#display-name').value === 'Taylor Example'); cancel(); await settle();

  $('#theme-dark').click();
  check('Theme preview does not persist', $('meta[name="color-scheme"]').content === 'dark' && !JSON.parse(localStorage.getItem('mwg-modernization-v1')).theme);
  open(); $('#bio').value = 'Profile-only change'; submitProfile(); await settle();
  check('Profile save does not persist draft theme', !JSON.parse(localStorage.getItem('mwg-modernization-v1')).theme);
  $('#reset-preferences').click();
  check('Discard restores system theme', $('meta[name="color-scheme"]').content === 'light dark');
  $('#theme-dark').click(); $('#email-notifications').click(); $('#preferences-form').requestSubmit(); await settle();
  const saved = JSON.parse(localStorage.getItem('mwg-modernization-v1'));
  check('Theme and independent notification settings persist', saved.theme === 'dark' && saved.emailNotifications && !saved.productUpdates);
  $('#theme-system').click(); $('#preferences-form').requestSubmit(); await settle();
  check('System preference removes stored override', !Object.hasOwn(JSON.parse(localStorage.getItem('mwg-modernization-v1')), 'theme'));

  const setItem = Storage.prototype.setItem;
  try {
    Storage.prototype.setItem = function () { throw new DOMException('Blocked for test', 'SecurityError'); };
    $('#theme-light').click(); $('#preferences-form').requestSubmit(); await settle();
    check('Storage failure keeps UI usable and reports failure', $('meta[name="color-scheme"]').content === 'light' && !$('#storage-warning').hidden && $('#save-status').textContent.includes('could not be saved'));
  } finally { Storage.prototype.setItem = setItem; }
  $('#preferences-form').requestSubmit(); await settle();
  check('Saving recovers after storage becomes available', $('#storage-warning').hidden && $('#save-status').textContent === 'Preferences saved on this device.');

  open(); $('#display-name').value = 'W'.repeat(60); $('#bio').value = 'W'.repeat(240); submitProfile(); await settle();
  check('Long profile content causes no horizontal overflow', document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  check('No animation at reduced motion or default', document.getAnimations().length === 0);
  return { userAgent: navigator.userAgent, viewport: [innerWidth, innerHeight], results };
}
