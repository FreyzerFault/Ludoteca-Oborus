import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  SortableProperty,
  SortableProperties,
  SortByProperty,
  NoDataError,
} from '../utils/sort'

export function useSort({
  data,
  initialSortableProp = SortableProperties.votes,
}) {
  const [sortedData, setSortedData] = useState(data)
  const [sortableProp, setSortableProp] = useState(initialSortableProp)
  const [sortOrder, setSortOrder] = useState(initialSortableProp?.defaultOrder)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const now = new Date(Date.now()).getMilliseconds()
    SortByProperty({
      data,
      sortableProp,
      sortOrder,
    })
      .then((newSortedData) => setSortedData(newSortedData))
      .catch((err) => {
        if (err instanceof NoDataError) return
        console.log(err)
      })
      .finally(() => {
        setLoading(false)

        console.log({
          timeToSort: `${new Date(Date.now()).getMilliseconds() - now} ms`,
        })
      })
  }, [data, sortableProp, sortOrder])

  const setInverseOrder = () => {
    setSortOrder(-sortOrder)
  }

  return [
    sortedData,
    sortableProp,
    sortOrder,

    loading,
    setSortableProp,
    setSortOrder,
    setInverseOrder,
  ]
}

useSort.propTypes = {
  data: PropTypes.array.isRequired,
  initialSortType: PropTypes.instanceOf(SortableProperty),
}
