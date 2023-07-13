import { PropTypes } from 'prop-types'
import 'boxicons'
import { useState, useEffect, useRef } from 'react'

export function SearchInput({ searchAsTyping = false, onSearch }) {
  // STATES
  const [searchValue, setSearchValue] = useState('')

  // EFFECTS
  useEffect(() => {
    lastSearch.current = searchValue
    onSearch(searchValue)
  }, [onSearch, searchValue])

  // REFS
  const lastSearch = useRef('')

  // Submit del Formulario
  const handleSubmit = (event) => {
    // Previene la actualizacion de la pagina
    event.preventDefault()

    const searchInputValue = event.target.search.value

    setSearchValue(searchInputValue)
  }

  // Cambio en el input de Busqueda => Actualiza el estado asociado
  const handleSearchInputChange = (event) => {
    if (!searchAsTyping) return

    const newValue = event.target.value

    // Se puede controlar que pone el usuario, no dejandole si no es valido, asi:
    if (newValue.startsWith(' ')) return

    // No busca si es el mismo termino
    if (newValue === lastSearch.current) return

    setSearchValue(event.target.value)
  }

  return (
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
