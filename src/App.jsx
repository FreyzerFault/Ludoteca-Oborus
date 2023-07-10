import './styles/App.css'

import { useState } from 'react'

// Componentes React
import { SearchBar } from './components/SearchBar'
import { BoardGameCard } from './components/BoardGameCard'
import { BoardGameCollection } from './components/BoardGameCollectionBGG'

import { postPlay } from './services/bgg'

function App() {
  const [mock, setMock] = useState(false)

  return (
    <main>
      {/* // Activa los Datos de Prueba, esconder en prod */}
      {/* <section onClick={() => setMock(!mock)} className='mock-activator'>
        <span>Datos de prueba</span>
        <input
          type='checkbox'
          checked={mock}
          value={mock}
          onChange={(e) => setMock(e.target.checked)}
        />
      </section> */}

      <h1>LUDOTECA de OBORUS</h1>

      <SearchBar
        maxResults={24}
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
            onClick={() =>
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
