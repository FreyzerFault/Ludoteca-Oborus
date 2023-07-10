import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react'

import { getCollectionsMock } from '../services/bgaMock'
import { getCollections } from '../services/bga'
import { BoardGameCollectionViewBGA } from './BoardGameCollectionView'

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
              <BoardGameCollectionViewBGA
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
