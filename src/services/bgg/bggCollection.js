import {
  URL_BGG_API,
  ItemType,
  ColType,
  parseBggData,
  SortGamesBy,
  SortGamesByDateAdded,
} from './bgg'
import { retry } from '../../utils/retry'

import { MOCK_DATA_URL } from '../localData'
import { delay } from '../../utils/time'

const URL_BGG_API_COLLECTION = URL_BGG_API + 'collection'

// Parametros para reintentar peticion
const MAX_REQUEST_TRIES = 3
const COOLDOWN_BETWEEN_REQUESTS = 1

export async function GetCollection({
  username = 'oborus',
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned,
}) {
  if (!username || username.length === 0) return null

  let args = `?username=${username}&subtype=${subtype}&excludesubtype=${excludeSubtype}`

  // Si se le añade un filtro de tipo de Coleccion, devuelve unicamente esa coleccion
  if (colFilter.length > 0) args += `&${colFilter}=1`

  // Se reintenta la peticion cada segundo, hasta un maximo, si llega un RetryError
  return retry(
    () =>
      fetch(URL_BGG_API_COLLECTION + args)
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
  if (data?.items?._totalitems === 0) return []

  // Procesar los datos como un array si no lo es
  const boardGames = Array.isArray(data.items.item)
    ? data.items.item
    : [data.items.item]

  return SortGamesByDateAdded(
    boardGames?.map((item) => ({
      id: item?._objectid,
      name: item?.name.toString(),
      thumbnailUrl: item?.thumbnail,
      imageUrl: item?.image,
      year: item?.yearpublished,
      subtype: item?._subtype,
      description: item?.description,
      lastModified: item?.status?._lastmodified,
    }))
  )
}

// ========================== MOCK ==========================

export async function GetCollectionMock() {
  return delay(300).then(() =>
    retry(
      () =>
        fetch(MOCK_DATA_URL + 'BGGmockCollectionData.xml')
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
