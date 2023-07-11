import { useState, useEffect } from 'react'
import { GetCollection } from '../services/bgg/bggCollection'
import { ColType, ItemType } from '../services/bgg/bgg'
import { GetCollectionMock } from '../services/bgg/bggCollection'

export function useCollection({
  username = 'oborus',
  showExpansions = true,
  mock = false,
  colFilter = ColType.Owned,
}) {
  const [collection, setCollection] = useState([])

  useEffect(() => {
    const getCollectionFunction = mock ? GetCollectionMock : GetCollection
    getCollectionFunction({
      username: username,
      excludeSubtype: showExpansions ? '' : ItemType.Expansion,
      colFilter,
    })
      .then((data) => setCollection(data))
      .catch((e) => console.error(e))
  }, [username, mock, showExpansions, colFilter])

  return [collection]
}
