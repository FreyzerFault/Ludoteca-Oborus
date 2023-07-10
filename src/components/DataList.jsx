import PropTypes from 'prop-types'

// Muestra una lista de elementos
// REQUISITOS
// Cada elemento DEBE tener una propiedad [id]!!!!
// El Component debe tener un argumento [data]
export function DataList({ data = [], ComponentTemplate }) {
  if (data === null) return

  return typeof data === 'object' && data?.length > 0 ? (
    data.map((child) => {
      return <ComponentTemplate key={child.id} data={child} />
    })
  ) : Array.isArray(data) && data.length === 0 ? (
    // Cuando la lista esté vacía
    <p>No hay resultados...</p>
  ) : (
    <></>
  )
}

DataList.propTypes = {
  ComponentTemplate: PropTypes.elementType.isRequired,
  data: PropTypes.array,
}
