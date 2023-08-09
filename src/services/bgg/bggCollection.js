import { URL_BGG_API, ItemType, ColType, parseBggData } from './bgg'
import { SortGamesBy, SortOrder } from '../../utils/sort'
import { GetBoardGames, GetBoardGamesMock } from './bggThing'
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
  stats = false,
}) {
  if (!username || username.length === 0) return null

  let args = `?username=${username}&subtype=${subtype}&excludesubtype=${excludeSubtype}`

  // Si se le añade un filtro de tipo de Coleccion, devuelve unicamente esa coleccion
  if (colFilter.length > 0) args += `&${colFilter}=1`

  // Stats adicionales (ratings, rankings,...)
  if (stats) args += '&stats=1'

  // Se reintenta la peticion cada segundo, hasta un maximo, si llega un RetryError
  return retry(
    () =>
      fetch(URL_BGG_API_COLLECTION + args)
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

// Devuelve los Juegos pero con mas datos extra
export async function GetCollectionDetailed({
  username = 'oborus',
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned,
}) {
  return GetCollection({
    username,
    subtype,
    excludeSubtype,
    colFilter,
    stats: true,
  }).then((col) => {
    const ids = col.map(({ id }) => id)
    // Datos extra que se añaden al resultado de la busqueda
    const extraData = col.map(
      ({ dateAdded, ranking, subRankings, avgRating, numOwned }) => ({
        dateAdded,
        ranking,
        subRankings,
        avgRating,
        numOwned,
      })
    )
    return GetBoardGames({
      gameIds: ids,
      otherData: extraData,
    })
  })
}

// Array con IDs de los juegos en la coleccion
async function GetCollectionIds({
  username = 'oborus',
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned,
}) {
  return GetCollection({ username, subtype, excludeSubtype, colFilter }).then(
    (col) => col.map((game) => game.id)
  )
}

function processData(data) {
  // No hay resultados:
  if (data?.items?._totalitems === 0) return []

  // Procesar los datos como un array si no lo es
  const boardGames = Array.isArray(data.items.item)
    ? data.items.item
    : [data.items.item]

  // Hago que los rankings sea si o si un Array
  boardGames.map((item) => {
    const mappedItem = item
    if (
      mappedItem?.stats?.rating?.ranks?.rank &&
      !Array.isArray(mappedItem?.stats?.rating?.ranks?.rank)
    )
      mappedItem.stats.rating.ranks.rank = [mappedItem.stats.rating.ranks.rank]
    return mappedItem
  })

  const mappedGames = boardGames?.map((item) => ({
    id: item?._objectid,
    name: item?.name.toString(),
    year: item?.yearpublished,
    description: item?.description,
    subtype: item?._subtype,
    thumbnailUrl: item?.thumbnail,
    imageUrl: item?.image,
    dateAdded: item?.status?._lastmodified,
    minPlayers: parseInt(item?.stats?._minplayers),
    maxPlayers: parseInt(item?.stats?._maxplayers),
    minPlaytime: parseInt(item?.stats?._minplaytime),
    maxPlaytime: parseInt(item?.stats?._maxplaytime),
    avgPlaytime: parseInt(item?.stats?._playingtime),
    numOwned: parseInt(item?.stats?._numowned),
    avgRating: parseFloat(item?.stats?.rating?.average?._value),
    votes: parseInt(item?.stats?.rating?.usersrated?._value),
    ranking: parseInt(item?.stats?.rating?.ranks?.rank[0]?._value),
    subRankings: item?.stats?.rating?.ranks?.rank
      .map((rank) => ({
        category: rank._friendlyname,
        categoryId: rank._id,
        ranking: parseInt(rank._value),
      }))
      .slice(1),
  }))
  return mappedGames
  // return SortGamesBy({
  //   games: mappedGames,
  //   sortBy: 'lastModified',
  //   order: SortOrder.Descending,
  // })
}

// ========================== MOCK ==========================

export async function GetCollectionMock() {
  return delay(300).then(() =>
    retry(
      () =>
        fetch(MOCK_DATA_URL + 'BGGmockCollectionData.xml')
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

export async function GetCollectionDetailedMock() {
  return GetCollectionMock()
}
