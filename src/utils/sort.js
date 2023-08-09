import PropTypes from 'prop-types'

export class NoDataError extends Error {}

// Orden de Ordenado [Ascendente o Descendente]
export const SortOrder = {
  Ascending: 1,
  Descending: -1,
}

// Tipo de Propiedad de la que se ordena
export class SortableProperty {
  name
  defaultOrder
  propertyName

  constructor(name, defaultOrder, propertyName) {
    this.name = name
    this.defaultOrder = defaultOrder
    this.propertyName = propertyName
  }

  sort(data, sortOrder) {
    const isDate = (text) => !isNaN(Date.parse(text))

    sortOrder ??= this.defaultOrder

    const sortedGames = [...data]
    const propName = this.propertyName
    const exampleValue = data[0][propName]

    // Comparacion de Strings
    const compareString = (a, b) =>
      sortOrder * a[propName].localeCompare(b[propName])

    // Comparacion de Strings que representan una Fecha
    const compareStringDate = (a, b) =>
      sortOrder * (Date.parse(a[propName]) - Date.parse(b[propName]))

    // Comparacion de objetos de clase Date
    const compareDate = (a, b) =>
      sortOrder * (a[propName].getTime() - b[propName].getTime())

    // Comparacion por defecto
    const compareNumber = (a, b) => sortOrder * (a[propName] - b[propName])

    switch (typeof exampleValue) {
      case 'string':
        return isDate(exampleValue)
          ? sortedGames.sort(compareStringDate)
          : sortedGames.sort(compareString)
      case 'Date':
        return sortedGames.sort(compareDate)
      case 'number':
      case 'boolean':
      default:
        return sortedGames.sort(compareNumber)
    }
  }
}

export async function SortByProperty({ data, sortableProp, sortOrder }) {
  return new Promise((resolve, reject) => {
    if (!data || data?.length === 0)
      reject(new NoDataError('No Data to be sort'))
    resolve(sortableProp.sort(data, sortOrder))
  })
}

SortByProperty.propTypes = {
  data: PropTypes.array.isRequired,
  sortableProp: PropTypes.instanceOf(SortableProperty).isRequired,
  sortOrder: PropTypes.oneOf([SortOrder.Ascending, SortOrder.Descending]),
}

export const SortableProperties = {
  dateAdded: new SortableProperty(
    'Fecha Adquisición',
    SortOrder.Descending,
    'dateAdded'
  ),
  votes: new SortableProperty('Popularidad', SortOrder.Descending, 'votes'),
  rating: new SortableProperty('Puntuación', SortOrder.Descending, 'avgRating'),
  ranking: new SortableProperty('Ranking', SortOrder.Ascending, 'ranking'),
  name: new SortableProperty('Nombre', SortOrder.Ascending, 'name'),
  difficulty: new SortableProperty(
    'Dificultad',
    SortOrder.Descending,
    'difficulty'
  ),
  players: new SortableProperty(
    'Límite de Jugadores',
    SortOrder.Descending,
    'maxPlayers'
  ),
  playtime: new SortableProperty(
    'Tiempo de Juego',
    SortOrder.Descending,
    'maxPlaytime'
  ),
}

// ORDENAR Juegos por una Propiedad
export async function SortGamesBy({
  data,
  sortableProp = SortableProperties.votes,
  sortOrder,
}) {
  return new Promise((resolve, reject) => {
    if (!data || data?.length === 0)
      reject(new NoDataError('No Data to be sort'))
    resolve(SortByProperty({ data, sortableProp, sortOrder }))
  })
}

SortGamesBy.propTypes = {
  data: PropTypes.array.isRequired,
  sortableProp: PropTypes.instanceOf(SortableProperty),
  sortOrder: PropTypes.oneOf([SortOrder.Ascending, SortOrder.Descending]),
}
