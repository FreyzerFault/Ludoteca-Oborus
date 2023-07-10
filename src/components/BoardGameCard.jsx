import PropTypes from 'prop-types'

import { IMG_NOT_FOUND_URL } from '../services/localData'

export function BoardGameCard({ data }) {
  let img = data?.imageUrl
  if (!img) img = IMG_NOT_FOUND_URL

  return (
    <div className='boardgame-card'>
      <img src={img} alt={`${data.name} Thumbnail`} loading='lazy' />
      <p className='name'>{data.name}</p>
    </div>
  )
}

BoardGameCard.propTypes = {
  data: PropTypes.shape({
    imageUrl: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
}
