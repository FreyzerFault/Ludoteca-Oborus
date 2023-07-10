import PropTypes from 'prop-types'

import { useCollection } from '../hooks/useCollection'
import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'
import { useEffect, useState, useRef } from 'react'

import { getCollectionSearchMock } from '../services/bgaMock'
import { getCollectionSearch } from '../services/bga'

export function BoardGameCollectionView({
  username = 'oborus',
  showExpansions = true,
  mock: initialMock = false,
}) {
  const [collection, mock, setMock] = useCollection({
    mock: initialMock,
    showExpansions: showExpansions,
    username: username,
  })

  return (
    <>
      <section className='collection-header'>
        <section onClick={() => setMock(!mock)} className='mock-activator'>
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

BoardGameCollectionView.propTypes = {
  username: PropTypes.string,
  showExpansions: PropTypes.bool,
  mock: PropTypes.bool,
}

export function BoardGameCollectionViewBGA({
  collection_id,
  collectionName,
  // TODO permitir filtrar por expansiones o no
  // eslint-disable-next-line no-unused-vars
  showExpansions = true,
  mock = true,
}) {
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
  }, [collection_id, mock])

  return (
    <>
      <h1 className='collection-header'>{collectionName}</h1>
      <section className='grid search-results'>
        <DataList ComponentTemplate={BoardGameCard} data={collection} />
      </section>
    </>
  )
}

BoardGameCollectionViewBGA.propTypes = {
  collection_id: PropTypes.any.isRequired,
  collectionName: PropTypes.string.isRequired,
  showExpansions: PropTypes.bool,
  mock: PropTypes.bool,
}
