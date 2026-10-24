const { test, expect } = require('@playwright/test');
const path = require('path');

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:3002';
const viewports = [320, 360, 375, 390, 414, 430, 768, 1024, 1440];
const screenshotDir = path.resolve(__dirname, '..', 'qa', 'screenshots');

test.describe.configure({ mode: 'serial' });

for (const width of viewports) {
  test(`layout sem overflow em ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 844 : 900 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#hero-heading')).toBeVisible();
    await expect(page.locator('.bruna-photo')).toBeVisible();

    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      photoWidth: document.querySelector('.bruna-photo')?.naturalWidth || 0,
      photoHeight: document.querySelector('.bruna-photo')?.naturalHeight || 0,
      overflow: [...document.querySelectorAll('body *')]
        .filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .map((element) => ({ selector: element.className || element.tagName, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.getBoundingClientRect().width }))
        .sort((a, b) => a.right - b.right)
        .slice(0, 16)
    }));

    if (metrics.scroll > metrics.viewport + 1) console.log('Overflow:', metrics.overflow);
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport + 1);
    expect(metrics.photoWidth).toBe(1122);
    expect(metrics.photoHeight).toBe(1402);
    expect(pageErrors).toEqual([]);
    await context.close();
  });
}

test('CTAs, formulário e quatro players funcionam no mobile', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.hero-actions .btn-primary')).toHaveAttribute('href', '#aplicar');
  await expect(page.locator('.mobile-sticky .btn')).toHaveAttribute('href', '#aplicar');

  // Test inline presentation VSL player (triggered by #watchHeroLink or #mainVideoButton)
  await page.locator('#watchHeroLink').click();
  const inlinePlayer = page.locator('#mainVideoPlayerWrapper');
  await expect(inlinePlayer).toHaveClass(/is-active/);
  const inlineVideo = page.locator('#mainInlineVideo');
  await expect(inlineVideo).toBeVisible();
  await expect.poll(async () => inlineVideo.evaluate((el) => el.readyState)).toBeGreaterThanOrEqual(1);
  await inlineVideo.evaluate(async (el) => {
    await el.play().catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 350));
    el.pause();
  });
  expect(await inlineVideo.evaluate((el) => el.currentTime)).toBeGreaterThan(0);
  // Ensure videoOverlay did NOT open for presentation video
  await expect(page.locator('#videoOverlay')).toBeHidden();

  // Test the 3 short video cards (which DO open the modal window)
  const shortVideoCards = [
    '.media-card[data-video="para-quem"]',
    '.media-card[data-video="como-funciona"]',
    '.media-card[data-video="primeiro-passo"]'
  ];

  for (const selector of shortVideoCards) {
    await page.locator(selector).click();
    const overlay = page.locator('#videoOverlay');
    await expect(overlay).toBeVisible();
    await expect(page.locator('#videoDemoLabel')).toContainText('Vídeo ilustrativo');
    const modalVideo = page.locator('#modalVideoPlayer video');
    await expect(modalVideo).toBeVisible();
    await expect.poll(async () => modalVideo.evaluate((element) => element.readyState)).toBeGreaterThanOrEqual(1);
    await modalVideo.evaluate(async (element) => {
      await element.play().catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 350));
      element.pause();
    });
    expect(await modalVideo.evaluate((element) => element.currentTime)).toBeGreaterThan(0);
    await overlay.locator('[data-close]').first().click();
    await expect(overlay).toBeHidden();
  }

  await page.locator('#personName').fill('Teste de QA');
  await page.locator('#personMoment').selectOption({ index: 1 });
  await page.locator('#interestForm button[type="submit"]').click();
  await expect(page.locator('#formOverlay')).toBeVisible();
  await expect(page.locator('#messagePreview')).toContainText('Teste de QA');
  await expect(page.locator('#sendWhatsApp')).toBeHidden();
  await page.locator('#formOverlay [data-close]').click();
  await expect(page.locator('#formOverlay')).toBeHidden();
  await context.close();
});

test('capturas obrigatórias', async ({ browser }) => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await expect.poll(async () => mobilePage.locator('.bruna-photo').evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.screenshot({ path: path.join(screenshotDir, 'bruna-mobile-390-primeira-dobra.png') });
  await mobilePage.locator('.portrait-img').scrollIntoViewIfNeeded();
  await expect.poll(async () => mobilePage.locator('.portrait-img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  for (const poster of await mobilePage.locator('.media-card__poster').all()) {
    await poster.scrollIntoViewIfNeeded();
    await expect.poll(async () => poster.evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  }
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.screenshot({ path: path.join(screenshotDir, 'bruna-mobile-390-completa.png'), fullPage: true });
  await mobile.close();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const desktopPage = await desktop.newPage();
  await desktopPage.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await expect.poll(async () => desktopPage.locator('.bruna-photo').evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  await desktopPage.locator('.portrait-img').scrollIntoViewIfNeeded();
  await expect.poll(async () => desktopPage.locator('.portrait-img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  for (const poster of await desktopPage.locator('.media-card__poster').all()) {
    await poster.scrollIntoViewIfNeeded();
    await expect.poll(async () => poster.evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  }
  await desktopPage.evaluate(() => window.scrollTo(0, 0));
  await desktopPage.screenshot({ path: path.join(screenshotDir, 'bruna-desktop-1440.png'), fullPage: true });
  await desktop.close();
});
