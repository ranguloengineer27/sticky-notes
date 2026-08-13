import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('creates a note by double-clicking the canvas and enters editing mode', async ({
  page,
}) => {
  await page.mouse.dblclick(200, 200)

  const note = page.getByTestId('sticky-note')
  await expect(note).toBeVisible()

  const description = page.getByLabel('Note description')
  await expect(description).toBeFocused()

  await description.fill('Buy groceries')
  await page.mouse.click(700, 600)

  await expect(note).toContainText('Buy groceries')
})

test('deletes a note by dragging it to the trash zone', async ({ page }) => {
  await page.mouse.dblclick(200, 200)
  await page.mouse.click(700, 600)

  const note = page.getByTestId('sticky-note')
  await expect(note).toBeVisible()

  const noteBox = await note.boundingBox()
  if (!noteBox) throw new Error('Expected sticky note to have a bounding box')

  const trashZone = page.getByLabel('Trash zone')
  const trashBox = await trashZone.boundingBox()
  if (!trashBox) throw new Error('Expected trash zone to have a bounding box')

  await page.mouse.move(
    noteBox.x + noteBox.width / 2,
    noteBox.y + noteBox.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    trashBox.x + trashBox.width / 2,
    trashBox.y + trashBox.height / 2,
    { steps: 10 },
  )
  await page.mouse.up()

  const confirmDeleteButton = page.getByRole('button', { name: 'Delete' })
  await expect(confirmDeleteButton).toBeVisible()
  await confirmDeleteButton.click()

  await expect(note).toHaveCount(0)
})
