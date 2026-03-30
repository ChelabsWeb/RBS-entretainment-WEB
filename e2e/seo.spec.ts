import { test, expect } from '@playwright/test';

test.describe('SEO setup', () => {
  test('/robots.txt returns valid content with Disallow rules', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('User-Agent');
    expect(body).toContain('Disallow: /dashboard');
    expect(body).toContain('Disallow: /vip');
  });

  test('/sitemap.xml returns valid XML content', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
    expect(body).toContain('<loc>');
  });

  test('home page has proper meta tags', async ({ page }) => {
    await page.goto('/');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /RBS Entertainment/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /RBS Entertainment/);
  });
});
