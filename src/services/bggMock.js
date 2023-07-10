import {
  validateData,
  processCollectionData,
  processSearchData,
  processThingData,
} from './bgg'

import { delay } from '../utils/time'
import { retry } from '../utils/retry'
import { xml2Json } from '../utils/xml2json'

import { MOCK_DATA_URL } from './localData'

const thingMockData = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockThingData.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

const searchMockData = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockSearchData.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

const collectionMockData = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockCollectionData.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

// eslint-disable-next-line no-unused-vars
const emptyMockData = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockNoResults.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

// eslint-disable-next-line no-unused-vars
const processingMessageMock = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockProcessing.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

export async function getBoardGamesMock({ gameIds = [] }) {
  return delay(300).then(() =>
    retry(
      () =>
        thingMockData({ gameIds })
          .then((data) => {
            data = validateData(data)
            return processThingData(data)
          })
          .catch((e) => {
            throw e
          }),
      { tryCount: 0, maxTries: 3, cooldownInSeconds: 1 }
    )
  )
}

export async function getBoardGamesSearchMock({
  search = 'catan',
  maxResults = 12,
  includeExpansions = false,
  includeAccesories = false,
}) {
  // Delay simulado
  return delay(300).then(() =>
    retry(
      () =>
        searchMockData({ search, includeExpansions, includeAccesories })
          .then((data) => {
            return validateData(data)
          })
          .then((data) => {
            data = processSearchData(data)
            data = data.slice(0, maxResults)
            return getBoardGamesMock({ gameIds: data.map((game) => game.id) })
          }),
      { tryCount: 0, maxTries: 6, cooldownInSeconds: 1000 }
    )
  )
}

export async function getCollectionMock({
  username = 'oborus',
  subtype = 'boardgame',
  excludeSubtype = 'boardgameExpansion',
}) {
  // Delay simulado
  return delay(300).then(() => {
    return retry(
      () =>
        collectionMockData({ username, subtype, excludeSubtype })
          .then((data) => {
            return validateData(data)
          })
          .then((data) => {
            return processCollectionData(data)
          }),
      { tryCount: 0, maxTries: 6, cooldownInSeconds: 1000 }
    )
  })
}
