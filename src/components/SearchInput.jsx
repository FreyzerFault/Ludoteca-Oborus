import { useState, useEffect, useRef, useCallback } from 'react'
import { PropTypes } from 'prop-types'

import 'boxicons'
import debounce from 'just-debounce-it'

const DEBOUNCE_COOLDOWN = 500

export function SearchInput({ searchAsTyping = false, onSearch }) {
  // STATES
  const [searchValue, setSearchValue] = useState('')

  // DEBOUNCE
  const searchDebounce = useCallback(
    debounce((search) => onSearch(search), DEBOUNCE_COOLDOWN),
    [onSearch]
  )

  // EFFECTS
  useEffect(() => {
    lastSearch.current = searchValue
    searchDebounce(searchValue)
  }, [searchDebounce, searchValue])

  // REFS
  const lastSearch = useRef('')

  // Submit del Formulario
  const handleSubmit = useCallback((event) => {
    // Previene la actualizacion de la pagina
    event.preventDefault()

    const searchInputValue = event.target.search.value

    setSearchValue(searchInputValue)
  }, [])

  const handleReset = useCallback((e) => {
    setSearchValue('')
  }, [])

  // Cambio en el input de Busqueda => Actualiza el estado asociado
  const handleSearchInputChange = useCallback(
    (event) => {
      if (!searchAsTyping) return

      const newValue = event.target.value

      // Se puede controlar que pone el usuario, no dejandole si no es valido, asi:
      if (newValue.startsWith(' ')) return

      // No busca si es el mismo termino
      if (newValue === lastSearch.current) return

      setSearchValue(newValue)
    },
    [lastSearch, searchAsTyping]
  )

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <div className='search-bar'>
        {searchValue && (
          <button type='reset' className='search-cancel'>
            <box-icon name='x' color='#fff' size='30px'></box-icon>
          </button>
        )}
        <input
          value={searchAsTyping ? searchValue : undefined}
          onChange={handleSearchInputChange}
          name='search'
          type='text'
          placeholder='Catan, Virus, Monopoly, ...'
        />

        <button type='submit' className='search-submit'>
          <box-icon name='search-alt-2' color='#fff' size='25px'></box-icon>
        </button>
      </div>
    </form>
  )
}

SearchInput.propTypes = {
  searchAsTyping: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
}
