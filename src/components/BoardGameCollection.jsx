import PropTypes from 'prop-types'

import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'

export function BoardGameCollection({ username = 'oborus', collection = [] }) {
  return (
    <>
      <section className='collection-header'>
        <h1>
          {collection.length} Juegos de {username}
        </h1>
      </section>
      <DataList
        className='search-results'
        ComponentTemplate={BoardGameCard}
        data={collection}
      />
    </>
  )
}

BoardGameCollection.propTypes = {
  username: PropTypes.string,
  collection: PropTypes.array,
}
