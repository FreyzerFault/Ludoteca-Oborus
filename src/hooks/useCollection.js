import { useState, useEffect, useRef } from 'react'
import {
  GetCollection,
  GetCollectionDetailed,
  GetCollectionDetailedMock,
  GetCollectionMock,
} from '../services/bgg/bggCollection'
import { ColType, ItemType } from '../services/bgg/bgg'

export function useCollection({
  username = 'oborus',
  showExpansions = true,
  mock = false,
  colFilter = ColType.Owned,
  detailed = false,
}) {
  const [collection, setCollection] = useState(null)

  const prevCollection = useRef(collection)

  useEffect(() => {
    const getCollectionFunction = mock
      ? detailed
        ? GetCollectionDetailedMock
        : GetCollectionMock
      : detailed
      ? GetCollectionDetailed
      : GetCollection
    getCollectionFunction({
      username: username,
      excludeSubtype: showExpansions ? '' : ItemType.Expansion,
      colFilter,
    })
      .then((data) => {
        if (prevCollection.current === data) return

        prevCollection.current = data
        return setCollection(data)
      })
      .catch((e) => console.error(e))
  }, [username, mock, showExpansions, colFilter, detailed])

  return { collection }
}
