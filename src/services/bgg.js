/* eslint-disable no-unused-vars */
import { xml2Json } from '../utils/xml2json'

import { retry, RetryError } from '../utils/retry'
import { processDataByBoardGameList } from './bga'

// URL raiz de la API
const URL_BGG_API = 'https://api.geekdo.com/xmlapi2/'
const URL_BGG_API_ITEMS = 'https://api.geekdo.com/xmlapi2/thing'
const URL_BGG_API_SEARCH = 'https://api.geekdo.com/xmlapi2/search'
const URL_BGG_API_USERS = 'https://api.geekdo.com/xmlapi2/user'
const URL_BGG_API_COLLECTIONS = 'https://api.geekdo.com/xmlapi2/collection'
const URL_BGG_API_PLAYS = 'https://api.geekdo.com/xmlapi2/plays'

// Nombre de Usuario
const OBORUS_USERNAME = 'oborus'

// Tipos de Items
export const ItemType = {
  BoardGame: 'boardgame',
  Expansion: 'boardgameexpansion',
  Accesory: 'boardgameaccessory',
}

// Tipos de Colecciones standard que ofrece BGG donde guardar los juegos
export const ColType = {
  NoType: '',
  Owned: 'own',
  PrevOwned: 'prevowned',
  WishList: 'wishlist',
  PreOrdered: 'preordered',
  Played: 'played',
  Rated: 'rated',
  Commented: 'comment',
  Want: 'want',
  Trade: 'trade',
  WantToPlay: 'wanttoplay',
  WantToBuy: 'wanttobuy',
  HasParts: 'hasparts',
  WantParts: 'wantparts',
}

// =========================== BG by IDs ===========================
export async function getBoardGames({ gameIds = [], maxResults = 12 }) {
  const url = `${URL_BGG_API_ITEMS}?id=${gameIds.join(',')}&stats=1`
  return retry(
    () =>
      fetch(url)
        .then((data) => data.text())
        .then((data) => {
          data = xml2Json(data)
          data = validateData(data)
          data = processThingData(data)

          // Los ordeno por ranking de BGG
          data = data.sort((a, b) =>
            parseFloat(a.votes) < parseFloat(b.votes) ? 1 : -1
          )

          // Se limitan a un máximo de resultados y se hace una peticion por IDs a la API para obtener toda la Info
          data = data.slice(0, maxResults)

          return data
        })
        .catch((e) => {
          throw e
        }),
    { tryCount: 0, maxTries: 3, cooldownInSeconds: 1 }
  )
}

// Devuelve las imagenes de los juegos pasados por ID
export async function getImagesUrl({ gameIds = [] }) {
  return getBoardGames({ gameIds }).then((data) =>
    data.map((game) => game.imageUrl)
  )
}

// =========================== SEARCH ===========================
export async function getBoardGamesSearch({
  search,
  maxResults = 12,
  includeExpansions = true,
  includeAccesories = true,
}) {
  if (!search || search.length === 0) return null

  const types = [ItemType.BoardGame]
  if (includeExpansions) types.push(ItemType.Expansion)
  if (includeAccesories) types.push(ItemType.Accesory)

  return retry(
    () =>
      fetch(`${URL_BGG_API_SEARCH}?query=${search}&type=${types.join(',')}`)
        .then((data) => data.text())
        .then((data) => {
          data = xml2Json(data)
          data = validateData(data)
          data = processSearchData(data)
          return getBoardGames({
            gameIds: data.map((game) => game.id),
            maxResults,
          })
        })
        .catch((e) => {
          throw e
        }),
    { tryCount: 0, maxTries: 3, cooldownInSeconds: 1 }
  )
}

// =========================== COLLECTIONS ===========================
function buildCollectionURL({
  username = OBORUS_USERNAME,
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned,
}) {
  const URL =
    `${URL_BGG_API_COLLECTIONS}?username=${username}&subtype=${subtype}&excludesubtype=${excludeSubtype}` +
    (colFilter === ColType.NoType ? '' : `&${colFilter}=1`)
  return URL
}

async function fetchCollection({
  username = OBORUS_USERNAME,
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned,
}) {
  return fetch(
    buildCollectionURL({ username, subtype, excludeSubtype, colFilter })
  )
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((err) => {
      throw err
    })
}

export async function getCollection({
  username = OBORUS_USERNAME,
  subtype = ItemType.BoardGame,
  excludeSubtype = ItemType.Expansion,
  colFilter = ColType.Owned, // Puede ser owned, prevowned, wishlist... (Mirar parametros de la API)
}) {
  if (!username || username.length === 0) return null
  // Delay simulado
  return retry(
    () =>
      fetchCollection({ username, subtype, excludeSubtype, colFilter })
        .then((data) => {
          return validateData(data)
        })
        .then((data) => {
          return processCollectionData(data)
        })
        .catch((err) => {
          console.error(err)
          throw err
        }),
    { tryCount: 0, maxTries: 3, cooldownInSeconds: 1 }
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

export function processCollectionData(data) {
  if ('message' in data) throw new RetryError()

  // No hay resultados:
  if (data.items._totalitems === 0) return []

  // Procesar los datos al formato que quiero
  const boardGames = !Array.isArray(data.items.item)
    ? [data.items.item]
    : data.items.item

  let mappedGames = boardGames?.map((item) => ({
    id: item?._objectid,
    name: item?.name.toString(),
    thumbnailUrl: item?.thumbnail,
    imageUrl: item?.image,
    year: item?.yearpublished,
    subtype: item?._subtype,
    description: item?.description,
    lastModified: item?.status?._lastmodified,
  }))

  mappedGames.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1))
  return mappedGames
}

export function processSearchData(data) {
  if ('message' in data) throw new RetryError()

  // No hay resultados:
  if (data.items._total === 0) return []

  // Procesar los datos al formato que quiero
  let boardGames = !Array.isArray(data.items.item)
    ? [data.items.item]
    : data.items.item

  // Filtro juegos repetidos con nombres alternativos, solo los nombres primarios (name._type === "primary")
  const filteredGames = []
  boardGames.forEach((item) => {
    if (item.name._type !== 'primary') return

    // Si hay otro con el mismo ID y nombre Primary se filtra por tipo
    const collision = filteredGames.find((other) => other._id === item._id)
    if (!collision) filteredGames.push(item)
    else {
      // Se sustituye siempre que sea mas importante: BoardGame > Expansion > Accesory
      switch (collision._type) {
        case ItemType.BoardGame:
          break
        case ItemType.Accesory:
          filteredGames.push(item)
          break
        case ItemType.Expansion:
          if (item._type === ItemType.BoardGame) filteredGames.push(item)
          break
      }
    }
  })

  const mappedGames = filteredGames?.map((item) => ({
    id: item?._id,
    type: item?._type,
    name: item?.name._value,
    year: item?.yearpublished?._value,
  }))

  return mappedGames
}

export function processThingData(data) {
  if ('message' in data) throw new RetryError()

  // No hay resultados:
  if (!data?.items?.item) return []
  console.log(data)

  // Hay solo 1
  data = !Array.isArray(data.items.item) ? [data.items.item] : data.items.item

  const mappedGames = data?.map((item) => {
    return {
      id: item?._id,
      type: item?._type,
      name: Array.isArray(item?.name)
        ? item?.name[0]._value
        : item?.name._value,
      thumbnailUrl: item?.thumbnail,
      imageUrl: item?.image,
      year: item?.yearpublished._value,
      subtype: item?._subtype,
      description: item?.description,
      votes: item?.statistics?.ratings?.usersrated._value,
    }
  })

  return mappedGames
}

// ============================== AUTH ==============================
const BGGLOGIN_URL = 'https://boardgamegeek.com/login/api/v1'

function loginBGG({ username, password }) {
  return fetch(BGGLOGIN_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      credentials: {
        username,
        password,
      },
    }),
  }).then((res) => {
    // setup session cookie
    // "bggusername=Freyzer; bggpassword=Freyzer0.; SessionID=SESSIONID;"
    let sessionCookie = ''

    console.log(res)

    // console.log(res)
    // console.log(res.headers)
    // console.log(res.body)

    for (let cookie in res.headers['set-cookie'].split(';')) {
      if (cookie.startsWith('bggusername')) {
        sessionCookie += (cookie.length > 0 ? ' ' : '') + cookie + ';'
        continue
      }
      let idx = cookie.indexOf('bggpassword=')
      if (idx != -1) {
        sessionCookie +=
          (cookie.length > 0 ? ' ' : '') +
          'bggpassword=' +
          cookie.substring(idx + 12) +
          ';'
        continue
      }
      idx = cookie.indexOf('SessionID=')
      if (idx != -1) {
        sessionCookie +=
          (cookie.length > 0 ? ' ' : '') +
          'SessionID=' +
          cookie.substring(idx + 10) +
          ';'
        continue
      }
    }
    return sessionCookie
  })
}

// ============================== POST ==============================
const BGGUPLOAD_URL = 'https://boardgamegeek.com/geekplay.php'
export function postPlay() {
  const game = { bggId: 195856 }
  const players = [
    {
      name: 'Freyzer',
      username: 'Freyzer',
      score: 100,
      win: true,
    },
    {
      name: 'Oborus',
      username: '',
      score: 100,
      win: null,
    },
  ]
  const play = {
    objectid: game.bggId,
    date: '',
    location: 'Oborus',
    playdate: '',
    players: players,
    ajax: 1,
    objecttype: 'thing',
    action: 'save',
    quantity: 1,
    length: 0,
  }

  fetch('https://www.boardgamegeek.com/geeklist/item/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(play),
  }).then((res) => {
    console.log(res.status)
  })

  loginBGG({ username: 'Freyzer', password: 'Freyzer0.' })
    .then((coockie) => {
      return fetch(BGGUPLOAD_URL, {
        method: 'POST',
        headers: {
          cookie: coockie,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(play),
      })
    })
    .then((res) => {
      if (res.status >= 500) console.error('ERROR DEL SERVIDOR')
      else if (res.status >= 400) console.error('ERROR DE CONEXION')
      else console.log('SE HA PUBLICADO LA PLAY')
    })
    .catch((e) => console.error(e))
}
