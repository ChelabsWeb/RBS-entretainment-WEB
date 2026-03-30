import { test, expect } from '@playwright/test';

test.describe('Auth flow smoke tests', () => {
  test('login page shows email and password fields', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('input#email');
    const passwordInput = page.locator('input#password');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('login page shows submit button', async ({ page }) => {
    await page.goto('/login');

    // The button text is "Ingresar"
    const submitButton = page.getByRole('button', { name: /Ingresar/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('submitting empty form shows browser validation (required fields)', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.getByRole('button', { name: /Ingresar/i });
    await submitButton.click();

    // The email field has required attribute, so the form should not submit
    // and the email input should be invalid
    const emailInput = page.locator('input#email');
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test('/dashboard redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Middleware redirects unauthenticated users to /login
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('/vip redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/vip');

    // Middleware redirects unauthenticated users to /login
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});
