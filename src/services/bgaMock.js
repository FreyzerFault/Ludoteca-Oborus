import bgListMock from '../mocks/bgListMock.json'
import invalidAuthError from '../mocks/invalidAuthError.json'
import emptyResults from '../mocks/noResultsMock.json'
import oborusListsMock from '../mocks/oborusListsMock.json'

import {
  validateData,
  processDataByBoardGameList,
  processDataByUserCollections,
  DEFAULT_SEARCH_LIMIT,
} from './bga'

import { delay } from '../utils/time'

const searchMock = async () => Promise.resolve(bgListMock)

// eslint-disable-next-line no-unused-vars
const emptySearchMock = async () => Promise.resolve(emptyResults)

// eslint-disable-next-line no-unused-vars
const invalidUserMock = async () => Promise.resolve(invalidAuthError)

const collectionsMock = async () => Promise.resolve(oborusListsMock)

export async function getBoardGamesSearchMock({ search }) {
  if (!search || search.length === 0) return null

  await delay(1000)

  return searchMock({ searchTerm: search, limit: 2 })
    .then((data) => {
      return validateData(data)
    })
    .then((data) => {
      return processDataByBoardGameList(data)
    })
    .catch((e) => {
      throw e
    })
}

// Utiliza el mismo fetching de la Búsqueda pero buscar por list_id, en vez de por nombre del juego
export async function getCollectionSearchMock({
  collection_id,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  await delay(1000)

  return searchMock({ collection_id, limit, skip })
    .then((data) => validateData(data))
    .then((data) => processDataByBoardGameList(data))
    .catch((e) => {
      throw e
    })
}

export async function getCollectionsMock({ username = 'Oborus' }) {
  await delay(1000)

  return collectionsMock({ username })
    .then((data) => {
      return validateData(data)
    })
    .then((data) => {
      return processDataByUserCollections(data)
    })
    .catch((e) => {
      throw e
    })
}
