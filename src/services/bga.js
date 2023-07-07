// URL raiz de la API
const URL_BGA_API = 'https://api.boardgameatlas.com/api/'

// Client_id = Contraseña para autentificarse
const URL_BGA_API_CLIENT_ID = 'WnTK7L9hmX'

// Comando de busqueda con el client_id ya colocado
const URL_BGA_API_SEARCH_COMMAND = `search?client_id=${URL_BGA_API_CLIENT_ID}&`
const URL_BGA_API_LISTS_COMMAND = `lists?client_id=${URL_BGA_API_CLIENT_ID}&`

export const DEFAULT_SEARCH_LIMIT = 30

// ============================ URL Building ============================
function buildSearchUrl({
  searchTerm,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  return (
    URL_BGA_API +
    URL_BGA_API_SEARCH_COMMAND +
    `name=${searchTerm}&limit=${limit}&skip=${skip}&fuzzy_match=true`
  )
}

function buildSearchCollectionUrl({
  collection_id,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  return (
    URL_BGA_API +
    URL_BGA_API_SEARCH_COMMAND +
    `list_id=${collection_id}&limit=${limit}&skip=${skip}&fuzzy_match=true`
  )
}

function buildCollectionsUrl({ username = 'Oborus' }) {
  return URL_BGA_API + URL_BGA_API_LISTS_COMMAND + `username=${username}`
}

// ============================ FETCHING ============================
// Fetching a la API por termino a buscar, limite de resultados y salto para paginacion
async function fetchSearch({
  searchTerm,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  const res = await fetch(buildSearchUrl({ searchTerm, limit, skip }))
  const data = await res.json()
  return data
}

// Utiliza el mismo fetching de la Búsqueda pero buscar por list_id, en vez de por nombre del juego
async function fetchCollectionSearch({
  collection_id,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  const res = await fetch(
    buildSearchCollectionUrl({ collection_id, limit, skip })
  )
  const data = await res.json()
  return data
}

// Fetching a la API por usuario
// Devuelve TODAS las listas que tiene el usuario ('Owned', 'Wishlist'...)
async function fetchLists({ username }) {
  return fetch(buildCollectionsUrl({ username }))
    .then((data) => {
      return data.json()
    })
    .catch((err) => {
      throw err
    })
}

// ============================ Public Getters ============================
export async function getBoardGamesSearch({
  search,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  if (!search || search.length === 0) return null

  return fetchSearch({ searchTerm: search, limit, skip })
    .then((data) => validateData(data))
    .then((data) => processDataByBoardGameList(data))
    .catch((e) => {
      throw e
    })
}

export async function getCollectionSearch({
  collection_id,
  limit = DEFAULT_SEARCH_LIMIT,
  skip = 0,
}) {
  return fetchCollectionSearch({ collection_id, limit, skip })
    .then((data) => validateData(data))
    .then((data) => processDataByBoardGameList(data))
    .catch((e) => {
      throw e
    })
}

export async function getCollections({ username = 'Oborus' }) {
  return fetchLists({ username })
    .then((data) => validateData(data))
    .then((data) => processDataByUserCollections(data))
    .catch((e) => {
      throw e
    })
}

// =========================== Procesamiento de Datos ===========================

export function validateData(data) {
  // HAY DATOS?
  if (!data) throw new Error('No se recibió respuesta')

  // Contiene un ERROR
  if ('error' in data) throw new Error(data.error.message)

  return data
}

export function processDataByBoardGameList(data) {
  // No tiene datos necesarios, como el count
  if (!('count' in data)) throw new Error('Datos mal estructurados')

  // No hay resultados:
  const count = data.count
  if (count === 0) return []

  // Procesar los datos al formato que quiero
  const boardGames = data.games
  const mappedGames = boardGames?.map((game) => ({
    id: game.id,
    name: game.name,
    thumbnailUrl: game.thumb_url,
    imageUrl: game.image_url,
    year: game.year_published,
  }))

  return mappedGames
}

export function processDataByUserCollections(data) {
  // No tiene datos necesarios
  if (!('lists' in data)) throw new Error('Datos mal estructurados')

  // No hay resultados:
  const lists = data.lists
  if (lists.length === 0) return []

  // Procesar los datos al formato que quiero
  const listsMapped = lists?.map((list) => ({
    id: list.id,
    name: list.name,
    gameCount: list.gameCount,
    thumbnailUrl: list.thumbUrl,
    imageUrl: list.imageUrl,
    urlBGA: list.url,
  }))

  return listsMapped
}

// ================================ OAuth ====================================
export async function authenticate({ username, password }) {
  return fetch(
    `https://api.boardgameatlas.com/oauth/authorize?response_type=code&client_id=${URL_BGA_API_CLIENT_ID}&redirect_uri=http://localhost:5173/`,
    {
      method: 'GET',
    }
  ).then((res) => {
    console.log(res.headers.get('code'))
  })
}
