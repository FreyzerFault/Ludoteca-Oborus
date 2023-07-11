import PropTypes from 'prop-types'

import { OborusLogo } from './icons/OborusLogo'

import { IMG_NOT_FOUND_URL } from '../services/localData'

export function BoardGameCard({ data }) {
  let img = data?.thumbnailUrl
  if (!img) img = IMG_NOT_FOUND_URL

  return (
    <div className={`boardgame-card`}>
      <a
        className='clickable'
        href={`https://boardgamegeek.com/boardgame/${data.id}`}
        target='_blank'
        rel='noreferrer'
      >
        {data.owned && <OborusLogo />}

        <img
          className='thumbnail'
          src={img}
          alt={`${data.name} Thumbnail`}
          loading='lazy'
        />

        <p className='name'>{data.name}</p>
      </a>
    </div>
  )
}

BoardGameCard.propTypes = {
  data: PropTypes.shape({
    imageUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.any,
    owned: PropTypes.bool,
  }).isRequired,
}
