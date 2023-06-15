// SVG
import { SearchIcon } from './Icons/searchIcon'

// COMPONENTS
import { DataList } from './DataList'
import Spinner from 'react-spinners/RingLoader'

// HOOKS
import { getBoardGamesSearch } from '../services/bga'
import { getBoardGamesSearchMock } from '../services/bgaMock'
import { useSearchAsync } from '../hooks/useSearch'

// MOCK de datos
const useMock = false

export function SearchBar({
  gridDisplay = false,
  ComponentCardTemplateForResult,
}) {
  // Custom HOOKS
  const { searchValue, setSearchValue, queryData, error, loading } =
    useSearchAsync(
      {
        initialSearch: '',
        queryFunction: (search) =>
          useMock
            ? getBoardGamesSearchMock({ search: search })
            : getBoardGamesSearch({ search: search }),
      }
      // FETCHING de datos por el valor de searchValue
    )

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
              // ref={inputRef} // (para consultarlo en cualquier momento)

              // ============= DESCOMENTA ESTO PARA ACTUALIZAR A TIEMPO REAL ==================
              // value={searchValue}
              // onChange={handleSearchInputChange}
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
