import { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import {
  SortableProperty,
  SortableProperties,
  SortByProperty,
} from '../utils/sort'

export function useSort({
  data,
  initialSortableProp = SortableProperties.votes,
}) {
  const [sortableProp, setSortableProp] = useState(initialSortableProp)
  const [sortOrder, setSortOrder] = useState(initialSortableProp?.defaultOrder)

  const setInverseOrder = useCallback(() => {
    setSortOrder(-sortOrder)
  }, [sortOrder])

  const sortedData = useMemo(
    () => SortByProperty({ data, sortableProp, sortOrder }),
    [data, sortableProp, sortOrder]
  )

  return {
    sortedData,
    sortableProp,
    sortOrder,

    setSortableProp,
    setSortOrder,
    setInverseOrder,
  }
}

useSort.propTypes = {
  data: PropTypes.array.isRequired,
  initialSortType: PropTypes.instanceOf(SortableProperty),
}
