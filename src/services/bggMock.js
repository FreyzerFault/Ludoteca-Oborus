import { validateData, processData } from './bgg'

import { delay } from '../utils/time'
import { retry } from '../utils/retry'
import { xml2Json } from '../utils/xml2json'

const URL_LOCAL = 'http://localhost:5173/'

const collectionMockData = async function () {
  return fetch(URL_LOCAL + 'BGGmockData.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

// eslint-disable-next-line no-unused-vars
const emptyMockData = async function () {
  return fetch(URL_LOCAL + 'BGGmockNoResults.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

// eslint-disable-next-line no-unused-vars
const processingMessageMock = async function () {
  return fetch(URL_LOCAL + 'BGGmockProcessing.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
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
            return processData(data)
          }),
      { tryCount: 0, maxTries: 6, cooldownInSeconds: 1000 }
    )
  })
}
