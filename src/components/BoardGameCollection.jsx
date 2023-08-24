import PropTypes from 'prop-types'
import 'boxicons'

import { SortOrder } from '../utils/sort'

import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'
import { useSort } from '../hooks/useSort'
import { SortableProperties, SortableProperty } from '../utils/sort'
import { LoadingSpinner } from './icons/LoadingSpinner'
import { OborusLogo, OborusLogoWithBackground } from './icons/OborusLogo'

export function BoardGameCollection({
  username = 'oborus',
  collection,
  initialSortableProp = SortableProperties.dateAdded,
}) {
  const {
    sortedData,
    sortableProp,
    sortOrder,

    setSortableProp,
    setSortOrder,
    setInverseOrder,
  } = useSort({
    data: collection,
    initialSortableProp,
  })

  const handleSort = (e) => {
    const newSort = SortableProperties[e.target.value]
    setSortableProp(newSort)
    setSortOrder(newSort.defaultOrder)
  }

  const handleOrder = (e) => {
    setInverseOrder()
  }

  return (
    <div className='boardgame-collection' data-testid='collection-container'>
      {collection !== null ? (
        <section className='collection-header'>
          <h1 className='collection-title'>
            {collection.length}
            <span>
              {' '}
              Juegos en {username} <OborusLogoWithBackground />
            </span>
          </h1>
          <SelectSort
            handleSort={handleSort}
            handleOrder={handleOrder}
            sortChecked={sortableProp}
            sortOrder={sortOrder}
          />
        </section>
      ) : (
        <section className='spinner-container'>
          <LoadingSpinner loading={true} />
        </section>
      )}
      {collection && (
        <DataList
          className='search-results'
          ComponentTemplate={BoardGameCard}
          data={sortedData}
        />
      )}
    </div>
  )
}

BoardGameCollection.propTypes = {
  username: PropTypes.string,
  collection: PropTypes.array,
  initialSortableProp: PropTypes.instanceOf(SortableProperty),
}

function SelectSort({ handleSort, handleOrder, sortChecked, sortOrder }) {
  return (
    <section className='sort'>
      <button onClick={handleOrder}>
        {sortOrder === SortOrder.Ascending ? (
          <box-icon name={'sort-down'} color='white' size='35px'></box-icon>
        ) : (
          <box-icon name={'sort-up'} color='white' size='35px'></box-icon>
        )}
      </button>
      <select
        name='sort'
        className='sort-select'
        defaultValue={sortChecked}
        onChange={handleSort}
      >
        {Object.keys(SortableProperties).map((sortableKey) => (
          <option className='sort-option' value={sortableKey} key={sortableKey}>
            {SortableProperties[sortableKey].name}
          </option>
        ))}
      </select>
    </section>
  )
}

SelectSort.propTypes = {
  handleSort: PropTypes.func,
  handleOrder: PropTypes.func,
  sortChecked: PropTypes.instanceOf(SortableProperty),
  sortOrder: PropTypes.oneOf(Object.values(SortOrder)),
}
