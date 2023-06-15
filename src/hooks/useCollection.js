import { useState, useEffect } from 'react'
import { getCollection } from '../services/bgg'
import { getCollectionMock } from '../services/bggMock'

export function useCollection({
  showExpansions = true,
  username = 'oborus',
  initialMock = true,
}) {
  const [collection, setCollection] = useState([])
  const [mock, setMock] = useState(initialMock)

  const updateCollection = () => {
    const getCollectionFunction = mock ? getCollectionMock : getCollection
    getCollectionFunction({
      username: username,
      excludeSubtype: showExpansions ? '' : 'boardgameexpansion',
    })
      .then((data) => setCollection(data))
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    updateCollection(initialMock)
  }, [mock])

  return [collection, updateCollection, mock, setMock]
}
