import { test, expect } from '@playwright/test'

test.describe('Formations Management', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In real tests, you'd authenticate first
    // For now, we test the public-facing aspects
  })

  test('formations page loads', async ({ page }) => {
    await page.goto('/formations')

    // Page should load
    await expect(page).toHaveURL(/.*formations/)
  })

  test('displays formation cards', async ({ page }) => {
    await page.goto('/formations')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Should have formation cards or empty state
    const hasFormations = await page.locator('[data-testid="formation-card"]').count() > 0
    const hasEmptyState = await page.getByText(/aucune formation|pas de formation/i).isVisible().catch(() => false)

    expect(hasFormations || hasEmptyState).toBeTruthy()
  })
})

test.describe('Admin Formations CRUD', () => {
  // These tests require authentication
  // Skip if not authenticated

  test.skip('lists all formations in admin', async ({ page }) => {
    await page.goto('/admin/formations')

    // Should see formations table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens new formation form', async ({ page }) => {
    await page.goto('/admin/formations/new')

    // Should see form fields
    await expect(page.getByLabel(/titre/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/prix/i)).toBeVisible()
    await expect(page.getByLabel(/catégorie/i)).toBeVisible()
  })

  test.skip('validates required fields', async ({ page }) => {
    await page.goto('/admin/formations/new')

    // Try to submit empty form
    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show validation errors
    await expect(page.getByText(/obligatoire|requis|required/i)).toBeVisible()
  })

  test.skip('handles price field as number', async ({ page }) => {
    await page.goto('/admin/formations/new')

    // Fill in price
    const priceInput = page.getByLabel(/prix/i)
    await priceInput.fill('199.99')

    // Check input type is number
    await expect(priceInput).toHaveAttribute('type', 'number')

    // Value should be numeric
    const value = await priceInput.inputValue()
    expect(parseFloat(value)).toBe(199.99)
  })

  test.skip('handles order field as number', async ({ page }) => {
    await page.goto('/admin/formations/new')

    // Find order input
    const orderInput = page.getByLabel(/ordre/i)
    await orderInput.fill('5')

    // Check input type is number
    await expect(orderInput).toHaveAttribute('type', 'number')

    // Value should be integer
    const value = await orderInput.inputValue()
    expect(parseInt(value)).toBe(5)
  })

  test.skip('shows delete confirmation dialog', async ({ page }) => {
    await page.goto('/admin/formations')

    // Click delete button on first formation
    await page.getByRole('button', { name: /supprimer/i }).first().click()

    // Should show confirmation dialog
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await expect(page.getByText(/êtes-vous sûr|confirmer/i)).toBeVisible()
  })

  test.skip('toggles formation visibility', async ({ page }) => {
    await page.goto('/admin/formations')

    // Click visibility toggle
    const toggleButton = page.getByRole('button', { name: /visibilité|visible/i }).first()
    const initialState = await toggleButton.getAttribute('aria-pressed')

    await toggleButton.click()

    // State should change
    await expect(toggleButton).not.toHaveAttribute('aria-pressed', initialState)
  })
})

test.describe('Formation Sessions', () => {
  test.skip('opens add session dialog', async ({ page }) => {
    // Navigate to sessions page for a formation
    await page.goto('/admin/formations/form-1/sessions')

    // Click add session button
    await page.getByRole('button', { name: /ajouter.*session/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test.skip('validates session dates', async ({ page }) => {
    await page.goto('/admin/formations/form-1/sessions')

    await page.getByRole('button', { name: /ajouter.*session/i }).click()

    // Fill dates with end date before start date
    await page.getByLabel(/date de début/i).fill('2024-06-10')
    await page.getByLabel(/date de fin/i).fill('2024-06-05')

    // Try to submit
    await page.getByRole('button', { name: /enregistrer|créer/i }).click()

    // Should show validation error
    await expect(page.getByText(/date.*invalide|antérieure/i)).toBeVisible()
  })

  test.skip('handles maxSeats as number', async ({ page }) => {
    await page.goto('/admin/formations/form-1/sessions')

    await page.getByRole('button', { name: /ajouter.*session/i }).click()

    // Fill maxSeats
    const maxSeatsInput = page.getByLabel(/places|maximum/i)
    await maxSeatsInput.fill('20')

    // Check input type is number
    await expect(maxSeatsInput).toHaveAttribute('type', 'number')
  })
})

test.describe('Formation Steps', () => {
  test.skip('manages formation steps', async ({ page }) => {
    await page.goto('/admin/formations/form-1/steps')

    // Should see steps table or empty state
    const hasTable = await page.getByRole('table').isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/aucune étape/i).isVisible().catch(() => false)

    expect(hasTable || hasEmptyState).toBeTruthy()
  })

  test.skip('validates step order as positive integer', async ({ page }) => {
    await page.goto('/admin/formations/form-1/steps')

    await page.getByRole('button', { name: /ajouter.*étape/i }).click()

    // Fill order with 0 (should fail - minimum is 1)
    const orderInput = page.getByLabel(/ordre/i)
    await orderInput.fill('0')

    await page.getByRole('button', { name: /enregistrer|créer/i }).click()

    // Should show validation error for order >= 1
    await expect(page.getByText(/supérieur|minimum|positif/i)).toBeVisible()
  })
})

test.describe('Formation FAQs', () => {
  test.skip('manages formation FAQs', async ({ page }) => {
    await page.goto('/admin/formations/form-1/faqs')

    // Should see FAQs table or empty state
    const hasTable = await page.getByRole('table').isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/aucune faq/i).isVisible().catch(() => false)

    expect(hasTable || hasEmptyState).toBeTruthy()
  })

  test.skip('validates question max length', async ({ page }) => {
    await page.goto('/admin/formations/form-1/faqs')

    await page.getByRole('button', { name: /ajouter.*faq/i }).click()

    // Fill question with more than 500 characters
    const longQuestion = 'A'.repeat(501)
    await page.getByLabel(/question/i).fill(longQuestion)

    await page.getByRole('button', { name: /enregistrer|créer/i }).click()

    // Should show validation error
    await expect(page.getByText(/500.*caractères|trop long/i)).toBeVisible()
  })
})
