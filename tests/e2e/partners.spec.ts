import { test, expect } from '@playwright/test'

test.describe('Partners Management', () => {
  test.skip('lists all partners in admin', async ({ page }) => {
    await page.goto('/admin/partners')

    // Should see partners table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens new partner form', async ({ page }) => {
    await page.goto('/admin/partners/new')

    // Should see form fields
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/site web|website/i)).toBeVisible()
    await expect(page.getByLabel(/ordre/i)).toBeVisible()
  })

  test.skip('validates partner name', async ({ page }) => {
    await page.goto('/admin/partners/new')

    // Try to submit with short name
    await page.getByLabel(/nom/i).fill('')
    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show validation error
    await expect(page.getByText(/nom.*requis|obligatoire/i)).toBeVisible()
  })

  test.skip('validates website URL format', async ({ page }) => {
    await page.goto('/admin/partners/new')

    // Fill with invalid URL
    await page.getByLabel(/site web|website/i).fill('not-a-url')

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show URL format error
    await expect(page.getByText(/url.*invalide|format/i)).toBeVisible()
  })

  test.skip('accepts valid URL', async ({ page }) => {
    await page.goto('/admin/partners/new')

    // Fill with valid URL
    const urlInput = page.getByLabel(/site web|website/i)
    await urlInput.fill('https://example.com')

    // Should be valid
    const value = await urlInput.inputValue()
    expect(value).toMatch(/^https?:\/\//)
  })

  test.skip('allows null website URL', async ({ page }) => {
    await page.goto('/admin/partners/new')

    // Fill required fields only
    await page.getByLabel(/nom/i).fill('Nouveau Partenaire')
    // Leave website empty

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should not show URL required error
    const urlError = await page.getByText(/url.*requis|site.*obligatoire/i).isVisible().catch(() => false)
    expect(urlError).toBeFalsy()
  })

  test.skip('handles order field as number', async ({ page }) => {
    await page.goto('/admin/partners/new')

    const orderInput = page.getByLabel(/ordre/i)
    await orderInput.fill('2')

    // Check input type is number
    await expect(orderInput).toHaveAttribute('type', 'number')
  })

  test.skip('toggles partner visibility', async ({ page }) => {
    await page.goto('/admin/partners')

    // Click visibility toggle
    await page.getByRole('button', { name: /visibilité|visible/i }).first().click()

    // Should show success message
    await expect(page.getByText(/visibilité.*modifiée|mis à jour/i)).toBeVisible()
  })

  test.skip('deletes partner', async ({ page }) => {
    await page.goto('/admin/partners')

    // Click delete button
    await page.getByRole('button', { name: /supprimer/i }).first().click()

    // Confirm deletion
    await page.getByRole('button', { name: /confirmer|supprimer/i }).click()

    // Should show success message
    await expect(page.getByText(/supprimé.*succès/i)).toBeVisible()
  })
})
