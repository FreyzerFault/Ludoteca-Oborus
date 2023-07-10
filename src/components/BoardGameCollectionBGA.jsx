import { PropTypes } from 'prop-types'
import { useEffect, useRef, useState } from 'react'

// COMPONENTS
import { DataList } from './DataList'
import { BoardGameCard } from './BoardGameCard'

// SERVICES
import {
  getCollectionsMock,
  getCollectionSearchMock,
} from '../services/bgaMock'
import { getCollections, getCollectionSearch } from '../services/bga'

// Muestra todas las Colecciones de un Usuarios
export function BoardGameCollection({ mock = false, username }) {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    if (mock) {
      getCollectionsMock({ username })
        .then((res) => {
          setCollections(res)
        })
        .catch((err) => {
          console.error(err)
        })
      return
    }

    getCollections({ username })
      .then((res) => {
        setCollections(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [mock, username])

  return (
    <>
      <h1>Colección de {username}</h1>
      {collections.length > 0 && (
        <section>
          {collections
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((col) => (
              <BoardGameCollectionView
                key={col.id}
                collection_id={col.id}
                collectionName={col.name}
                mock={mock}
                showExpansions
                username='Oborus'
              />
            ))}
        </section>
      )}
    </>
  )
}

BoardGameCollection.propTypes = {
  mock: PropTypes.bool,
  username: PropTypes.string.isRequired,
}

// Vista de una Coleccion individual
function BoardGameCollectionView({
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

BoardGameCollectionView.propTypes = {
  collection_id: PropTypes.any.isRequired,
  collectionName: PropTypes.string.isRequired,
  showExpansions: PropTypes.bool,
  mock: PropTypes.bool,
}
