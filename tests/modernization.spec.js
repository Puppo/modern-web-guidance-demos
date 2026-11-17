import { test, expect } from '@playwright/test';

const openProfile = page => page.getByRole('button', { name: 'Edit profile' }).click();
const longBio = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`).join('\n');

async function expectNeutralName(page) {
  const name = page.locator('#display-name');
  await expect(name).toHaveAttribute('aria-invalid', 'false');
  await expect(name).toHaveAttribute('aria-describedby', 'name-help');
  await expect(page.locator('#name-error')).toBeEmpty();
  expect(await name.evaluate(el => el.matches(':user-invalid'))).toBe(false);
  expect(await name.evaluate(el => getComputedStyle(el).borderTopColor)).toBe(
    await page.locator('#bio').evaluate(el => getComputedStyle(el).borderTopColor),
  );
}

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('empty name stays neutral when opened, focused, and reopened', async ({ page }) => {
  await openProfile(page);
  await expect(page.locator('#display-name')).toBeFocused();
  await expectNeutralName(page);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openProfile(page);
  await expectNeutralName(page);
});

test('blurred invalid name gets linked text and clears as soon as corrected', async ({ page }) => {
  await openProfile(page);
  await page.locator('#display-name').fill('   ');
  await page.locator('#bio').focus();
  await expect(page.locator('#display-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#display-name')).toHaveAttribute('aria-describedby', 'name-help name-error');
  await expect(page.locator('#name-error')).toContainText('Enter a display name');
  await expect(page.locator('#profile-feedback')).toContainText('Enter a display name');
  await page.locator('#display-name').fill('Jamie');
  await expectNeutralName(page);
  await expect(page.locator('#profile-feedback')).toBeEmpty();
});

test('untouched submit exposes error and Cancel resets feedback on reopen', async ({ page }) => {
  await openProfile(page);
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.locator('#display-name')).toBeFocused();
  await expect(page.locator('#display-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toContainText('Enter a display name');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openProfile(page);
  await expectNeutralName(page);
});

test('bio grows, caps, shrinks and restores saved content without inline height', async ({ page }) => {
  await openProfile(page);
  const bio = page.locator('#bio');
  const initial = await bio.evaluate(el => el.getBoundingClientRect().height);
  await bio.fill(longBio);
  const supported = await page.evaluate(() => CSS.supports('field-sizing', 'content'));
  if (supported) {
    await expect.poll(() => bio.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(initial);
  }
  const size = await bio.evaluate(el => ({
    height: el.getBoundingClientRect().height,
    maximum: parseFloat(getComputedStyle(el).maxBlockSize),
    overflows: el.scrollHeight > el.clientHeight,
    inlineHeight: el.style.height,
  }));
  expect(size.height).toBeLessThanOrEqual(size.maximum + 1);
  expect(size.overflows).toBe(true);
  expect(size.inlineHeight).toBe('');
  await page.locator('#display-name').fill('Jamie');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await openProfile(page);
  await expect(bio).toHaveValue(longBio);
  await bio.fill('Short bio');
  await expect.poll(() => bio.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(initial + 1);
  await page.keyboard.press('Escape');
  await openProfile(page);
  await expect(bio).toHaveValue(longBio);
});

test('disabling field-sizing leaves a usable scrolling textarea at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Exercise the fallback presentation. This is not a run on an older browser.
  await page.addStyleTag({ content: '#bio { field-sizing: fixed !important; }' });
  await openProfile(page);
  const bio = page.locator('#bio');
  const initial = await bio.evaluate(el => el.getBoundingClientRect().height);
  await bio.fill(longBio);
  const result = await bio.evaluate(el => {
    el.scrollTop = el.scrollHeight;
    return {
      height: el.getBoundingClientRect().height,
      scrollTop: el.scrollTop,
      resize: getComputedStyle(el).resize,
      fits: el.getBoundingClientRect().right <= window.innerWidth,
    };
  });
  expect(result.height).toBe(initial);
  expect(result.scrollTop).toBeGreaterThan(0);
  expect(result.resize).toBe('vertical');
  expect(result.fits).toBe(true);
  await page.locator('#display-name').fill('Jamie');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await page.reload();
  await expect(page.locator('#profile-bio')).toHaveText(longBio);
});
