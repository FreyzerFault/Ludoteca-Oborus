import PropTypes from 'prop-types'

// Icons
import { SearchInput } from './SearchInput'
import { LoadingSpinner } from './icons/LoadingSpinner'

// COMPONENTS
import { DataList } from './DataList'
import { ErrorMessage } from './ErrorMessage'
import { Toggle } from './Toggle'
import { BGGLogo } from './icons/BGGLogo'
import { OborusLogo } from './icons/OborusLogo'

// HOOKS
import { useState, useMemo } from 'react'
import { useSearch } from '../hooks/useSearch'

// UTILS
import { SortByProperty, SortableProperties } from '../utils/sort'

export function SearchBar({
  ComponentCardTemplateForResult,
  maxResults = 24,
  mock = false,
  myCollection = [],
}) {
  const [filterOwned, setFilterOwned] = useState(true)

  // Custom HOOKS
  const { setSearch, queryData, error, loading } = useSearch({
    maxResults,
    mock,
    myCollection,
    filterOwned,
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
        <section className='filters'>
          <span>{filterOwned ? 'Juegos de Oborus' : 'Todo'}</span>
          <Toggle
            defaultChecked
            checked={filterOwned}
            onChecked={setFilterOwned}
            uncheckedComponent={<BGGLogo />}
            checkedComponent={<OborusLogo />}
          />
        </section>

        <SearchInput onSearch={setSearch} />

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
  filterOwned: PropTypes.bool,
}
