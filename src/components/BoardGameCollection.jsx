import PropTypes from 'prop-types'
import 'boxicons'
import { useEffect, useState } from 'react'

import { SortType, SortOrder, SortGamesBy } from '../services/bgg/bgg'

import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'

export function BoardGameCollection({ username = 'oborus', collection = [] }) {
  const [sortType, setSortType] = useState(SortType.name)
  const [sortOrder, setSortOrder] = useState(SortOrder.Descending)

  useEffect(() => {
    setSortOrder(sortType?.defaultOrder)
  }, [sortType])

  const handleSort = (e) => {
    setSortType(SortType[e.target.value])
    // e.target.checked = true
  }

  const handleOrder = (e) => {
    setSortOrder(
      sortOrder === SortOrder.Descending
        ? SortOrder.Ascending
        : SortOrder.Descending
    )
  }

  return (
    <div className='boardgame-collection' data-testid='collection-container'>
      <section className='collection-header'>
        <h1 className='collection-title'>
          {collection.length} Juegos de {username}
        </h1>
        <SelectSort
          handleSort={handleSort}
          handleOrder={handleOrder}
          sortChecked={sortType}
          sortOrder={sortOrder}
        />
      </section>
      <DataList
        className='search-results'
        ComponentTemplate={BoardGameCard}
        data={SortGamesBy({ games: collection, sortType, sortOrder })}
      />
    </div>
  )
}

BoardGameCollection.propTypes = {
  username: PropTypes.string,
  collection: PropTypes.array,
}

function SelectSort({ handleSort, handleOrder, sortChecked, sortOrder }) {
  return (
    <section className='sort'>
      <button onClick={handleOrder}>
        <box-icon
          name={sortOrder == SortOrder.Ascending ? 'sort-down' : 'sort-up'}
          color='white'
          size='35px'
        ></box-icon>
      </button>
      <select
        name='sort'
        className='sort-select'
        defaultValue={sortChecked}
        onChange={handleSort}
      >
        {Object.keys(SortType).map((sortKey) => (
          <option
            className='sort-option'
            value={sortKey}
            key={SortType[sortKey].name}
          >
            {SortType[sortKey].name}
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
  sortChecked: PropTypes.any,
  sortOrder: PropTypes.number,
}
