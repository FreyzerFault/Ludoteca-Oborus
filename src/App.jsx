import './styles/App.css'

import { useState } from 'react'

// Componentes React
import { SearchBar } from './components/SearchBar'
import { BoardGameCard } from './components/BoardGameCard'
import { DataList } from './components/DataList'
import { BoardGameCollection } from './components/BoardGameCollection'

import { getCollection } from './services/bgg'
import { getCollectionMock } from './services/bggMock'

function App() {
  const [mock, setMock] = useState(true)

  return (
    <main>
      <h1>ULTRA-BUSCADOR de JUEGOS DE MESA</h1>

      <SearchBar
        gridDisplay={true}
        ComponentCardTemplateForResult={BoardGameCard}
      />

      <section>
        <BoardGameCollection mock={mock} showExpansions username='oborus' />
      </section>
    </main>
  )
}

export default App
