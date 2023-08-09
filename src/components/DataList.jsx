import PropTypes from 'prop-types'

// Muestra una lista de elementos
// REQUISITOS
// Cada elemento DEBE tener una propiedad [id]!!!!
// El Component debe tener un argumento [data]
export function DataList({ data, ComponentTemplate, className = '' }) {
  if (data === null) return

  return (
    <>
      {Array.isArray(data) && data?.length > 0 ? (
        <section className={className}>
          {data.map((child) => {
            return <ComponentTemplate key={child.id} data={child} />
          })}
        </section>
      ) : Array.isArray(data) && data.length === 0 ? (
        // Cuando la lista esté vacía
        <p className='no-results'>No hay resultados...</p>
      ) : (
        <></>
      )}
    </>
  )
}

DataList.propTypes = {
  ComponentTemplate: PropTypes.elementType.isRequired,
  data: PropTypes.array,
  className: PropTypes.string,
}
