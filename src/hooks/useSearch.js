import { useState, useEffect } from 'react'

// SERVICES
import { GetBoardGames, GetBoardGamesMock } from '../services/bgg/bggThing'
import { Search, SearchMock } from '../services/bgg/bggSearch'
import { NoDataError, SortGamesBy } from '../utils/sort'

// Gestiona la busqueda de un termino
// Pasale la funcion que busca para que actualice los resultados

export function useSearch({ maxResults = 24, mock, myCollection = [] }) {
  const [queryData, setQueryData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setError(null)
    setQueryData(null)

    if (!search || search.length === 0) return

    setLoading(true)

    // Se elige una funcion u otra dependiendo de si se usan datos falsos o no
    const searchQueryFunc = mock ? SearchMock : Search
    const getBoardGamesFunc = mock ? GetBoardGamesMock : GetBoardGames

    searchQueryFunc({ search })
      .then((data) =>
        getBoardGamesFunc({ gameIds: data.map((item) => item.id) })
      )
      .then((data) => SortGamesBy({ data }))
      .then((data) => {
        // Se acota al max de resultados
        data = data.slice(0, maxResults)

        // Se añade la priopiedad owned si esta dentro de la coleccion dada
        data = addOwnedTag(data, myCollection)

        setQueryData(data)
      })
      .catch((e) => {
        setError(e)
        console.error(e)
        if (e instanceof NoDataError) setQueryData([])
        else setQueryData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [mock, maxResults, myCollection, search])

  return { setSearch, queryData, error, loading }
}

function addOwnedTag(data, ownedCollection) {
  if (ownedCollection.length > 0) {
    return data.map((item) => {
      return (item = {
        ...item,
        // Se añade la propiedad owned a cada item que este dentro de mi coleccion
        owned: ownedCollection.some((colItem) => colItem.id === item.id),
      })
    })
  }
}
