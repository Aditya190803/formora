import { test, expect } from '@playwright/test';

test('landing page has title and hero section', async ({ page }) => {
  await page.goto('/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Formora/);

  // Check for hero section content
  const heroHeading = page.getByRole('heading', { level: 1 });
  await expect(heroHeading).toBeVisible();
});

test('navigation to dashboard requires login', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Should redirect to login or show login prompt if not authenticated
  // Since we use Stack Auth, it might redirect to /handler/sign-in
  await expect(page).toHaveURL(/.*handler\/sign-in.*/);
});
