import { useState, useEffect, useRef } from 'react'

// Gestiona la busqueda de un termino
// Pasale la funcion que busca para que actualice los resultados

export function useSearchAsync({
  initialSearch,
  maxResults = 10,
  queryFunction = () => {},
  queryFunctionMock = () => {},
  mock,
  myCollection = [],
}) {
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [queryData, setQueryData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const lastSearch = useRef(initialSearch)

  useEffect(() => {
    setError(null)

    if (!searchValue || searchValue.length === 0) {
      setQueryData(null)
      return
    }

    // Evitar buscar el mismo termino mas veces
    {
      if (!mock && searchValue === lastSearch.current) {
        return
      }

      lastSearch.current = searchValue
    }

    setLoading(true)

    // Se elige una funcion u otra dependiendo de si se usan datos falsos o no
    const promiseQuery = mock
      ? queryFunctionMock({ search: searchValue, maxResults })
      : queryFunction({ search: searchValue, maxResults })

    promiseQuery
      .then((data) => {
        setQueryData(addOwnedTag(data, myCollection))
      })
      .catch((e) => {
        setError(e)
        console.error(e)
        setQueryData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [
    searchValue,
    mock,
    queryFunctionMock,
    queryFunction,
    maxResults,
    myCollection,
  ])

  return { searchValue, setSearchValue, queryData, error, loading }
}

function addOwnedTag(data, ownedCollection) {
  if (ownedCollection.length > 0) {
    return data.map((item) => {
      console.log(ownedCollection.some((colItem) => colItem.id === item.id))
      return (item = {
        ...item,
        // Se añade la propiedad owned a cada item que este dentro de mi coleccion
        owned: ownedCollection.some((colItem) => colItem.id === item.id),
      })
    })
  }
}

export function useSearch({ initialSearch, queryFunction = () => {} }) {
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [queryData, setQueryData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    setQueryData(null)

    if (!searchValue || searchValue.length === 0) {
      return
    }

    let res
    try {
      res = queryFunction(searchValue)
    } catch (e) {
      setError(e)
      return
    }
    setQueryData(res)
  }, [queryFunction, searchValue])

  return { searchValue, setSearchValue, queryData, error }
}
