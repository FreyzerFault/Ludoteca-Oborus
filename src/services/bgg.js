import { xml2Json } from '../utils/xml2json'

import { retry, RetryError } from '../utils/retry'

// URL raiz de la API
const URL_BGG_API = 'https://api.geekdo.com/xmlapi2/'
const URL_BGG_API_USERS = 'https://api.geekdo.com/xmlapi2/user'
const URL_BGG_API_COLLECTIONS = 'https://api.geekdo.com/xmlapi2/collection'
const URL_BGG_API_PLAYS = 'https://api.geekdo.com/xmlapi2/plays'

const OBORUS_USERNAME = 'oborus'

function buildCollectionURL({
  username = OBORUS_USERNAME,
  subtype = 'boardgame',
  excludeSubtype = 'boardgameexpansion',
}) {
  return (
    URL_BGG_API_COLLECTIONS +
    '?username=' +
    username +
    '&subtype=' +
    subtype +
    '&excludesubtype=' +
    excludeSubtype
  )
}

export async function fetchCollection({
  username = OBORUS_USERNAME,
  subtype = 'boardgame',
  excludeSubtype = 'boardgameexpansion',
}) {
  return fetch(buildCollectionURL({ username, subtype, excludeSubtype }))
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((err) => {
      throw err
    })
}

export async function getCollection({
  username = OBORUS_USERNAME,
  subtype = 'boardgame',
  excludeSubtype = 'boardgameexpansion',
}) {
  if (!username || username.length === 0) return null
  // Delay simulado
  return retry(
    () =>
      fetchCollection({ username, subtype, excludeSubtype })
        .then((data) => {
          return validateData(data)
        })
        .then((data) => {
          return processData(data)
        }),
    { tryCount: 0, maxTries: 3, cooldownInSeconds: 1000 }
  )
}

// =========================== Procesamiento de Datos ===========================

export function validateData(data) {
  // HAY DATOS?
  if (!data) throw new Error('No se recibió respuesta')

  // Existe la propiedad "totalitems" en la data
  if (!('items' in data) && !('message' in data))
    throw new Error('Respuesta no reconocida: ' + data)

  return data
}

export function processData(data) {
  if ('message' in data) throw new RetryError()

  // No hay resultados:
  if (data.items._totalitems === 0) return []

  // Procesar los datos al formato que quiero
  const boardGames = !Array.isArray(data.items.item)
    ? [data.items.item]
    : data.items.item

  const mappedGames = boardGames?.map((item) => ({
    id: item._objectid,
    name: item.name.toString(),
    thumbnail: item.thumbnail,
    image: item.image,
    year: item.yearpublished,
    subtype: item._subtype,
  }))
  return mappedGames
}
