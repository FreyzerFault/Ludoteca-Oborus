import PropTypes from 'prop-types'
import 'boxicons'

import { OborusLogoWithBackground } from './icons/OborusLogo'

import { IMG_NOT_FOUND_URL } from '../services/localData'

// import Easy from '/Dificultad/easy.svg'
// import Medium from '/Dificultad/medium.svg'
// import Hard from '/Dificultad/hard.svg'

export function BoardGameCard({ data }) {
  let img = data?.thumbnailUrl
  if (!img) img = IMG_NOT_FOUND_URL

  return (
    <div
      className={`boardgame-card ${data.owned ? 'owned' : ''}`}
      data-testid='boardgame-card'
    >
      {/* {data.owned && <OborusLogoWithBackground />} */}

      <a
        className='clickable'
        href={`https://boardgamegeek.com/boardgame/${data.id}`}
        target='_blank'
        rel='noreferrer'
      >
        {/* Jugadores Min - Max */}
        <Players minPlayers={data.minPlayers} maxPlayers={data.maxPlayers} />

        {/* Tiempo de Juego Min - Max ó Avg */}
        <Playtime
          avgPlaytime={data.avgPlayTime}
          minPlaytime={data.minPlaytime}
          maxPlaytime={data.maxPlaytime}
        />

        {/* MANUAL */}
        {/* <Manual title={data.name} /> */}

        {/* Imagen del Juego */}
        <div className='thumbnail-container'>
          <img
            className='thumbnail'
            src={img}
            alt={`${data.name} Thumbnail`}
            loading='lazy'
          />
          {/* Dificultad del Juego */}
          <Difficulty difficulty={data.difficulty} />
        </div>
        {/* Nombre del Juego */}
        <p className='name'>{data.name}</p>
      </a>
      <a
        className='video-link'
        target='_blank'
        rel='noreferrer'
        href={`https://www.youtube.com/results?search_query=como+jugar+${data.name.replaceAll(
          ' ',
          '+'
        )}`}
      >
        <img src='/yt icon.svg'></img>
      </a>
    </div>
  )
}

BoardGameCard.propTypes = {
  data: PropTypes.shape({
    imageUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.any,
    owned: PropTypes.bool,
    minPlayers: PropTypes.number,
    maxPlayers: PropTypes.number,
    avgPlayTime: PropTypes.number,
    minPlaytime: PropTypes.number,
    maxPlaytime: PropTypes.number,
    markAsOwned: PropTypes.bool,
    difficulty: PropTypes.number,
  }).isRequired,
}

function Players({ minPlayers, maxPlayers }) {
  return (
    (!isNaN(minPlayers) || !isNaN(maxPlayers)) && (
      <section className='players'>
        <box-icon name='group' type='solid' color='white' size='sm'></box-icon>
        {/* Tiene MÍNIMO y MÁXIMO de Jugadores */}
        {!isNaN(minPlayers) && !isNaN(maxPlayers) && (
          <span>
            {minPlayers}
            {maxPlayers !== minPlayers ? `- ${maxPlayers}` : ''}
          </span>
        )}
        {/* Solo tiene MÍNIMO de Jugadores */}
        {!isNaN(minPlayers) && isNaN(maxPlayers) && <span>{minPlayers}</span>}
        {/* Solo tiene MÁXIMO de Jugadores */}
        {isNaN(minPlayers) && !isNaN(maxPlayers) && <span>{maxPlayers}</span>}
      </section>
    )
  )
}

Players.propTypes = {
  maxPlayers: PropTypes.any,
  minPlayers: PropTypes.any,
}

function Playtime({ avgPlaytime, minPlaytime, maxPlaytime }) {
  const noMinMax = isNaN(minPlaytime) && isNaN(maxPlaytime)
  const noAvg = isNaN(avgPlaytime)
  const sameMinMax =
    !isNaN(minPlaytime) && !isNaN(maxPlaytime) && minPlaytime === maxPlaytime

  if (noAvg && noMinMax) return

  return (
    <section className='playtime'>
      <box-icon
        name='time-five'
        type='solid'
        color='white'
        size='sm'
      ></box-icon>

      {/* Tiene MÍNIMO y MÁXIMO de Playtime */}
      {!sameMinMax && (
        <>
          <span>{minPlaytime}</span>
          <span>-</span>
          <span>{maxPlaytime}</span>
        </>
      )}

      {/* MIN === MAX */}
      {sameMinMax && <span>{minPlaytime}</span>}

      {/* Solo tiene MEDIA de Playtime*/}
      {noMinMax && <span>{avgPlaytime}</span>}
    </section>
  )
}

Playtime.propTypes = {
  avgPlaytime: PropTypes.any,
  maxPlaytime: PropTypes.any,
  minPlaytime: PropTypes.any,
}

function Difficulty({ difficulty }) {
  if (isNaN(difficulty)) return null

  const difficulties = [
    { name: 'easy', max: 1.5, emoji: '😀' },
    { name: 'easy-medium', max: 2, emoji: '🫡' },
    { name: 'medium', max: 3, emoji: '🧐' },
    { name: 'medium-hard', max: 3.5, emoji: '🤯' },
    { name: 'hard', max: 5, emoji: '😵' },
  ]
  let difficultyName = ''

  for (const level of difficulties) {
    if (difficulty < level.max) {
      difficultyName = level.name
      break
    }
  }

  return (
    // <span src={`/Dificultad/${difficultyName}.svg`} className='difficulty-icon'>
    //   {difficulties.find(({ name, max }) => difficulty < max).emoji}
    // </span>
    <img src={`/${difficultyName}.svg`} className='difficulty-icon' />
  )
}

Difficulty.propTypes = {
  difficulty: PropTypes.any,
}

// function Manual({
//   manuales = [{ title: 'titulo', url: 'url' }],
//   title = 'Manual',
// }) {
//   const manual = manuales.find(
//     ({ _title }) => _title.toLowerCase() === title.toLowerCase()
//   )
//   return (
//     <a className='boardgame-manual' href={manual.url}>
//       {manual.title}
//     </a>
//   )
// }

// Manual.propTypes = {
//   manuales: PropTypes.arrayOf(
//     PropTypes.shape({ title: PropTypes.string, url: PropTypes.string })
//   ),
//   title: PropTypes.string,
// }
