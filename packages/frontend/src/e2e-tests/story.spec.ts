import { test, expect, firefox } from '@playwright/test'

test.use({ viewport: { width: 1920, height: 1080 } })

test('basic test', async ({ page }) => {
  const selectors = {
    editor: '[contenteditable]',
    addPin: 'data-testid=pin-add',
    text: 'Lorem ipsum',
    marker: '.leaflet-marker-icon',
  }

  await firefox.launch({ headless: false, devtools: true })
  await page.goto('http://localhost:8080/stories/write')
  await page.focus(selectors.editor)
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await page.type(selectors.editor, selectors.text, { delay: 100 })
  await expect(page.locator(selectors.editor)).toContainText(selectors.text)
  await page.dblclick(`text=${selectors.text}`)
  // TODO why this does not work?
  await page.locator(selectors.addPin).click()
  await expect(page.locator('text=Click map to place marker.')).toBeVisible()
  await page.mouse.click(150, 150)
})
