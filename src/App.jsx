import './styles/App.css'

import { useState } from 'react'
import { useCollection } from './hooks/useCollection'
import { ColType, postPlay } from './services/bgg/bgg'

// Componentes React
import { SearchBar } from './components/SearchBar'
import { BoardGameCard } from './components/BoardGameCard'
import { BoardGameCollection } from './components/BoardGameCollection'
import { OborusLogo } from './components/icons/OborusLogo'

const globalMock = false

function App() {
  const [mock, setMock] = useState(globalMock)

  const [collection] = useCollection({
    mock,
    showExpansions: true,
    username: 'Oborus',
    colFilter: ColType.Owned,
    detailed: true,
  })

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

      <OborusLogo />
      <h1> </h1>
      <h1>LUDOTECA OBORUS</h1>

      <SearchBar
        maxResults={24}
        ComponentCardTemplateForResult={BoardGameCard}
        mock={mock}
        myCollection={collection}
      />

      <BoardGameCollection
        collection={collection}
        username={'Oborus'}
      ></BoardGameCollection>

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
