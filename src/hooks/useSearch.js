import { useState, useEffect, useRef } from 'react'

// SERVICES
import { GetBoardGames, GetBoardGamesMock } from '../services/bgg/bggThing'
import { Search, SearchMock } from '../services/bgg/bggSearch'
import { SortByProperty, SortableProperties } from '../utils/sort'

class CancelError extends Error {}

// Gestiona la busqueda de un termino
// Pasale la funcion que busca para que actualice los resultados
export function useSearch({ maxResults = 24, mock, myCollection = [] }) {
  const [queryData, setQueryData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // La peticion de busqueda mas reciente (Pueden haber mas de una peticion en curso)
  // Hay que cancelar cualquiera que no sea la mas reciente
  const mostRecentRequest = useRef(null)

  useEffect(() => {
    setError(null)
    setQueryData(null)

    if (!search || search.length === 0) return

    // Esta cargando hasta que termine de procesarse la peticion de forma ASINCRONA
    setLoading(true)

    // Se elige una funcion u otra dependiendo de si se usan datos falsos o no
    const searchRequestFunc = mock ? SearchMock : Search
    const boardGamesRequestFunc = mock ? GetBoardGamesMock : GetBoardGames

    // Se guarda localmente y globalmente como la peticion mas reciente
    const thisRequest = (mostRecentRequest.current = searchRequestFunc({
      search,
    })
      .then((data) => {
        // Si esta peticion deja de ser la mas reciente no es relevante, por lo que la cancelamos
        if (thisRequest !== mostRecentRequest.current)
          throw new CancelError('Busqueda cancelada')

        // Hacemos una peticion extra para conseguir mas datos de cada juego encontrado
        return boardGamesRequestFunc({ gameIds: data.map((item) => item.id) })
      })
      .then((data) => {
        // Si esta peticion deja de ser la mas reciente no es relevante, por lo que la cancelamos
        if (thisRequest !== mostRecentRequest.current)
          throw new CancelError('Busqueda cancelada')

        // Primero los ordenamos por popularidad para que al acotar el numero de peticiones sean los mejores resultados
        data = SortByProperty({
          data,
          sortableProp: SortableProperties.votes,
        })

        // Se acota al max de resultados
        data = data.slice(0, maxResults)

        // Se añade la priopiedad owned si esta dentro de la coleccion dada
        data = addOwnedTag(data, myCollection)

        setQueryData(data)
      })
      .catch((e) => {
        // Si se ha cancelado no modificamos nada
        if (e instanceof CancelError) return

        // En caso de no cancelarse significa que ha habido un error, no mostramos nada
        console.error(e)
        setError(e)
        setQueryData(null)
      })
      .finally(() => {
        // Al terminar siempre deja de estar cargando
        setLoading(false)
      }))
  }, [mock, maxResults, myCollection, search])

  return { setSearch, queryData, error, loading }
}

// Se añade la propiedad OWNED a cada item que este dentro de mi coleccion
function addOwnedTag(data, ownedCollection) {
  if (ownedCollection?.length > 0) {
    return data.map((item) => {
      return (item = {
        ...item,
        owned: ownedCollection.some((colItem) => colItem.id === item.id),
      })
    })
  }
}
