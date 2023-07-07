import './styles/App.css'

import { useEffect, useState } from 'react'

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
      {/* // Activa los Datos de Prueba, esconder en prod */}
      <section onClick={(e) => setMock(!mock)} className='mock-activator'>
        <span>Datos de prueba</span>
        <input
          type='checkbox'
          checked={mock}
          value={mock}
          onChange={(e) => setMock(e.target.checked)}
        />
      </section>

      <h1>ULTRA-BUSCADOR de JUEGOS DE MESA</h1>

      <SearchBar
        gridDisplay={true}
        ComponentCardTemplateForResult={BoardGameCard}
        mock={mock}
      />

      <section>
        <BoardGameCollection
          mock={mock}
          username={'Oborus'}
        ></BoardGameCollection>
      </section>

      {false && (
        <section>
          <button
            onClick={(e) =>
              // authenticate({ username: 'Freyzer', password: 'Freyzer0.' })
              postPlay()
            }
          >
            TEST POST Request
          </button>
        </section>
      )}
    </main>
  )
}

export default App
