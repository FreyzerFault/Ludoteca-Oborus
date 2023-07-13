import PropTypes from 'prop-types'
import 'boxicons'

import { OborusLogo } from './icons/OborusLogo'

import { IMG_NOT_FOUND_URL } from '../services/localData'

export function BoardGameCard({ data }) {
  let img = data?.thumbnailUrl
  if (!img) img = IMG_NOT_FOUND_URL

  return (
    <div className={`boardgame-card ${data.owned ? 'owned' : ''}`}>
      {data.owned && <OborusLogo />}

      <a
        className='clickable'
        href={`https://boardgamegeek.com/boardgame/${data.id}`}
        target='_blank'
        rel='noreferrer'
      >
        <Players minPlayers={data.minPlayers} maxPlayers={data.maxPlayers} />
        <Playtime
          avgPlaytime={data.avgPlayTime}
          minPlaytime={data.minPlaytime}
          maxPlaytime={data.maxPlaytime}
        />
        <img
          className='thumbnail'
          src={img}
          alt={`${data.name} Thumbnail`}
          loading='lazy'
        ></img>

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
    minPlayers: PropTypes.number,
    maxPlayers: PropTypes.number,
    avgPlayTime: PropTypes.number,
    minPlaytime: PropTypes.number,
    maxPlaytime: PropTypes.number,
  }).isRequired,
}

function Players({ minPlayers, maxPlayers }) {
  return (
    (!isNaN(minPlayers) || !isNaN(maxPlayers)) && (
      <section className='players'>
        <box-icon name='group' type='solid' color='white' size='sm'></box-icon>
        {/* Tiene MÍNIMO y MÁXIMO de Jugadores */}
        {!isNaN(minPlayers) && !isNaN(maxPlayers) && (
          <p>
            {minPlayers} - {maxPlayers}
          </p>
        )}
        {/* Solo tiene MÍNIMO de Jugadores */}
        {!isNaN(minPlayers) && isNaN(maxPlayers) && <p>{minPlayers}</p>}
        {/* Solo tiene MÁXIMO de Jugadores */}
        {isNaN(minPlayers) && !isNaN(maxPlayers) && <p>{maxPlayers}</p>}
      </section>
    )
  )
}

Players.propTypes = {
  maxPlayers: PropTypes.number,
  minPlayers: PropTypes.number,
}

function Playtime({ avgPlaytime, minPlaytime, maxPlaytime }) {
  return (
    (!isNaN(avgPlaytime) || (!isNaN(minPlaytime) && !isNaN(maxPlaytime))) && (
      <section className='playtime'>
        <box-icon
          name='time-five'
          type='solid'
          color='white'
          size='sm'
        ></box-icon>
        {/* Tiene MÍNIMO y MÁXIMO de Playtime */}
        {isNaN(avgPlaytime) && !isNaN(minPlaytime) && !isNaN(maxPlaytime) && (
          <p>
            {minPlaytime} - {maxPlaytime}
          </p>
        )}
        {/* Solo tiene MEDIA de Playtime*/}
        {!isNaN(avgPlaytime) && <p>{avgPlaytime}</p>}
      </section>
    )
  )
}

Playtime.propTypes = {
  avgPlaytime: PropTypes.number,
  maxPlaytime: PropTypes.number,
  minPlaytime: PropTypes.number,
}
