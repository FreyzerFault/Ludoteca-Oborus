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
    thumbnailUrl: item.thumbnail,
    imageUrl: item.image,
    year: item.yearpublished,
    subtype: item._subtype,
  }))
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
    let sessionCoockie = ''

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
    return sessionCoockie
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
