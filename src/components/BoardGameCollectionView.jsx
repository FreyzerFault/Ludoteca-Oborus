import React from 'react'
import { useCollection } from '../hooks/useCollection'
import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'
import { useEffect, useState, useRef } from 'react'

import {
  getCollectionsMock,
  getCollectionSearchMock,
} from '../services/bgaMock'
import { getCollections, getCollectionSearch } from '../services/bga'

export function BoardGameCollectionView({
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

export function BoardGameCollectionViewBGA({
  collection_id,
  collectionName,
  showExpansions = true,
  mock: useMockData = true,
}) {
  const [mock, setMock] = useState(useMockData)
  const [collection, setCollection] = useState([])

  const lastColId = useRef()

  useEffect(() => {
    if (lastColId.current === collection_id) return

    const colGetterPromise = mock
      ? getCollectionSearchMock({ collection_id: collection_id })
      : getCollectionSearch({ collection_id: collection_id })

    colGetterPromise
      .then((col) => {
        lastColId.current = col
        setCollection(col)
      })
      .catch((e) => {
        throw e
      })
  }, [mock])

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
        <h1>{collectionName}</h1>
      </section>
      <section className='grid search-results'>
        <DataList ComponentTemplate={BoardGameCard} data={collection} />
      </section>
    </>
  )
}
