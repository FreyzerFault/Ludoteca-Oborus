import PropTypes from 'prop-types'

import { useCollection } from '../hooks/useCollection'
import { BoardGameCard } from './BoardGameCard'
import { DataList } from './DataList'

import { ColType } from '../services/bgg'

export function BoardGameCollection({
  username = 'oborus',
  showExpansions = true,
  mock = false,
}) {
  const [collection] = useCollection({
    mock,
    showExpansions: showExpansions,
    username: username,
    colFilter: ColType.Owned,
  })

  return (
    <>
      <section className='collection-header'>
        <h1>{collection.length} Juegos de Oborus</h1>
      </section>
      <section className='grid search-results'>
        <DataList ComponentTemplate={BoardGameCard} data={collection} />
      </section>
    </>
  )
}

BoardGameCollection.propTypes = {
  username: PropTypes.string,
  showExpansions: PropTypes.bool,
  mock: PropTypes.bool,
}
