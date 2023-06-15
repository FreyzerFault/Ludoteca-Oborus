// URL raiz de la API
const URL_BGA_API = 'https://api.boardgameatlas.com/api/'

// Client_id = Contraseña para autentificarse
const URL_BGA_API_CLIENT_ID = 'WnTK7L9hmX'
const URL_BGA_API_CLIENT_ID_alt = 'JLBr5npPhV'

// Comando de busqueda con el client_id ya colocado
const URL_BGA_API_SEARCH_COMMAND = `search?client_id=${URL_BGA_API_CLIENT_ID}&`

function buildUrl({ searchTerm, limit = 5, skip = 0 }) {
  return (
    URL_BGA_API +
    URL_BGA_API_SEARCH_COMMAND +
    `name=${searchTerm}&limit=${limit}&skip=${skip}&fuzzy_match=true`
  )
}

// Fetching a la API por termino a buscar, limite de resultados y salto para paginacion
export async function fetchSearch({ searchTerm, limit = 1, skip = 0 }) {
  const res = await fetch(buildUrl({ searchTerm, limit, skip }))
  const data = await res.json()
  return data
}

export async function getBoardGamesSearch({ search }) {
  if (!search || search.length === 0) return null

  return fetchSearch({ searchTerm: search, limit: 30 })
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

// =========================== Procesamiento de Datos ===========================

export function validateData(data) {
  // HAY DATOS?
  if (!data) throw new Error('No se recibió respuesta')

  // Contiene un ERROR
  if (data.error) throw new Error(data.error.message)

  // No tiene datos necesarios, como el count
  if (data.count == undefined) throw new Error('Datos mal estructurados')

  return data
}

export function processData(data) {
  // No hay resultados:
  const count = data.count
  if (count === 0) return []

  // Procesar los datos al formato que quiero
  const boardGames = data.games
  const mappedGames = boardGames?.map((game) => ({
    id: game.id,
    name: game.name,
    thumbnail: game.thumb_url,
    year: game.year_published,
  }))

  return mappedGames
}
