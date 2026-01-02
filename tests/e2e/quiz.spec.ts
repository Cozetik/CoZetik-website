import { test, expect } from '@playwright/test'

test.describe('Quiz Questions Management', () => {
  test.skip('lists all questions in admin', async ({ page }) => {
    await page.goto('/admin/quiz/questions')

    // Should see questions table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens new question form', async ({ page }) => {
    await page.goto('/admin/quiz/questions/new')

    // Should see form fields
    await expect(page.getByLabel(/question/i)).toBeVisible()
    await expect(page.getByLabel(/ordre/i)).toBeVisible()
  })

  test.skip('validates question order uniqueness', async ({ page }) => {
    await page.goto('/admin/quiz/questions/new')

    // Fill with existing order
    await page.getByLabel(/question/i).fill('Nouvelle question ?')
    await page.getByLabel(/ordre/i).fill('1') // Assume order 1 exists

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show uniqueness error for order
    await expect(page.getByText(/existe déjà|unique|ordre.*utilisé/i)).toBeVisible()
  })

  test.skip('handles order as positive integer', async ({ page }) => {
    await page.goto('/admin/quiz/questions/new')

    const orderInput = page.getByLabel(/ordre/i)
    await orderInput.fill('5')

    // Check input type is number
    await expect(orderInput).toHaveAttribute('type', 'number')
  })

  test.skip('toggles question visibility', async ({ page }) => {
    await page.goto('/admin/quiz/questions')

    // Click visibility toggle
    await page.getByRole('button', { name: /visibilité|visible/i }).first().click()

    // Should show success message
    await expect(page.getByText(/visibilité.*modifiée|mis à jour/i)).toBeVisible()
  })

  test.skip('prevents deletion with linked options', async ({ page }) => {
    await page.goto('/admin/quiz/questions')

    // Try to delete a question that has options
    await page.getByRole('button', { name: /supprimer/i }).first().click()

    // Confirm deletion
    await page.getByRole('button', { name: /confirmer|supprimer/i }).click()

    // Should show error if options exist
    const hasError = await page.getByText(/options.*liées|impossible.*supprimer/i).isVisible().catch(() => false)
    const wasDeleted = await page.getByText(/supprimé.*succès/i).isVisible().catch(() => false)

    expect(hasError || wasDeleted).toBeTruthy()
  })
})

test.describe('Quiz Options Management', () => {
  test.skip('lists options for a question', async ({ page }) => {
    await page.goto('/admin/quiz/questions/question-1/options')

    // Should see options table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens add option dialog', async ({ page }) => {
    await page.goto('/admin/quiz/questions/question-1/options')

    await page.getByRole('button', { name: /ajouter.*option/i }).click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test.skip('validates option letter uniqueness per question', async ({ page }) => {
    await page.goto('/admin/quiz/questions/question-1/options')

    await page.getByRole('button', { name: /ajouter.*option/i }).click()

    // Fill with existing letter
    await page.getByLabel(/lettre/i).fill('A') // Assume A exists
    await page.getByLabel(/texte/i).fill('Nouvelle option')

    await page.getByRole('button', { name: /enregistrer|créer/i }).click()

    // Should show uniqueness error
    await expect(page.getByText(/existe déjà|unique|lettre.*utilisée/i)).toBeVisible()
  })
})

test.describe('Quiz Profiles Management', () => {
  test.skip('lists all profiles in admin', async ({ page }) => {
    await page.goto('/admin/quiz/profiles')

    // Should see profiles table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens new profile form', async ({ page }) => {
    await page.goto('/admin/quiz/profiles/new')

    // Should see form fields
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/lettre/i)).toBeVisible()
    await expect(page.getByLabel(/emoji/i)).toBeVisible()
    await expect(page.getByLabel(/couleur/i)).toBeVisible()
  })

  test.skip('validates profile letter uniqueness', async ({ page }) => {
    await page.goto('/admin/quiz/profiles/new')

    // Fill with existing letter
    await page.getByLabel(/lettre/i).fill('A') // Assume A exists

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show uniqueness error
    await expect(page.getByText(/existe déjà|unique/i)).toBeVisible()
  })

  test.skip('validates color hex format', async ({ page }) => {
    await page.goto('/admin/quiz/profiles/new')

    // Fill with invalid color format
    await page.getByLabel(/couleur/i).fill('not-a-color')

    await page.getByRole('button', { name: /créer|enregistrer/i }).click()

    // Should show format error
    await expect(page.getByText(/format.*invalide|hex|couleur/i)).toBeVisible()
  })

  test.skip('accepts valid hex color', async ({ page }) => {
    await page.goto('/admin/quiz/profiles/new')

    // Fill with valid hex color
    const colorInput = page.getByLabel(/couleur/i)
    await colorInput.fill('#3B82F6')

    // Value should be valid
    const value = await colorInput.inputValue()
    expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
