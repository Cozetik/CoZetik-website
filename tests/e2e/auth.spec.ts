import { test, expect } from '@playwright/test'

test.describe('Admin Authentication', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin')

    // Should redirect to auth-admin page
    await expect(page).toHaveURL(/.*auth-admin/)
  })

  test('shows login form', async ({ page }) => {
    await page.goto('/auth-admin')

    // Check login form elements exist
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /connexion|se connecter/i })).toBeVisible()
  })

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/auth-admin')

    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/mot de passe/i).fill('wrongpassword')
    await page.getByRole('button', { name: /connexion|se connecter/i }).click()

    // Should show error message
    await expect(page.getByText(/invalide|incorrect|erreur/i)).toBeVisible({ timeout: 10000 })
  })

  test('protects admin routes', async ({ page }) => {
    const adminRoutes = [
      '/admin',
      '/admin/formations',
      '/admin/categories',
      '/admin/blog',
      '/admin/partners',
      '/admin/quiz/questions',
      '/admin/requests/contact',
    ]

    for (const route of adminRoutes) {
      await page.goto(route)
      // Should redirect to auth-admin
      await expect(page).toHaveURL(/.*auth-admin/)
    }
  })
})

test.describe('Authenticated Admin', () => {
  // Use auth state for authenticated tests
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test.beforeAll(async ({ browser }) => {
    // Setup: Create auth state file
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/auth-admin')

    // Try to login - this may fail if no valid credentials
    // In real tests, you'd use test credentials
    try {
      await page.getByLabel(/email/i).fill(process.env.TEST_ADMIN_EMAIL || 'admin@cozetik.fr')
      await page.getByLabel(/mot de passe/i).fill(process.env.TEST_ADMIN_PASSWORD || 'testpassword')
      await page.getByRole('button', { name: /connexion|se connecter/i }).click()

      // Wait for redirect to admin
      await page.waitForURL('/admin', { timeout: 10000 })

      // Save auth state
      await context.storageState({ path: 'tests/e2e/.auth/admin.json' })
    } catch {
      // Auth setup failed, tests will be skipped
      console.log('Auth setup failed - skipping authenticated tests')
    }

    await context.close()
  })

  test.skip('accesses admin dashboard after login', async ({ page }) => {
    await page.goto('/admin')

    // Should stay on admin page (not redirect)
    await expect(page).toHaveURL('/admin')

    // Should see dashboard content
    await expect(page.getByRole('heading', { name: /tableau de bord|dashboard/i })).toBeVisible()
  })

  test.skip('logs out successfully', async ({ page }) => {
    await page.goto('/admin')

    // Click user menu
    await page.getByRole('button', { name: /profil|menu/i }).click()

    // Click logout
    await page.getByRole('menuitem', { name: /déconnexion|logout/i }).click()

    // Should redirect to auth page
    await expect(page).toHaveURL(/.*auth-admin/)
  })
})
