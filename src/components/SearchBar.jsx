// SVG
import PropTypes from 'prop-types'
import { SearchIcon } from './Icons/searchIcon'

// COMPONENTS
import { DataList } from './DataList'
import Spinner from 'react-spinners/RingLoader'

// HOOKS
import { getBoardGamesSearch } from '../services/bgg'
import { getBoardGamesSearchMock } from '../services/bggMock'
import { useSearchAsync } from '../hooks/useSearch'

export function SearchBar({
  maxResults = 12,
  ComponentCardTemplateForResult,
  mock = false,
  gridDisplay = false,
  searchAsTyping = false, // Buscar mientras se escribe
}) {
  // Custom HOOKS
  const { searchValue, setSearchValue, queryData, error, loading } =
    useSearchAsync({
      initialSearch: '',
      maxResults,
      queryFunction: getBoardGamesSearch,
      queryFunctionMock: getBoardGamesSearchMock,
      mock,
    })

  // REFs (Variables que no se resetean en cada render, persisten)
  // const inputRef = useRef()

  // Submit del Formulario
  const handleSubmit = (event) => {
    // Previene la actualizacion de la pagina
    event.preventDefault()
    // const formFields = Object.fromEntries(new window.FormData(event.target))
    // const searchTerm = formFields.search

    const searchInputValue = event.target.search.value

    setSearchValue(searchInputValue)
  }

  // Cambio en el input de Busqueda => Actualiza el estado asociado
  const handleSearchInputChange = (event) => {
    if (!searchAsTyping) return

    // Se puede controlar que pone el usuario no dejandole asi:
    if (event.target.value.startsWith(' ')) return

    setSearchValue(event.target.value)
  }

  // COMPONENTE
  return (
    <>
      <section className='search-area'>
        <form onSubmit={handleSubmit}>
          <div className='search-bar'>
            <input
              value={searchAsTyping ? searchValue : undefined}
              onChange={handleSearchInputChange}
              name='search'
              type='text'
              placeholder='Catan, Virus, Monopoly, ...'
            />

            <button type='submit'>
              <SearchIcon className='search-icon' />
            </button>
          </div>
        </form>

        {/* Resultados de la búsqueda */}
        <section className={`search-results ${gridDisplay ? 'grid' : ''}`}>
          <DataList
            data={queryData}
            ComponentTemplate={ComponentCardTemplateForResult}
          />

          {error && (
            <section className='error'>
              <span>⚠ ⚠ ⚠</span>
              <span className='text'>{error.message}</span>
              <span>⚠ ⚠ ⚠</span>
            </section>
          )}
        </section>
      </section>

      <section className='spinner-container'>
        <Spinner
          className='spinner'
          color='orange'
          loading={loading}
          size={200}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      </section>
    </>
  )
}

SearchBar.propTypes = {
  ComponentCardTemplateForResult: PropTypes.elementType.isRequired,
  gridDisplay: PropTypes.bool,
  mock: PropTypes.bool,
  searchAsTyping: PropTypes.bool,
  maxResults: PropTypes.number,
}
