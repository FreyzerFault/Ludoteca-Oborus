import { URL_BGG_API, ItemType, parseBggData } from './bgg'
import { retry } from '../../utils/retry'

import { MOCK_DATA_URL } from '../localData'
import { delay } from '../../utils/time'

const URL_BGG_API_SEARCH = URL_BGG_API + 'search'

// Parametros para reintentar peticion
const MAX_REQUEST_TRIES = 3
const COOLDOWN_BETWEEN_REQUESTS = 1

export async function Search({
  search,
  includeExpansions = true,
  includeAccesories = true,
}) {
  if (!search || search.length === 0) return null

  // Tipos de items buscados
  const types = [ItemType.BoardGame]
  if (includeExpansions) types.push(ItemType.Expansion)
  if (includeAccesories) types.push(ItemType.Accesory)

  const args = `?query=${search}&type=${types.join(',')}`

  // Se reintenta la peticion cada segundo, hasta un maximo, si llega un RetryError
  return retry(
    () =>
      fetch(URL_BGG_API_SEARCH + args)
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
  if (data.items._total === 0) return []

  // Procesar los datos como un array si no lo es
  let boardGames = !Array.isArray(data.items.item)
    ? [data.items.item]
    : data.items.item

  // Filtro juegos repetidos con nombres alternativos, solo los nombres primarios (name._type === "primary")
  boardGames = RemoveDuplicates(boardGames)

  return boardGames?.map((item) => ({
    id: item?._id,
    type: item?._type,
    name: item?.name._value,
    year: item?.yearpublished?._value,
  }))
}

function RemoveDuplicates(boardGames) {
  const filteredGames = []

  boardGames.forEach((item) => {
    if (item.name._type !== 'primary') return

    // Si hay otro con el mismo ID y nombre Primary se filtra por tipo
    const collision = filteredGames.find((other) => other._id === item._id)
    if (collision) {
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
    } else filteredGames.push(item)
  })

  return filteredGames
}

// ========================== MOCK ==========================

export async function SearchMock() {
  return delay(300).then(() =>
    retry(
      () =>
        fetch(MOCK_DATA_URL + 'BGGmockSearchData.xml')
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
