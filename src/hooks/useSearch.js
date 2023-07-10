import { useState, useEffect, useRef } from 'react'

// Gestiona la busqueda de un termino
// Pasale la funcion que busca para que actualice los resultados

export function useSearchAsync({
  initialSearch,
  mock,
  queryFunction = () => {},
  queryFunctionMock = () => {},
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

    console.log('MOCK: ', mock)
    // Se elige una funcion u otra dependiendo de si se usan datos falsos o no
    const promiseQuery = mock
      ? queryFunctionMock({ search: searchValue })
      : queryFunction({ search: searchValue })

    promiseQuery
      .then((data) => {
        setQueryData(data)
      })
      .catch((e) => {
        setError(e)
        setQueryData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchValue, mock, queryFunctionMock, queryFunction])

  return { searchValue, setSearchValue, queryData, error, loading }
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
