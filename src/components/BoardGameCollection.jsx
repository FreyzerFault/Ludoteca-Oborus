import PropTypes from 'prop-types'
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
    console.log({ value: e.target.value })
    e.target.checked = true
  }

  return (
    <div className='boardgame-collection' data-testid='collection-container'>
      <section className='collection-header'>
        <h1 className='collection-title'>
          {collection.length} Juegos de {username}
        </h1>
        <RadioSortButtons setSortFunc={setSortType} sortChecked={sortType} />
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

function RadioSortButtons({ setSortFunc, sortChecked }) {
  return (
    <section className='sort-buttons'>
      {Object.keys(SortType).map((sortKey) => (
        <div
          className='sort-btn'
          key={SortType[sortKey].name}
          onClick={() => setSortFunc(SortType[sortKey])}
        >
          <input
            type='radio'
            name='sort'
            value={sortKey}
            onChange={setSortFunc}
            checked={SortType[sortKey].name === sortChecked.name}
          />
          <label>{SortType[sortKey].name}</label>
        </div>
      ))}
    </section>
  )
}

RadioSortButtons.propTypes = {
  setSortFunc: PropTypes.func,
  sortChecked: PropTypes.any,
}
