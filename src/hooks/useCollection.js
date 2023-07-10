import { useState, useEffect } from 'react'
import { getCollection, ColType, ItemType } from '../services/bgg'
import { getCollectionMock } from '../services/bggMock'

export function useCollection({
  username = 'oborus',
  showExpansions = true,
  mock = false,
  colFilter = ColType.Owned,
}) {
  const [collection, setCollection] = useState([])

  useEffect(() => {
    const getCollectionFunction = mock ? getCollectionMock : getCollection
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
