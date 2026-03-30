import { test, expect } from '@playwright/test';

test.describe('Public page navigation', () => {
  test('home page loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RBS Entertainment/);
  });

  test('navigate to /peliculas and verify page loads', async ({ page }) => {
    await page.goto('/peliculas');
    await expect(page).toHaveTitle(/RBS Entertainment/);
    // The page should contain movie-related content once loaded
    await expect(page.locator('main')).toBeVisible();
  });

  test('navigate to /licensing and verify page loads', async ({ page }) => {
    await page.goto('/licensing');
    await expect(page.getByRole('heading', { name: /Licencias/i })).toBeVisible();
  });

  test('navigate to /login and verify login form appears', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Iniciar Sesion')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
  });

  test('404 page shows "no encontrada" for nonexistent route', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText(/no encontrada/i)).toBeVisible();
  });
});
