// @ts-check
import { test, expect } from '@playwright/test'
import { delay } from '../src/utils/time'

// const BGG_URL_GAME_PREFIX = 'https://boardgamegeek.com/boardgame/'
const LOCALHOST_URL = 'http://localhost:5173'

test('app shows oborus library', async ({ page }) => {
  await page.goto(LOCALHOST_URL)

  // await delay(3000)
  let i = 0
  const maxIterations = 20
  let games = await page.getByTestId('boardgame-card')

  while ((await await games.count()) === 0 && i < maxIterations) {
    await delay(1000)
    games = await page.getByTestId('boardgame-card')
    i++
  }

  await expect(await games.count()).toBeGreaterThan(0)

  const firstGame = await games.first()
  const name = await firstGame.getByRole('paragraph').textContent()
  const image = await firstGame.getByRole('img').first()

  await expect(image).not.toBe(undefined)

  const imageURL = await image.getAttribute('src')

  await expect(name?.length).toBeGreaterThan(0)
  await expect(imageURL?.length).toBeGreaterThan(0)
})
