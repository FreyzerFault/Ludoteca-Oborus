import { URL_BGG_API, parseBggData, SortGamesByVotes } from './bgg'
import { retry } from '../../utils/retry'

import { MOCK_DATA_URL } from '../localData'
import { delay } from '../../utils/time'

const URL_BGG_API_THING = URL_BGG_API + 'thing'

// Parametros para reintentar peticion
const MAX_REQUEST_TRIES = 3
const COOLDOWN_BETWEEN_REQUESTS = 1

export async function GetBoardGames({ gameIds = [] }) {
  if (gameIds.length === 0) return []

  let args = `?id=${gameIds.join(',')}`

  // Stats devuelve, ademas, datos de ranking y scores de BGG
  const includeStats = true
  if (includeStats) args += '&stats=1'
  // Se reintenta la peticion cada segundo, hasta un maximo, si llega un RetryError
  return retry(
    () =>
      fetch(URL_BGG_API_THING + args)
        .then((data) => parseBggData(data))
        .then((data) => {
          return processData(data)
        })
        .catch((e) => {
          throw e
        }),
    {
      tryCount: 0,
      maxTries: MAX_REQUEST_TRIES,
      cooldownInSeconds: COOLDOWN_BETWEEN_REQUESTS,
    }
  )
}

function processData(data) {
  // No hay resultados:
  if (!data?.items?.item) return []

  // Procesar los datos como un array si no lo es
  const boardGames = Array.isArray(data.items.item)
    ? data.items.item
    : [data.items.item]

  return boardGames?.map((item) => ({
    id: item?._id,
    type: item?._type,
    name: Array.isArray(item?.name) ? item?.name[0]._value : item?.name._value,
    thumbnailUrl: item?.thumbnail,
    imageUrl: item?.image,
    year: item?.yearpublished._value,
    subtype: item?._subtype,
    description: item?.description,
    votes: item?.statistics?.ratings?.usersrated._value,
  }))
}

export async function GetBoardGamesSortByVotes({ gameIds = [] }) {
  return SortGamesByVotes(GetBoardGames({ gameIds }))
}

// ========================== MOCK ==========================

export async function GetBoardGamesMock() {
  return delay(300).then(() =>
    retry(
      () =>
        fetch(MOCK_DATA_URL + 'BGGmockThingData.xml')
          .then((data) => {
            data = parseBggData(data)
            return processData(data)
          })
          .catch((e) => {
            throw e
          }),
      {
        tryCount: 0,
        maxTries: MAX_REQUEST_TRIES,
        cooldownInSeconds: COOLDOWN_BETWEEN_REQUESTS,
      }
    )
  )
}
