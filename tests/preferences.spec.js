import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const key = 'mwg-modernization-v1';
const openProfile = page => page.getByRole('button', { name: 'Edit profile' }).click();
const savePreferences = page => page.getByRole('button', { name: 'Save preferences' }).click();
const scheme = page => page.locator('meta[name="color-scheme"]');
// WebKit on macOS uses Option+Tab to include buttons and links in traversal.
const nextTab = browserName => browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('existing 19 interaction checks pass in a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const source = await readFile(new URL('./browser-checks.js', import.meta.url), 'utf8');
  const result = await page.evaluate(source + '\ncheckPreferences()');
  expect(result.results.filter(check => !check.pass)).toEqual([]);
});

test('keyboard opens, traverses, cancels and restores focus', async ({ page, browserName }) => {
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByRole('button', { name: 'Edit profile' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Display name', { exact: false })).toBeFocused();
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByLabel('Bio', { exact: false })).toBeFocused();
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByRole('button', { name: 'Save profile' })).toBeFocused();
  // A native dialog may allow focus into browser chrome, but never background controls.
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press(nextTab(browserName));
    expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('dialog'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit profile' })).toBeFocused();
});

test('radio arrows and checkbox space retain native behavior', async ({ page, browserName }) => {
  await page.keyboard.press(nextTab(browserName));
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
  await page.keyboard.press(nextTab(browserName));
  await expect(page.getByRole('checkbox', { name: 'Email notifications', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox', { name: 'Email notifications', exact: true })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product updates', exact: true })).not.toBeChecked();
});

test('outside dismissal is optional and discards draft when supported', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Display name', { exact: false }).fill('Unsaved draft');
  const supported = await page.evaluate(() => 'closedBy' in HTMLDialogElement.prototype);
  await page.mouse.click(2, 2);
  if (supported) await expect(page.getByRole('dialog')).not.toBeVisible();
  else {
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  }
  await expect(page.locator('#profile-name')).toHaveText('Your profile');
});

test('profile and preferences survive reload', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Display name', { exact: false }).fill('Alex Chen');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await page.getByRole('radio', { name: 'Dark', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Product updates', exact: true }).check();
  await savePreferences(page);
  await page.reload();
  await expect(page.locator('#profile-name')).toHaveText('Alex Chen');
  await expect(scheme(page)).toHaveAttribute('content', 'dark');
  await expect(page.getByRole('checkbox', { name: 'Product updates', exact: true })).toBeChecked();
});

test('theme follows system while explicit override survives changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('#system-current')).toHaveText('Currently dark');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(21, 28, 27)');
  await page.getByRole('radio', { name: 'Light', exact: true }).check();
  await savePreferences(page);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(scheme(page)).toHaveAttribute('content', 'light');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(245, 244, 239)');
});

test('clean tabs synchronize saved preferences', async ({ page, context }) => {
  const other = await context.newPage(); await other.goto('/');
  await other.getByRole('radio', { name: 'Dark', exact: true }).check();
  await savePreferences(other);
  await expect(scheme(page)).toHaveAttribute('content', 'dark');
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
});

test('saving local preferences preserves a profile saved by another tab', async ({ page, context }) => {
  const other = await context.newPage(); await other.goto('/');
  await page.getByRole('checkbox', { name: 'Email notifications', exact: true }).check();
  await openProfile(other);
  await other.getByLabel('Display name', { exact: false }).fill('Remote profile');
  await other.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toContainText('another tab');
  await savePreferences(page);
  await page.reload();
  await expect(page.locator('#profile-name')).toHaveText('Remote profile');
  await expect(page.getByRole('checkbox', { name: 'Email notifications', exact: true })).toBeChecked();
});

test('saving profile draft preserves preferences saved by another tab', async ({ page, context }) => {
  const other = await context.newPage(); await other.goto('/');
  await openProfile(page);
  await page.getByLabel('Display name', { exact: false }).fill('Local profile');
  await other.getByRole('radio', { name: 'Dark', exact: true }).check();
  await savePreferences(other);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('mwg-modernization-v1')).theme)).toBe('dark');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await page.reload();
  await expect(page.locator('#profile-name')).toHaveText('Local profile');
  await expect(scheme(page)).toHaveAttribute('content', 'dark');
});

test('blocked storage at startup leaves editing usable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.reload();
  await expect(page.getByRole('button', { name: 'Edit profile' })).toBeEnabled();
  await savePreferences(page);
  await expect(page.getByRole('status')).toContainText('could not be saved');
  await expect(page.locator('#storage-warning')).toBeVisible();
});

test('corrupt saved data is recoverable', async ({ page }) => {
  await page.evaluate(key => localStorage.setItem(key, '{bad json'), key);
  await page.reload();
  await expect(page.locator('#storage-warning')).toContainText('could not be read');
  await savePreferences(page);
  await expect(page.locator('#storage-warning')).toBeHidden();
  await page.reload();
  await expect(page.locator('#storage-warning')).toBeHidden();
});

test('without JavaScript system theme works and editing is explained', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  try {
    const page = await context.newPage(); await page.goto('http://127.0.0.1:4174');
    await expect(page.locator('noscript p')).toContainText('JavaScript is needed');
    await expect(page.getByRole('button', { name: 'Edit profile' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Save preferences' })).toBeDisabled();
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(21, 28, 27)');
  } finally { await context.close(); }
});

test('doubled text reflows without page or dialog overflow', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  // Text enlargement is not native browser zoom; record this distinction.
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await openProfile(page);
  expect(await page.locator('dialog').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
});

test('canceling a profile draft reveals the other tab update', async ({ page, context }) => {
  const other = await context.newPage(); await other.goto('/');
  await openProfile(page);
  await page.getByLabel('Display name', { exact: false }).fill('Local draft');
  await openProfile(other);
  await other.getByLabel('Display name', { exact: false }).fill('Remote saved name');
  await other.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.locator('#profile-name')).toHaveText('Remote saved name');
  await expect(page.getByLabel('Display name', { exact: false })).toHaveValue('Local draft');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('#profile-name')).toHaveText('Remote saved name');
  await openProfile(page);
  await expect(page.getByLabel('Display name', { exact: false })).toHaveValue('Remote saved name');
});

test('discarding a local preference draft restores the latest remote settings', async ({ page, context }) => {
  const other = await context.newPage(); await other.goto('/');
  await page.getByRole('checkbox', { name: 'Email notifications', exact: true }).check();
  await other.getByRole('radio', { name: 'Dark', exact: true }).check();
  await savePreferences(other);
  await expect(page.getByRole('status')).toContainText('another tab');
  await expect(page.getByRole('checkbox', { name: 'Email notifications', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Discard changes' }).click();
  await expect(scheme(page)).toHaveAttribute('content', 'dark');
  await expect(page.getByRole('checkbox', { name: 'Email notifications', exact: true })).not.toBeChecked();
});
