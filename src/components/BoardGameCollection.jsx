import PropTypes from 'prop-types'
import 'boxicons'

import { SortOrder } from '../utils/sort'

import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'
import { useSort } from '../hooks/useSort'
import { SortableProperties, SortableProperty } from '../utils/sort'
import { LoadingSpinner } from './icons/LoadingSpinner'

export function BoardGameCollection({
  username = 'oborus',
  collection,
  initialSortableProp = SortableProperties.dateAdded,
}) {
  const [
    sortedData,
    sortableProp,
    sortOrder,
    loading,
    setSortableProp,
    setSortOrder,
    setInverseOrder,
  ] = useSort({
    data: collection,
    initialSortableProp,
  })

  const handleSort = (e) => {
    const newSort = SortableProperties[e.target.value]
    setSortableProp(newSort)
    setSortOrder(newSort.defaultOrder)
    // e.target.checked = true
  }

  const handleOrder = (e) => {
    setInverseOrder()
  }

  return (
    <div className='boardgame-collection' data-testid='collection-container'>
      {collection !== null ? (
        <section className='collection-header'>
          <h1 className='collection-title'>
            {collection.length} Juegos de {username}
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
      {collection !== null && loading ? (
        <section className='spinner-container'>
          <LoadingSpinner loading={true} />
        </section>
      ) : (
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
          <box-icon name={'sort-up'} color='white' size='35px'></box-icon>
        ) : (
          <box-icon name={'sort-down'} color='white' size='35px'></box-icon>
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
    //   <section className='sort-buttons'>
    //   {Object.keys(SortType).map((sortKey) => (
    //     <div
    //       className='sort-btn'
    //       key={SortType[sortKey].name}
    //       onClick={() => setSortFunc(SortType[sortKey])}
    //     >
    //       <input
    //         type='radio'
    //         name='sort'
    //         value={sortKey}
    //         onChange={setSortFunc}
    //         checked={SortType[sortKey].name === sortChecked.name}
    //       />
    //       <label>{SortType[sortKey].name}</label>
    //     </div>
    //   ))}
    // </section>
  )
}

SelectSort.propTypes = {
  handleSort: PropTypes.func,
  handleOrder: PropTypes.func,
  sortChecked: PropTypes.instanceOf(SortableProperty),
  sortOrder: PropTypes.number,
}
