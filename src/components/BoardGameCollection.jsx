import { useEffect, useState } from 'react'

import { getCollectionsMock } from '../services/bgaMock'
import { getCollections } from '../services/bga'
import {
  BoardGameCollectionView,
  BoardGameCollectionViewBGA,
} from './BoardGameCollectionView'

export function BoardGameCollection({ username }) {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getCollectionsMock({ username })
      .then((res) => {
        setCollections(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <>
      <h1>Colección de {username}</h1>
      {collections.length > 0 && (
        <section>
          {collections.map((col) => (
            <BoardGameCollectionViewBGA
              key={col.id}
              collection_id={col.id}
              collectionName={col.name}
              mock={false}
              showExpansions
              username='Oborus'
            />
          ))}
        </section>
      )}
    </>
  )
}
