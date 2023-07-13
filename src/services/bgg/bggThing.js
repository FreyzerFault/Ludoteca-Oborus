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

  // Comprobar el Nº de IDs, si son muchas la URL puede NO SER VALIDA
  // Por lo que podemos hacer la peticiones en lotes de varias peticiones, de n en n
  if (gameIds.length > 400) {
    return RequestInBatches({ gameIds, batchSize: 400 })
  }

  let args = `?id=${gameIds.join(',')}`

  // Stats devuelve, ademas, datos de ranking y scores de BGG
  const includeStats = true
  if (includeStats) args += '&stats=1'
  // Se reintenta la peticion cada segundo, hasta un maximo, si llega un RetryError
  return retry(
    () =>
      fetch(URL_BGG_API_THING + args)
        .then((data) => parseBggData(data))
        .then((data) => processData(data))
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

// Realiza Peticiones por LOTES
// Hace tantas peticiones como necesite, pero siempre con un numero de IDs acotado al maximo del LOTE (Batch)
async function RequestInBatches({ gameIds = [], batchSize }) {
  if (gameIds.length === 0) return []

  let batches = [],
    outputGames = [],
    batchPromises = []

  for (let i = 0; i < Math.ceil(gameIds.length / batchSize); i++) {
    const batchIds = gameIds.slice(i * batchSize, i * batchSize + batchSize)
    batches.push({
      batchId: i,
      gameIds: batchIds,
    })
    let args = `?id=${batchIds.join(',')}`

    // Stats devuelve, ademas, datos de ranking y scores de BGG
    const includeStats = true
    if (includeStats) args += '&stats=1'

    batchPromises.push(
      retry(
        () =>
          fetch(URL_BGG_API_THING + args)
            .then((data) => parseBggData(data))
            .then((data) => processData(data))
            .then((games) => {
              outputGames.push(...games)
              console.log(`Batch ${i} done (${games.length} Juegos)`)
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

  return Promise.all(batchPromises).then(() => outputGames)
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
    year: item?.yearpublished._value,
    description: item?.description,
    minPlayers: parseInt(item?.minplayers?._value),
    maxPlayers: parseInt(item?.maxplayers?._value),
    avgPlayTime: parseInt(item?.playingtime?._value),
    minPlaytime: parseInt(item?.minplaytime?._value),
    maxPlaytime: parseInt(item?.maxplaytime?._value),
    subtype: item?._subtype,
    thumbnailUrl: item?.thumbnail,
    imageUrl: item?.image,
    votes: parseInt(item?.statistics?.ratings?.usersrated._value),
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
          .then((data) => parseBggData(data))
          .then((data) => processData(data))
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
