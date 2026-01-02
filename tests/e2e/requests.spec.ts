import { test, expect } from '@playwright/test'

test.describe('Contact Requests Management', () => {
  test.skip('lists all contact requests', async ({ page }) => {
    await page.goto('/admin/requests/contact')

    // Should see requests table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens view contact request dialog', async ({ page }) => {
    await page.goto('/admin/requests/contact')

    // Click view button on first request
    await page.getByRole('button', { name: /voir|détails/i }).first().click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Should show request details
    await expect(page.getByText(/nom|email|message/i)).toBeVisible()
  })

  test.skip('updates contact request status to TREATED', async ({ page }) => {
    await page.goto('/admin/requests/contact')

    // Click status button or dropdown
    await page.getByRole('button', { name: /statut|traiter/i }).first().click()

    // Select TREATED
    await page.getByRole('menuitem', { name: /traité|treated/i }).click()

    // Should show success message
    await expect(page.getByText(/statut.*modifié|mis à jour/i)).toBeVisible()
  })

  test.skip('updates contact request status to ARCHIVED', async ({ page }) => {
    await page.goto('/admin/requests/contact')

    // Click status button
    await page.getByRole('button', { name: /statut|archiver/i }).first().click()

    // Select ARCHIVED
    await page.getByRole('menuitem', { name: /archivé|archived/i }).click()

    // Should show success message
    await expect(page.getByText(/statut.*modifié|archivé/i)).toBeVisible()
  })

  test.skip('deletes contact request', async ({ page }) => {
    await page.goto('/admin/requests/contact')

    // Click delete button
    await page.getByRole('button', { name: /supprimer/i }).first().click()

    // Confirm
    await page.getByRole('button', { name: /confirmer|supprimer/i }).click()

    // Should show success
    await expect(page.getByText(/supprimé.*succès/i)).toBeVisible()
  })
})

test.describe('Inscriptions Management', () => {
  test.skip('lists all inscriptions with formation info', async ({ page }) => {
    await page.goto('/admin/requests/inscriptions')

    // Should see inscriptions table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens view inscription dialog', async ({ page }) => {
    await page.goto('/admin/requests/inscriptions')

    // Click view button
    await page.getByRole('button', { name: /voir|détails/i }).first().click()

    // Dialog should open with details
    await expect(page.getByRole('dialog')).toBeVisible()

    // Should show formation title
    await expect(page.getByText(/formation/i)).toBeVisible()
  })

  test.skip('updates inscription status and sends email', async ({ page }) => {
    await page.goto('/admin/requests/inscriptions')

    // Click to treat inscription
    await page.getByRole('button', { name: /traiter|accepter/i }).first().click()

    // Should show success message about email
    await expect(page.getByText(/email.*envoyé|notification/i)).toBeVisible({ timeout: 10000 })
  })

  test.skip('shows email error if sending fails', async ({ page }) => {
    await page.goto('/admin/requests/inscriptions')

    // This test depends on email configuration
    // In case of email failure, should still update status but show warning
    await page.getByRole('button', { name: /traiter|accepter/i }).first().click()

    // Either success or warning about email
    const hasSuccess = await page.getByText(/statut.*modifié|traité/i).isVisible().catch(() => false)
    const hasEmailWarning = await page.getByText(/email.*erreur|email.*échoué/i).isVisible().catch(() => false)

    expect(hasSuccess || hasEmailWarning).toBeTruthy()
  })

  test.skip('deletes inscription', async ({ page }) => {
    await page.goto('/admin/requests/inscriptions')

    await page.getByRole('button', { name: /supprimer/i }).first().click()
    await page.getByRole('button', { name: /confirmer/i }).click()

    await expect(page.getByText(/supprimé.*succès/i)).toBeVisible()
  })
})

test.describe('Candidatures Management', () => {
  test.skip('lists all candidatures', async ({ page }) => {
    await page.goto('/admin/requests/candidatures')

    // Should see candidatures table
    await expect(page.getByRole('table')).toBeVisible()
  })

  test.skip('opens view candidature dialog', async ({ page }) => {
    await page.goto('/admin/requests/candidatures')

    await page.getByRole('button', { name: /voir|détails/i }).first().click()

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Should show CV link
    await expect(page.getByText(/cv|curriculum/i)).toBeVisible()
  })

  test.skip('updates candidature status', async ({ page }) => {
    await page.goto('/admin/requests/candidatures')

    await page.getByRole('button', { name: /statut|traiter/i }).first().click()
    await page.getByRole('menuitem', { name: /traité|treated/i }).click()

    await expect(page.getByText(/statut.*modifié/i)).toBeVisible()
  })

  test.skip('deletes candidature', async ({ page }) => {
    await page.goto('/admin/requests/candidatures')

    await page.getByRole('button', { name: /supprimer/i }).first().click()
    await page.getByRole('button', { name: /confirmer/i }).click()

    await expect(page.getByText(/supprimé.*succès/i)).toBeVisible()
  })
})

test.describe('Request Status Validation', () => {
  test.skip('validates status enum values', async ({ page }) => {
    // Test that only valid status values are accepted
    const validStatuses = ['NEW', 'TREATED', 'ARCHIVED']

    await page.goto('/admin/requests/contact')

    // Open status dropdown
    await page.getByRole('button', { name: /statut/i }).first().click()

    // Check all valid statuses are available
    for (const status of validStatuses) {
      const statusOption = page.getByRole('menuitem', { name: new RegExp(status, 'i') })
      await expect(statusOption).toBeVisible()
    }
  })
})
