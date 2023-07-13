/* eslint-disable no-unused-vars */
import { xml2Json } from '../../utils/xml2json'

import { RetryError } from '../../utils/retry'
import { MOCK_DATA_URL } from '../localData'

// URL raiz de la API
export const URL_BGG_API = 'https://api.geekdo.com/xmlapi2/'

const URL_BGG_API_USERS = 'https://api.geekdo.com/xmlapi2/user'
const URL_BGG_API_PLAYS = 'https://api.geekdo.com/xmlapi2/plays'

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

export function SortGamesBy({ games, sortBy }) {
  return games.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1))
}

export function SortGamesByVotes(games) {
  return games.sort((a, b) => (a.votes < b.votes ? 1 : -1))
}

export function SortGamesById(games) {
  return games.sort((a, b) => (a.id < b.id ? 1 : -1))
}

export function SortGamesByName(games) {
  return games.sort((a, b) => (a.name < b.name ? 1 : -1))
}

export function SortGamesByDateAdded(games) {
  return games.sort((a, b) => {
    //console.log(Date.parse(a.lastModified) - Date.parse(b.lastModified))
    return Date.parse(b.lastModified) - Date.parse(a.lastModified)
  })
}

export async function parseBggData(data) {
  return data
    .text()
    .then((data) => {
      data = xml2Json(data)

      // HAY DATOS?
      if (!data) throw new Error('No se recibió respuesta')

      // Hay un mensaje (supongo que de error)?
      if ('message' in data) throw new RetryError(data.message)

      // Existe la propiedad "items" en la data?
      if (!('items' in data))
        throw new Error('Respuesta no reconocida: ' + data)

      // Los datos estan correctos
      return data
    })
    .catch((err) => {
      throw err
    })
}

export function validateData(data) {
  // HAY DATOS?
  if (!data) throw new Error('No se recibió respuesta')

  if ('message' in data) throw new RetryError()

  // Existe la propiedad "totalitems" en la data
  if (!('items' in data)) throw new Error('Respuesta no reconocida: ' + data)

  return data
}

// ============================== MOCK ==============================
// eslint-disable-next-line no-unused-vars
const emptyMockData = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockNoResults.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
}

// eslint-disable-next-line no-unused-vars
const processingMessageMock = async function () {
  return fetch(MOCK_DATA_URL + 'BGGmockProcessing.xml')
    .then((res) => res.text())
    .then((xml) => xml2Json(xml))
    .catch((e) => () => {
      throw e
    })
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
