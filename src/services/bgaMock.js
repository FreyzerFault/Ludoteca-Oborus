import bgListMock from '../mocks/bgListMock.json'
import invalidAuthError from '../mocks/invalidAuthError.json'
import emptyResults from '../mocks/noResultsMock.json'

import { validateData, processData } from './bga'

import { delay } from '../utils/time'

const searchMock = async function () {
  return Promise.resolve(bgListMock)
}

const emptySearchMock = async function () {
  return Promise.resolve(emptyResults)
}

const invalidUserMock = async function () {
  return Promise.resolve(invalidAuthError)
}

export async function getBoardGamesSearchMock({ search }) {
  if (!search || search.length === 0) return null

  await delay(1000)

  return searchMock({ searchTerm: search, limit: 2 })
    .then((data) => {
      return validateData(data)
    })
    .then((data) => {
      return processData(data)
    })
    .catch((e) => {
      throw e
    })
}
