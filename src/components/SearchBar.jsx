import PropTypes from 'prop-types'

// Icons
import { SearchInput } from './SearchInput'
import { LoadingSpinner } from './icons/LoadingSpinner'

// COMPONENTS
import { DataList } from './DataList'
import { ErrorMessage } from './ErrorMessage'

// HOOKS
import { useSearch } from '../hooks/useSearch'
import { useMemo } from 'react'

// UTILS
import { SortByProperty, SortableProperties } from '../utils/sort'

export function SearchBar({
  ComponentCardTemplateForResult,
  maxResults = 24,
  mock = false,
  myCollection = [],
}) {
  // Custom HOOKS
  const { setSearch, queryData, error, loading } = useSearch({
    maxResults,
    mock,
    myCollection,
  })

  const sortedData = useMemo(
    () =>
      SortByProperty({
        data: queryData,
        sortableProp: SortableProperties.votes,
      }),
    [queryData]
  )

  // COMPONENTE
  return (
    <>
      <section className='search-area'>
        <SearchInput onSearch={setSearch} searchAsTyping />

        {/* Resultados de la búsqueda */}
        <DataList
          className={'search-results'}
          data={sortedData}
          ComponentTemplate={ComponentCardTemplateForResult}
        />

        <ErrorMessage error={error} />

        <section className='spinner-container'>
          <LoadingSpinner loading={loading} />
        </section>
      </section>
    </>
  )
}

SearchBar.propTypes = {
  ComponentCardTemplateForResult: PropTypes.elementType.isRequired,
  maxResults: PropTypes.number,
  mock: PropTypes.bool,
  myCollection: PropTypes.array,
}
