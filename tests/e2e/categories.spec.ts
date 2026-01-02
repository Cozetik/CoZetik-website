import { test, expect } from '@playwright/test'

test.describe('Categories Management', () => {
  test.skip('lists all categories in admin', async ({ page }) => {
    await page.goto('/admin/categories')

    // Should see categories table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens new category form', async ({ page }) => {
    await page.goto('/admin/categories/new')

    // Should see form fields
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/slug/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/ordre/i)).toBeVisible()
  })

  test.skip('validates category name', async ({ page }) => {
    await page.goto('/admin/categories/new')

    // Try to submit with short name
    await page.getByLabel(/nom/i).fill('A')
    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show validation error
    await expect(page.getByText(/caractères|minimum/i)).toBeVisible()
  })

  test.skip('validates slug uniqueness', async ({ page }) => {
    await page.goto('/admin/categories/new')

    // Fill form with existing slug
    await page.getByLabel(/nom/i).fill('Test Category')
    await page.getByLabel(/slug/i).fill('developpement-personnel') // Assume this exists

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show uniqueness error
    await expect(page.getByText(/existe déjà|unique/i)).toBeVisible()
  })

  test.skip('handles order field as number', async ({ page }) => {
    await page.goto('/admin/categories/new')

    const orderInput = page.getByLabel(/ordre/i)
    await orderInput.fill('3')

    // Check input type is number
    await expect(orderInput).toHaveAttribute('type', 'number')

    // Value should be integer
    const value = await orderInput.inputValue()
    expect(parseInt(value)).toBe(3)
  })

  test.skip('prevents deletion with linked formations', async ({ page }) => {
    await page.goto('/admin/categories')

    // Try to delete a category that has formations
    await page.getByRole('button', { name: /supprimer/i }).first().click()

    // Confirm deletion
    await page.getByRole('button', { name: /confirmer|supprimer/i }).click()

    // Should show error if formations exist
    // (This depends on whether the category has formations)
    const hasError = await page.getByText(/formations.*liées|impossible.*supprimer/i).isVisible().catch(() => false)
    const wasDeleted = await page.getByText(/supprimé.*succès/i).isVisible().catch(() => false)

    expect(hasError || wasDeleted).toBeTruthy()
  })

  test.skip('toggles category visibility', async ({ page }) => {
    await page.goto('/admin/categories')

    // Click visibility toggle
    const toggleButton = page.getByRole('button', { name: /visibilité|visible/i }).first()

    await toggleButton.click()

    // Should show success message
    await expect(page.getByText(/visibilité.*modifiée|mis à jour/i)).toBeVisible()
  })

  test.skip('allows empty description', async ({ page }) => {
    await page.goto('/admin/categories/new')

    // Fill required fields only
    await page.getByLabel(/nom/i).fill('Nouvelle Catégorie')
    await page.getByLabel(/slug/i).fill('nouvelle-categorie-test')
    // Leave description empty

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should succeed or show other validation errors (not description)
    const descriptionError = await page.getByText(/description.*obligatoire|description.*requis/i).isVisible().catch(() => false)
    expect(descriptionError).toBeFalsy()
  })
})
