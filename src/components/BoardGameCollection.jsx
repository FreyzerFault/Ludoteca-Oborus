import React from 'react'
import { useCollection } from '../hooks/useCollection'
import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'
import { useEffect, useState } from 'react'

export function BoardGameCollection({
  username = 'oborus',
  showExpansions = true,
  mock: initialMock = true,
}) {
  const [collection, updateCollection, mock, setMock] = useCollection({
    mock: initialMock,
    showExpansions: showExpansions,
    username: username,
  })

  return (
    <>
      <section className='collection-header'>
        <section onClick={(e) => setMock(!mock)} className='mock-activator'>
          <span>Datos de prueba</span>
          <input
            type='checkbox'
            checked={mock}
            value={mock}
            onChange={(e) => setMock(e.target.checked)}
          />
        </section>
        <h1>Juegos de Oborus</h1>
      </section>
      <section className='grid search-results'>
        <DataList ComponentTemplate={BoardGameCard} data={collection} />
      </section>
    </>
  )
}
