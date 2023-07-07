import './styles/App.css'

import { useState } from 'react'

import { getCollection } from './services/bgg'
import { getCollectionMock } from './services/bggMock'

// Componentes React
import { SearchBar } from './components/SearchBar'
import { BoardGameCard } from './components/BoardGameCard'
import { DataList } from './components/DataList'
import { BoardGameCollection } from './components/BoardGameCollection'
import { BoardGameCollectionView } from './components/BoardGameCollectionView'

import { postPlay } from './services/bgg'
import { authenticate } from './services/bga'

function App() {
  const [mock, setMock] = useState(true)

  return (
    <main>
      <section>
        <button
          onClick={(e) =>
            // authenticate({ username: 'Freyzer', password: 'Freyzer0.' })
            postPlay()
          }
        >
          TEST
        </button>
      </section>

      {/* <h1>ULTRA-BUSCADOR de JUEGOS DE MESA</h1>

      <SearchBar
        gridDisplay={true}
        ComponentCardTemplateForResult={BoardGameCard}
      />

      <section>
        <BoardGameCollection username={'Oborus'}></BoardGameCollection>
      </section>

      <section>
        <BoardGameCollectionView mock={mock} showExpansions username='Oborus' />
      </section> */}
    </main>
  )
}

export default App
